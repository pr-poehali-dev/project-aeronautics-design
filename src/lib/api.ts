const API_URL = "https://functions.poehali.dev/97ecb47c-7092-43af-86ea-d77883094ad6"

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export const api = {
  getTeams: () => request("GET", "/teams"),
  createTeam: (data: unknown) => request("POST", "/teams", data),
  updateTeam: (id: number, data: unknown) => request("PUT", `/teams/${id}`, data),
  deleteTeam: (id: number) => request("DELETE", `/teams/${id}`),

  getMatches: () => request("GET", "/matches"),
  getMatch: (id: number) => request("GET", `/matches/${id}`),
  createMatch: (data: unknown) => request("POST", "/matches", data),
  updateMatch: (id: number, data: unknown) => request("PUT", `/matches/${id}`, data),
  deleteMatch: (id: number) => request("DELETE", `/matches/${id}`),

  getStandings: () => request("GET", "/standings"),

  getPlayers: (teamId?: number) => request("GET", teamId ? `/players?team_id=${teamId}` : "/players"),
  createPlayer: (data: unknown) => request("POST", "/players", data),
  updatePlayer: (id: number, data: unknown) => request("PUT", `/players/${id}`, data),
  deletePlayer: (id: number) => request("DELETE", `/players/${id}`),
}
