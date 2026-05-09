import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GradientBlinds from "@/components/GradientBlinds"
import Navbar from "@/components/Navbar"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"

type Match = { id: number; home_name: string; away_name: string; home_score: number; away_score: number; status: string; tournament: string; match_date: string; match_time: string }
type Standing = { id: number; name: string; played: number; won: number; lost: number; points: number; pos: number }
type Team = { id: number; name: string; city: string; founded: number; titles: number; color: string; emoji: string }

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [standings, setStandings] = useState<Standing[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getMatches(), api.getStandings(), api.getTeams()]).then(([m, s, t]) => {
      setMatches(m.matches || [])
      setStandings(s.standings || [])
      setTeams(t.teams || [])
      setLoading(false)
    })
  }, [])

  const formatDate = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
  const formatTime = (t: string) => t.slice(0, 5)

  return (
    <main className="relative overflow-hidden bg-[#0a0f1e]">
      <Navbar />

      <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <GradientBlinds
          gradientColors={["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]}
          angle={15}
          noise={0.25}
          blindCount={13}
          blindMinWidth={50}
          spotlightRadius={0.38}
          spotlightSoftness={1.6}
          spotlightOpacity={0.42}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="overlay"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen w-full px-5 sm:px-20">
            <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8 text-center">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl text-balance drop-shadow-2xl">
                Волейбол —
                <br />
                живи игрой
              </h1>
              <p className="text-xl text-white/90 max-w-3xl text-pretty drop-shadow-lg">
                Прямые трансляции матчей, актуальные турнирные таблицы и всё о командах — в одном месте. Не пропусти ни одного важного момента.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a href="#schedule" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-white/90 shadow-2xl">
                  Смотреть трансляции
                </a>
                <a href="#standings" className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50 shadow-xl">
                  Турнирные таблицы
                  <Icon name="ChevronRight" className="ml-2" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <section id="schedule" className="relative z-10 py-20 px-5 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Icon name="Calendar" size={28} className="text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Ближайшие матчи</h2>
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-white/30 py-10">
              <Icon name="Loader2" size={20} className="animate-spin" /> Загрузка...
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {matches.map((match) => (
                <Link
                  to={`/match/${match.id}`}
                  key={match.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-[110px]">
                    {match.status === "live" ? (
                      <span className="flex items-center gap-1.5 text-red-400 font-semibold text-sm">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <div className="text-white/50 text-sm">
                        <div>{formatDate(match.match_date)}</div>
                        <div className="font-semibold text-white/80">{formatTime(match.match_time)}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-4 text-center">
                    <span className="text-white font-semibold text-right flex-1">{match.home_name}</span>
                    {match.status !== "upcoming" ? (
                      <span className="text-white font-bold px-3 tabular-nums">{match.home_score}:{match.away_score}</span>
                    ) : (
                      <span className="text-white/40 text-sm font-bold px-3">VS</span>
                    )}
                    <span className="text-white font-semibold text-left flex-1">{match.away_name}</span>
                  </div>
                  <div className="min-w-[120px] text-right">
                    <span className="text-xs text-white/40 bg-white/10 rounded-full px-3 py-1">{match.tournament}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Standings Section */}
      <section id="standings" className="relative z-10 py-20 px-5 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Icon name="Trophy" size={28} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Турнирная таблица</h2>
            <span className="ml-2 text-sm text-white/40 bg-white/10 rounded-full px-3 py-1">Суперлига 2024/25</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_60px_60px_60px_70px] px-6 py-3 text-xs text-white/40 uppercase tracking-wider border-b border-white/10">
              <span>#</span>
              <span>Команда</span>
              <span className="text-center">И</span>
              <span className="text-center">В</span>
              <span className="text-center">П</span>
              <span className="text-center font-bold">О</span>
            </div>
            {loading ? (
              <div className="flex items-center gap-3 text-white/30 px-6 py-8">
                <Icon name="Loader2" size={20} className="animate-spin" /> Загрузка...
              </div>
            ) : standings.map((row) => (
              <div
                key={row.id}
                className={`grid grid-cols-[40px_1fr_60px_60px_60px_70px] px-6 py-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${row.pos <= 3 ? "bg-blue-500/5" : ""}`}
              >
                <span className={`font-bold text-sm ${row.pos === 1 ? "text-yellow-400" : row.pos <= 3 ? "text-blue-400" : "text-white/40"}`}>
                  {row.pos}
                </span>
                <span className="text-white font-medium">{row.name}</span>
                <span className="text-white/60 text-center text-sm">{row.played}</span>
                <span className="text-white/60 text-center text-sm">{row.won}</span>
                <span className="text-white/60 text-center text-sm">{row.lost}</span>
                <span className="text-white font-bold text-center">{row.points}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams" className="relative z-10 py-20 px-5 sm:px-10 lg:px-20 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Icon name="Users" size={28} className="text-green-400" />
            <h2 className="text-3xl font-bold text-white">Команды</h2>
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-white/30 py-10">
              <Icon name="Loader2" size={20} className="animate-spin" /> Загрузка...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${team.color} flex items-center justify-center text-2xl mb-4`}>
                    {team.emoji}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{team.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{team.city} · с {team.founded}</p>
                  <div className="flex items-center gap-2">
                    <Icon name="Trophy" size={14} className="text-yellow-400" />
                    <span className="text-white/70 text-sm">{team.titles} титулов чемпиона</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Index
