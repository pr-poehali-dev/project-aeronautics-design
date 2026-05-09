const API_URL = "https://functions.poehali.dev/97ecb47c-7092-43af-86ea-d77883094ad6"

async function request(method: string, resource: string, id?: number | string, body?: unknown, extra?: string) {
  let url = `${API_URL}/?resource=${resource}`
  if (id !== undefined) url += `&id=${id}`
  if (extra) url += `&${extra}`
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export const api = {
  getTeams: () => request("GET", "teams"),
  createTeam: (data: unknown) => request("POST", "teams", undefined, data),
  updateTeam: (id: number, data: unknown) => request("PUT", "teams", id, data),
  deleteTeam: (id: number) => request("DELETE", "teams", id),

  getMatches: () => request("GET", "matches"),
  getMatch: (id: number) => request("GET", "matches", id),
  createMatch: (data: unknown) => request("POST", "matches", undefined, data),
  updateMatch: (id: number, data: unknown) => request("PUT", "matches", id, data),
  deleteMatch: (id: number) => request("DELETE", "matches", id),

  getStandings: () => request("GET", "standings"),

  getPlayers: (teamId?: number) => request("GET", "players", undefined, undefined, teamId ? `team_id=${teamId}` : undefined),
  createPlayer: (data: unknown) => request("POST", "players", undefined, data),
  updatePlayer: (id: number, data: unknown) => request("PUT", "players", id, data),
  deletePlayer: (id: number) => request("DELETE", "players", id),
}
