import GradientBlinds from "@/components/GradientBlinds"
import Navbar from "@/components/Navbar"
import Icon from "@/components/ui/icon"

const matches = [
  { date: "10 мая", time: "18:00", home: "Зенит-Казань", away: "Белогорье", tournament: "Суперлига", live: true },
  { date: "10 мая", time: "20:00", home: "Локомотив", away: "Динамо Мск", tournament: "Суперлига", live: false },
  { date: "11 мая", time: "15:00", home: "Кузбасс", away: "Факел", tournament: "Суперлига", live: false },
  { date: "11 мая", time: "17:30", home: "Газпром-Югра", away: "Нова", tournament: "Суперлига", live: false },
  { date: "12 мая", time: "19:00", home: "Урал", away: "Зенит-Казань", tournament: "Суперлига", live: false },
]

const standings = [
  { pos: 1, team: "Зенит-Казань", played: 26, won: 22, lost: 4, points: 66 },
  { pos: 2, team: "Локомотив", played: 26, won: 20, lost: 6, points: 59 },
  { pos: 3, team: "Белогорье", played: 26, won: 18, lost: 8, points: 54 },
  { pos: 4, team: "Динамо Мск", played: 26, won: 16, lost: 10, points: 47 },
  { pos: 5, team: "Кузбасс", played: 26, won: 14, lost: 12, points: 42 },
  { pos: 6, team: "Факел", played: 26, won: 12, lost: 14, points: 36 },
  { pos: 7, team: "Газпром-Югра", played: 26, won: 10, lost: 16, points: 30 },
  { pos: 8, team: "Нова", played: 26, won: 8, lost: 18, points: 24 },
]

const teams = [
  { name: "Зенит-Казань", city: "Казань", titles: 14, founded: 1976, color: "from-blue-600 to-blue-800", emoji: "🔵" },
  { name: "Локомотив", city: "Новосибирск", titles: 9, founded: 1957, color: "from-red-600 to-red-800", emoji: "🔴" },
  { name: "Белогорье", city: "Белгород", titles: 8, founded: 1976, color: "from-green-600 to-green-800", emoji: "🟢" },
  { name: "Динамо", city: "Москва", titles: 6, founded: 1923, color: "from-indigo-600 to-indigo-800", emoji: "🟣" },
  { name: "Кузбасс", city: "Кемерово", titles: 2, founded: 1972, color: "from-yellow-600 to-yellow-800", emoji: "🟡" },
  { name: "Факел", city: "Новый Уренгой", titles: 1, founded: 1981, color: "from-orange-600 to-orange-800", emoji: "🟠" },
]

const Index = () => {
  return (
    <main className="relative overflow-hidden bg-[#0a0f1e]">
      <Navbar />

      {/* Animated Gradient Background — только для hero */}
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
                <button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-white/90 shadow-2xl">
                  Смотреть трансляции
                </button>
                <button className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:border-white/50 shadow-xl">
                  Турнирные таблицы
                  <Icon name="ChevronRight" className="ml-2" size={20} />
                </button>
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
          <div className="flex flex-col gap-3">
            {matches.map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4 min-w-[110px]">
                  {match.live ? (
                    <span className="flex items-center gap-1.5 text-red-400 font-semibold text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <div className="text-white/50 text-sm">
                      <div>{match.date}</div>
                      <div className="font-semibold text-white/80">{match.time}</div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center gap-4 text-center">
                  <span className="text-white font-semibold text-right flex-1">{match.home}</span>
                  <span className="text-white/40 text-sm font-bold px-3">VS</span>
                  <span className="text-white font-semibold text-left flex-1">{match.away}</span>
                </div>
                <div className="min-w-[120px] text-right">
                  <span className="text-xs text-white/40 bg-white/10 rounded-full px-3 py-1">{match.tournament}</span>
                </div>
              </div>
            ))}
          </div>
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
            {standings.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[40px_1fr_60px_60px_60px_70px] px-6 py-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${row.pos <= 3 ? "bg-blue-500/5" : ""}`}
              >
                <span className={`font-bold text-sm ${row.pos === 1 ? "text-yellow-400" : row.pos <= 3 ? "text-blue-400" : "text-white/40"}`}>
                  {row.pos}
                </span>
                <span className="text-white font-medium">{row.team}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team, i) => (
              <div
                key={i}
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
        </div>
      </section>
    </main>
  )
}

export default Index
