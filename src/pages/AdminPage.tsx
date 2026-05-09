import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"

type Team = { id: number; name: string; city: string; founded: number; titles: number; color: string; emoji: string }
type Match = { id: number; home_name: string; away_name: string; home_team_id: number; away_team_id: number; home_score: number; away_score: number; status: string; tournament: string; match_date: string; match_time: string; stream_url: string; sets: { home: number; away: number }[]; stats: unknown[] }
type Player = { id: number; team_id: number; team_name: string; name: string; number: number; position: string }

type Tab = "matches" | "teams" | "players"

const STATUS_LABELS: Record<string, string> = { live: "LIVE", finished: "Завершён", upcoming: "Предстоящий" }
const STATUS_COLORS: Record<string, string> = { live: "text-red-400 bg-red-500/20", finished: "text-white/40 bg-white/10", upcoming: "text-blue-400 bg-blue-500/20" }

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("matches")
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  // Match modal
  const [matchModal, setMatchModal] = useState<Partial<Match> | null>(null)
  // Team modal
  const [teamModal, setTeamModal] = useState<Partial<Team> | null>(null)
  // Player modal
  const [playerModal, setPlayerModal] = useState<Partial<Player> | null>(null)

  const load = async () => {
    setLoading(true)
    const [t, m, p] = await Promise.all([api.getTeams(), api.getMatches(), api.getPlayers()])
    setTeams(t.teams || [])
    setMatches(m.matches || [])
    setPlayers(p.players || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // --- Match save ---
  const saveMatch = async () => {
    if (!matchModal) return
    if (matchModal.id) {
      await api.updateMatch(matchModal.id, matchModal)
    } else {
      await api.createMatch(matchModal)
    }
    setMatchModal(null)
    load()
  }

  // --- Team save ---
  const saveTeam = async () => {
    if (!teamModal) return
    if (teamModal.id) {
      await api.updateTeam(teamModal.id, teamModal)
    } else {
      await api.createTeam(teamModal)
    }
    setTeamModal(null)
    load()
  }

  // --- Player save ---
  const savePlayer = async () => {
    if (!playerModal) return
    if (playerModal.id) {
      await api.updatePlayer(playerModal.id, playerModal)
    } else {
      await api.createPlayer(playerModal)
    }
    setPlayerModal(null)
    load()
  }

  const deleteMatch = async (id: number) => {
    if (!confirm("Удалить матч?")) return
    await api.deleteMatch(id)
    load()
  }

  const deleteTeam = async (id: number) => {
    if (!confirm("Удалить команду?")) return
    await api.deleteTeam(id)
    load()
  }

  const deletePlayer = async (id: number) => {
    if (!confirm("Удалить игрока?")) return
    await api.deletePlayer(id)
    load()
  }

  const inputCls = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 text-sm"
  const labelCls = "block text-white/50 text-xs mb-1"

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            На сайт
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Icon name="Settings" size={14} className="text-white" />
            </div>
            <span className="font-semibold">Админ-панель</span>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
          <Icon name="RefreshCw" size={14} />
          Обновить
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {([
            { key: "matches", label: "Матчи", icon: "Calendar", count: matches.length },
            { key: "teams", label: "Команды", icon: "Shield", count: teams.length },
            { key: "players", label: "Игроки", icon: "Users", count: players.length },
          ] as { key: Tab; label: string; icon: string; count: number }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? "bg-blue-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-white/10"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-white/30">
            <Icon name="Loader2" size={24} className="animate-spin mr-3" />
            Загрузка...
          </div>
        )}

        {/* MATCHES */}
        {!loading && tab === "matches" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Матчи</h2>
              <button onClick={() => setMatchModal({ home_score: 0, away_score: 0, status: "upcoming", tournament: "Суперлига", sets: [], stats: [] })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Icon name="Plus" size={16} /> Добавить матч
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {matches.map(m => (
                <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>{STATUS_LABELS[m.status]}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-white font-medium">{m.home_name}</span>
                    <span className="text-white/30 text-sm">vs</span>
                    <span className="text-white font-medium">{m.away_name}</span>
                    {m.status !== "upcoming" && (
                      <span className="text-white/50 text-sm font-mono">{m.home_score}:{m.away_score}</span>
                    )}
                  </div>
                  <span className="text-white/30 text-sm">{m.match_date} {m.match_time}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setMatchModal({ ...m, sets: m.sets || [], stats: m.stats || [] })}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button onClick={() => deleteMatch(m.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS */}
        {!loading && tab === "teams" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Команды</h2>
              <button onClick={() => setTeamModal({ titles: 0, color: "from-blue-600 to-blue-800", emoji: "🔵" })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Icon name="Plus" size={16} /> Добавить команду
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map(t => (
                <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-lg flex-shrink-0`}>{t.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.city} · {t.titles} титулов</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTeamModal({ ...t })}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button onClick={() => deleteTeam(t.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLAYERS */}
        {!loading && tab === "players" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Игроки</h2>
              <button onClick={() => setPlayerModal({})}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Icon name="Plus" size={16} /> Добавить игрока
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {players.map(p => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center flex-shrink-0">{p.number}</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">{p.name}</span>
                    <span className="text-white/30 mx-2">·</span>
                    <span className="text-white/50 text-sm">{p.position}</span>
                  </div>
                  <span className="text-white/30 text-xs">{p.team_name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPlayerModal({ ...p })}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button onClick={() => deletePlayer(p.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MATCH MODAL */}
      {matchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1629] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{matchModal.id ? "Редактировать матч" : "Новый матч"}</h3>
              <button onClick={() => setMatchModal(null)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Хозяева</label>
                  <select className={inputCls} value={matchModal.home_team_id ?? ""} onChange={e => setMatchModal(p => ({ ...p!, home_team_id: +e.target.value }))}>
                    <option value="">Выберите...</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Гости</label>
                  <select className={inputCls} value={matchModal.away_team_id ?? ""} onChange={e => setMatchModal(p => ({ ...p!, away_team_id: +e.target.value }))}>
                    <option value="">Выберите...</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Счёт хозяев (сеты)</label>
                  <input type="number" className={inputCls} value={matchModal.home_score ?? 0} onChange={e => setMatchModal(p => ({ ...p!, home_score: +e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Счёт гостей (сеты)</label>
                  <input type="number" className={inputCls} value={matchModal.away_score ?? 0} onChange={e => setMatchModal(p => ({ ...p!, away_score: +e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Статус</label>
                  <select className={inputCls} value={matchModal.status ?? "upcoming"} onChange={e => setMatchModal(p => ({ ...p!, status: e.target.value }))}>
                    <option value="upcoming">Предстоящий</option>
                    <option value="live">LIVE</option>
                    <option value="finished">Завершён</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Дата</label>
                  <input type="date" className={inputCls} value={matchModal.match_date ?? ""} onChange={e => setMatchModal(p => ({ ...p!, match_date: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Время</label>
                  <input type="time" className={inputCls} value={matchModal.match_time ?? ""} onChange={e => setMatchModal(p => ({ ...p!, match_time: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Турнир</label>
                <input className={inputCls} value={matchModal.tournament ?? ""} onChange={e => setMatchModal(p => ({ ...p!, tournament: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Ссылка на трансляцию (embed URL)</label>
                <input className={inputCls} placeholder="https://www.youtube.com/embed/..." value={matchModal.stream_url ?? ""} onChange={e => setMatchModal(p => ({ ...p!, stream_url: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveMatch} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-colors">Сохранить</button>
              <button onClick={() => setMatchModal(null)} className="px-6 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM MODAL */}
      {teamModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1629] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{teamModal.id ? "Редактировать команду" : "Новая команда"}</h3>
              <button onClick={() => setTeamModal(null)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Название</label>
                <input className={inputCls} value={teamModal.name ?? ""} onChange={e => setTeamModal(p => ({ ...p!, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Город</label>
                  <input className={inputCls} value={teamModal.city ?? ""} onChange={e => setTeamModal(p => ({ ...p!, city: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Год основания</label>
                  <input type="number" className={inputCls} value={teamModal.founded ?? ""} onChange={e => setTeamModal(p => ({ ...p!, founded: +e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Титулов</label>
                  <input type="number" className={inputCls} value={teamModal.titles ?? 0} onChange={e => setTeamModal(p => ({ ...p!, titles: +e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Эмодзи</label>
                  <input className={inputCls} value={teamModal.emoji ?? ""} onChange={e => setTeamModal(p => ({ ...p!, emoji: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveTeam} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-colors">Сохранить</button>
              <button onClick={() => setTeamModal(null)} className="px-6 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER MODAL */}
      {playerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1629] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{playerModal.id ? "Редактировать игрока" : "Новый игрок"}</h3>
              <button onClick={() => setPlayerModal(null)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Имя</label>
                <input className={inputCls} value={playerModal.name ?? ""} onChange={e => setPlayerModal(p => ({ ...p!, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Номер</label>
                  <input type="number" className={inputCls} value={playerModal.number ?? ""} onChange={e => setPlayerModal(p => ({ ...p!, number: +e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Позиция</label>
                  <select className={inputCls} value={playerModal.position ?? ""} onChange={e => setPlayerModal(p => ({ ...p!, position: e.target.value }))}>
                    <option value="">Выберите...</option>
                    {["Доигровщик", "Диагональный", "Блокирующий", "Связующий", "Либеро"].map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Команда</label>
                <select className={inputCls} value={playerModal.team_id ?? ""} onChange={e => setPlayerModal(p => ({ ...p!, team_id: +e.target.value }))}>
                  <option value="">Выберите...</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={savePlayer} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-colors">Сохранить</button>
              <button onClick={() => setPlayerModal(null)} className="px-6 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
