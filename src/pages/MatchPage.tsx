import { useParams, Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Icon from "@/components/ui/icon"

const matchData: Record<string, {
  home: string
  away: string
  homeScore: number
  awayScore: number
  status: "live" | "finished" | "upcoming"
  minute?: number
  tournament: string
  date: string
  time: string
  streamUrl: string
  sets: { home: number; away: number }[]
  stats: { label: string; home: number | string; away: number | string; homeVal: number; awayVal: number }[]
  homePlayers: { number: number; name: string; position: string }[]
  awayPlayers: { number: number; name: string; position: string }[]
}> = {
  "1": {
    home: "Зенит-Казань",
    away: "Белогорье",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    minute: 3,
    tournament: "Суперлига",
    date: "10 мая 2025",
    time: "18:00",
    streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    sets: [
      { home: 25, away: 22 },
      { home: 23, away: 25 },
      { home: 18, away: 14 },
    ],
    stats: [
      { label: "Атакующие удары", home: 42, away: 37, homeVal: 53, awayVal: 47 },
      { label: "Эффективность подачи", home: "68%", away: "61%", homeVal: 68, awayVal: 61 },
      { label: "Блоки", home: 8, away: 5, homeVal: 62, awayVal: 38 },
      { label: "Ошибки", home: 12, away: 17, homeVal: 41, awayVal: 59 },
      { label: "Эйсы", home: 4, away: 3, homeVal: 57, awayVal: 43 },
    ],
    homePlayers: [
      { number: 1, name: "Максим Михайлов", position: "Доигровщик" },
      { number: 3, name: "Алексей Вербов", position: "Либеро" },
      { number: 7, name: "Артём Вольвич", position: "Блокирующий" },
      { number: 10, name: "Александр Бутько", position: "Связующий" },
      { number: 14, name: "Дмитрий Ильиных", position: "Диагональный" },
      { number: 18, name: "Евгений Сивожелез", position: "Блокирующий" },
    ],
    awayPlayers: [
      { number: 2, name: "Сергей Тетюхин", position: "Доигровщик" },
      { number: 5, name: "Алексей Казаков", position: "Либеро" },
      { number: 8, name: "Тарас Хтей", position: "Блокирующий" },
      { number: 11, name: "Павел Круглов", position: "Связующий" },
      { number: 15, name: "Дмитрий Мусэрский", position: "Диагональный" },
      { number: 19, name: "Александр Косарев", position: "Блокирующий" },
    ],
  },
}

export default function MatchPage() {
  const { id } = useParams()
  const match = matchData[id ?? "1"] ?? matchData["1"]

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 sm:px-10 pt-28 pb-20">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm">
          <Icon name="ArrowLeft" size={16} />
          Назад к расписанию
        </Link>

        {/* Score Header */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/40 text-sm">{match.tournament} · {match.date}</span>
            {match.status === "live" && (
              <span className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-4 py-1.5 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                LIVE · Сет {match.sets.length}
              </span>
            )}
            {match.status === "finished" && (
              <span className="bg-white/10 text-white/60 border border-white/10 rounded-full px-4 py-1.5 text-sm">
                Завершён
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white mb-2">{match.home}</div>
            </div>
            <div className="flex items-center gap-6 px-8">
              <span className="text-6xl font-black text-white tabular-nums">{match.homeScore}</span>
              <span className="text-3xl text-white/30 font-light">:</span>
              <span className="text-6xl font-black text-white tabular-nums">{match.awayScore}</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white mb-2">{match.away}</div>
            </div>
          </div>

          {/* Sets */}
          <div className="flex justify-center gap-3 mt-6">
            {match.sets.map((set, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-white/30 text-xs">Сет {i + 1}</span>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                  <span className={`font-bold tabular-nums ${set.home > set.away ? "text-white" : "text-white/40"}`}>{set.home}</span>
                  <span className="text-white/20 text-xs">:</span>
                  <span className={`font-bold tabular-nums ${set.away > set.home ? "text-white" : "text-white/40"}`}>{set.away}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stream */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <Icon name="Tv" size={20} className="text-blue-400" />
            <span className="font-semibold text-white">Трансляция</span>
            {match.status === "live" && (
              <span className="flex items-center gap-1.5 text-red-400 text-sm font-medium ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Прямой эфир
              </span>
            )}
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={match.streamUrl}
              title="Трансляция матча"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="BarChart2" size={20} className="text-yellow-400" />
              <span className="font-semibold text-white">Статистика</span>
            </div>
            <div className="flex flex-col gap-5">
              {match.stats.map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold text-sm tabular-nums">{stat.home}</span>
                    <span className="text-white/40 text-xs">{stat.label}</span>
                    <span className="text-white font-semibold text-sm tabular-nums">{stat.away}</span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{ width: `${stat.homeVal}%` }}
                    />
                    <div
                      className="bg-indigo-400 transition-all"
                      style={{ width: `${stat.awayVal}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lineups */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Users" size={20} className="text-green-400" />
              <span className="font-semibold text-white">Составы</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-3">{match.home}</div>
                <div className="flex flex-col gap-2">
                  {match.homePlayers.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {p.number}
                      </span>
                      <div>
                        <div className="text-white text-sm font-medium leading-tight">{p.name}</div>
                        <div className="text-white/40 text-xs">{p.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-3">{match.away}</div>
                <div className="flex flex-col gap-2">
                  {match.awayPlayers.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {p.number}
                      </span>
                      <div>
                        <div className="text-white text-sm font-medium leading-tight">{p.name}</div>
                        <div className="text-white/40 text-xs">{p.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
