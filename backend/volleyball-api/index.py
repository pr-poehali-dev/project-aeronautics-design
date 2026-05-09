"""
API для волейбольного портала: команды, матчи, игроки, турнирная таблица.
Поддерживает GET (чтение) и POST/PUT/DELETE (управление через админку).
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def ok(data):
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS_HEADERS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # GET /teams
    if method == "GET" and path == "/teams":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM teams ORDER BY titles DESC")
                return ok({"teams": [dict(r) for r in cur.fetchall()]})

    # POST /teams — создать команду
    if method == "POST" and path == "/teams":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO teams (name, city, founded, titles, color, emoji) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                    (body["name"], body["city"], body.get("founded"), body.get("titles", 0), body.get("color", "from-blue-600 to-blue-800"), body.get("emoji", "🔵"))
                )
                conn.commit()
                return ok(dict(cur.fetchone()))

    # PUT /teams/{id} — обновить команду
    if method == "PUT" and path.startswith("/teams/"):
        team_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "UPDATE teams SET name=%s, city=%s, founded=%s, titles=%s, color=%s, emoji=%s WHERE id=%s RETURNING *",
                    (body["name"], body["city"], body.get("founded"), body.get("titles", 0), body.get("color"), body.get("emoji"), team_id)
                )
                conn.commit()
                row = cur.fetchone()
                return ok(dict(row)) if row else err("Not found", 404)

    # DELETE /teams/{id}
    if method == "DELETE" and path.startswith("/teams/"):
        team_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM teams WHERE id=%s", (team_id,))
                conn.commit()
                return ok({"deleted": True})

    # GET /matches
    if method == "GET" and path == "/matches":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT m.*, 
                        ht.name AS home_name, at.name AS away_name
                    FROM matches m
                    JOIN teams ht ON ht.id = m.home_team_id
                    JOIN teams at ON at.id = m.away_team_id
                    ORDER BY m.match_date ASC, m.match_time ASC
                """)
                return ok({"matches": [dict(r) for r in cur.fetchall()]})

    # GET /matches/{id}
    if method == "GET" and path.startswith("/matches/") and len(path.split("/")) == 3:
        match_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT m.*,
                        ht.name AS home_name, at.name AS away_name
                    FROM matches m
                    JOIN teams ht ON ht.id = m.home_team_id
                    JOIN teams at ON at.id = m.away_team_id
                    WHERE m.id = %s
                """, (match_id,))
                row = cur.fetchone()
                if not row:
                    return err("Not found", 404)
                match = dict(row)
                # players
                cur.execute("SELECT * FROM players WHERE team_id=%s ORDER BY number", (match["home_team_id"],))
                match["home_players"] = [dict(r) for r in cur.fetchall()]
                cur.execute("SELECT * FROM players WHERE team_id=%s ORDER BY number", (match["away_team_id"],))
                match["away_players"] = [dict(r) for r in cur.fetchall()]
                return ok(match)

    # POST /matches — создать матч
    if method == "POST" and path == "/matches":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """INSERT INTO matches (home_team_id, away_team_id, home_score, away_score, status, tournament, match_date, match_time, stream_url, sets, stats)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                    (body["home_team_id"], body["away_team_id"],
                     body.get("home_score", 0), body.get("away_score", 0),
                     body.get("status", "upcoming"), body.get("tournament", "Суперлига"),
                     body["match_date"], body["match_time"],
                     body.get("stream_url", ""),
                     json.dumps(body.get("sets", []), ensure_ascii=False),
                     json.dumps(body.get("stats", []), ensure_ascii=False))
                )
                conn.commit()
                return ok({"id": cur.fetchone()["id"]})

    # PUT /matches/{id} — обновить матч
    if method == "PUT" and path.startswith("/matches/"):
        match_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """UPDATE matches SET home_team_id=%s, away_team_id=%s, home_score=%s, away_score=%s,
                       status=%s, tournament=%s, match_date=%s, match_time=%s, stream_url=%s, sets=%s, stats=%s
                       WHERE id=%s RETURNING id""",
                    (body["home_team_id"], body["away_team_id"],
                     body.get("home_score", 0), body.get("away_score", 0),
                     body.get("status", "upcoming"), body.get("tournament", "Суперлига"),
                     body["match_date"], body["match_time"],
                     body.get("stream_url", ""),
                     json.dumps(body.get("sets", []), ensure_ascii=False),
                     json.dumps(body.get("stats", []), ensure_ascii=False),
                     match_id)
                )
                conn.commit()
                return ok({"updated": True})

    # DELETE /matches/{id}
    if method == "DELETE" and path.startswith("/matches/"):
        match_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM matches WHERE id=%s", (match_id,))
                conn.commit()
                return ok({"deleted": True})

    # GET /players?team_id=1
    if method == "GET" and path == "/players":
        params = event.get("queryStringParameters") or {}
        team_id = params.get("team_id")
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if team_id:
                    cur.execute("SELECT * FROM players WHERE team_id=%s ORDER BY number", (team_id,))
                else:
                    cur.execute("SELECT p.*, t.name AS team_name FROM players p JOIN teams t ON t.id=p.team_id ORDER BY p.team_id, p.number")
                return ok({"players": [dict(r) for r in cur.fetchall()]})

    # POST /players
    if method == "POST" and path == "/players":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "INSERT INTO players (team_id, name, number, position) VALUES (%s,%s,%s,%s) RETURNING *",
                    (body["team_id"], body["name"], body["number"], body["position"])
                )
                conn.commit()
                return ok(dict(cur.fetchone()))

    # PUT /players/{id}
    if method == "PUT" and path.startswith("/players/"):
        player_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "UPDATE players SET team_id=%s, name=%s, number=%s, position=%s WHERE id=%s RETURNING *",
                    (body["team_id"], body["name"], body["number"], body["position"], player_id)
                )
                conn.commit()
                row = cur.fetchone()
                return ok(dict(row)) if row else err("Not found", 404)

    # DELETE /players/{id}
    if method == "DELETE" and path.startswith("/players/"):
        player_id = path.split("/")[-1]
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM players WHERE id=%s", (player_id,))
                conn.commit()
                return ok({"deleted": True})

    # GET /standings
    if method == "GET" and path == "/standings":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT t.id, t.name,
                        COUNT(m.id) AS played,
                        SUM(CASE WHEN (m.home_team_id=t.id AND m.home_score>m.away_score) OR (m.away_team_id=t.id AND m.away_score>m.home_score) THEN 1 ELSE 0 END) AS won,
                        SUM(CASE WHEN (m.home_team_id=t.id AND m.home_score<m.away_score) OR (m.away_team_id=t.id AND m.away_score<m.home_score) THEN 1 ELSE 0 END) AS lost,
                        SUM(CASE WHEN (m.home_team_id=t.id AND m.home_score>m.away_score) OR (m.away_team_id=t.id AND m.away_score>m.home_score) THEN 3
                                 WHEN m.home_score=m.away_score THEN 1 ELSE 0 END) AS points
                    FROM teams t
                    LEFT JOIN matches m ON (m.home_team_id=t.id OR m.away_team_id=t.id) AND m.status='finished'
                    GROUP BY t.id, t.name
                    ORDER BY points DESC, won DESC
                """)
                rows = [dict(r) for r in cur.fetchall()]
                for i, r in enumerate(rows):
                    r["pos"] = i + 1
                return ok({"standings": rows})

    return err("Not found", 404)
