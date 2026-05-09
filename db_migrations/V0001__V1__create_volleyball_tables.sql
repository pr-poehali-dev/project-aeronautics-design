
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  founded INTEGER,
  titles INTEGER DEFAULT 0,
  color VARCHAR(50) DEFAULT 'from-blue-600 to-blue-800',
  emoji VARCHAR(10) DEFAULT '🔵',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  home_team_id INTEGER REFERENCES teams(id),
  away_team_id INTEGER REFERENCES teams(id),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming',
  tournament VARCHAR(100) DEFAULT 'Суперлига',
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  stream_url TEXT DEFAULT '',
  sets JSONB DEFAULT '[]',
  stats JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id),
  name VARCHAR(100) NOT NULL,
  number INTEGER NOT NULL,
  position VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO teams (name, city, founded, titles, color, emoji) VALUES
  ('Зенит-Казань', 'Казань', 1976, 14, 'from-blue-600 to-blue-800', '🔵'),
  ('Локомотив', 'Новосибирск', 1957, 9, 'from-red-600 to-red-800', '🔴'),
  ('Белогорье', 'Белгород', 1976, 8, 'from-green-600 to-green-800', '🟢'),
  ('Динамо Мск', 'Москва', 1923, 6, 'from-indigo-600 to-indigo-800', '🟣'),
  ('Кузбасс', 'Кемерово', 1972, 2, 'from-yellow-600 to-yellow-800', '🟡'),
  ('Факел', 'Новый Уренгой', 1981, 1, 'from-orange-600 to-orange-800', '🟠'),
  ('Газпром-Югра', 'Сургут', 1992, 0, 'from-teal-600 to-teal-800', '🟤'),
  ('Нова', 'Новокуйбышевск', 1977, 0, 'from-purple-600 to-purple-800', '🔷');

INSERT INTO matches (home_team_id, away_team_id, home_score, away_score, status, tournament, match_date, match_time, stream_url, sets, stats) VALUES
  (1, 3, 2, 1, 'live', 'Суперлига', '2025-05-10', '18:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
   '[{"home":25,"away":22},{"home":23,"away":25},{"home":18,"away":14}]',
   '[{"label":"Атакующие удары","home":42,"away":37,"homeVal":53,"awayVal":47},{"label":"Эффективность подачи","home":"68%","away":"61%","homeVal":68,"awayVal":61},{"label":"Блоки","home":8,"away":5,"homeVal":62,"awayVal":38},{"label":"Ошибки","home":12,"away":17,"homeVal":41,"awayVal":59},{"label":"Эйсы","home":4,"away":3,"homeVal":57,"awayVal":43}]'
  ),
  (2, 4, 0, 0, 'upcoming', 'Суперлига', '2025-05-10', '20:00', '', '[]', '[]'),
  (5, 6, 0, 0, 'upcoming', 'Суперлига', '2025-05-11', '15:00', '', '[]', '[]'),
  (7, 8, 0, 0, 'upcoming', 'Суперлига', '2025-05-11', '17:30', '', '[]', '[]'),
  (3, 1, 0, 0, 'upcoming', 'Суперлига', '2025-05-12', '19:00', '', '[]', '[]');

INSERT INTO players (team_id, name, number, position) VALUES
  (1, 'Максим Михайлов', 1, 'Доигровщик'),
  (1, 'Алексей Вербов', 3, 'Либеро'),
  (1, 'Артём Вольвич', 7, 'Блокирующий'),
  (1, 'Александр Бутько', 10, 'Связующий'),
  (1, 'Дмитрий Ильиных', 14, 'Диагональный'),
  (1, 'Евгений Сивожелез', 18, 'Блокирующий'),
  (3, 'Сергей Тетюхин', 2, 'Доигровщик'),
  (3, 'Алексей Казаков', 5, 'Либеро'),
  (3, 'Тарас Хтей', 8, 'Блокирующий'),
  (3, 'Павел Круглов', 11, 'Связующий'),
  (3, 'Дмитрий Мусэрский', 15, 'Диагональный'),
  (3, 'Александр Косарев', 19, 'Блокирующий');
