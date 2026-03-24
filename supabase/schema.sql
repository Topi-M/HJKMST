CREATE TABLE public.difficulty (
  difficulty_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  Name character varying NOT NULL UNIQUE,
  Kuvaus text,
  CONSTRAINT difficulty_pkey PRIMARY KEY (difficulty_id)
);
CREATE TABLE public.minigames (
  minigame_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying UNIQUE,
  Kuvaus text,
  CONSTRAINT minigames_pkey PRIMARY KEY (minigame_id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  username character varying NOT NULL UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text,
  host_id uuid NOT NULL DEFAULT auth.uid(),
  status text DEFAULT 'waiting'::text,
  created_at timestamp without time zone DEFAULT now(),
  name text DEFAULT ''::text,
  minigame_id bigint,
  CONSTRAINT rooms_pkey PRIMARY KEY (id),
  CONSTRAINT rooms_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.profiles(id),
  CONSTRAINT rooms_minigame_id_fkey FOREIGN KEY (minigame_id) REFERENCES public.minigames(minigame_id)
);
CREATE TABLE public.submission (
  submission_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  minigame_id bigint NOT NULL,
  score bigint NOT NULL,
  user_id uuid NOT NULL,
  start_time_ms bigint NOT NULL,
  end_time_ms bigint NOT NULL,
  difficulty character varying NOT NULL,
  CONSTRAINT submission_pkey PRIMARY KEY (submission_id),
  CONSTRAINT submission_minigame_id_fkey FOREIGN KEY (minigame_id) REFERENCES public.minigames(minigame_id),
  CONSTRAINT submission_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT submission_difficulty_fkey FOREIGN KEY (difficulty) REFERENCES public.difficulty(Name)
);
CREATE TABLE public.sudokupuzzles (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  puzzle character varying NOT NULL DEFAULT ''::character varying CHECK (length(puzzle::text) = 81),
  solution character varying NOT NULL DEFAULT ''::character varying CHECK (length(solution::text) = 81),
  id bigint NOT NULL UNIQUE,
  difficulty bigint,
  CONSTRAINT sudokupuzzles_pkey PRIMARY KEY (id),
  CONSTRAINT sudokupuzzles_difficulty_fkey FOREIGN KEY (difficulty) REFERENCES public.difficulty(difficulty_id)
);

-- Views

CREATE VIEW public.profiili_tilastot AS
SELECT user_id,
    count(*) AS palapeli_submission_count
FROM submission s
WHERE (minigame_id = 1)
GROUP BY user_id;

CREATE VIEW public.nonogram AS
WITH ranked AS (
    SELECT p.username,
        s.best_time,
        s.difficulty,
        rank() OVER (PARTITION BY s.difficulty ORDER BY s.best_time) AS rank
    FROM (
        (SELECT submission.user_id,
                submission.difficulty,
                min(submission.score) AS best_time
         FROM submission
         WHERE (submission.minigame_id = 5)
         GROUP BY submission.user_id, submission.difficulty) s
        JOIN profiles p ON ((p.id = s.user_id))
    )
)
SELECT username, best_time, difficulty, rank
FROM ranked
WHERE (rank <= 10)
ORDER BY difficulty, rank;

CREATE VIEW public.whitetiles_leaderboard AS
WITH ranked AS (
    SELECT p.username,
        s.best_time,
        s.difficulty,
        rank() OVER (PARTITION BY s.difficulty ORDER BY s.best_time DESC) AS rank
    FROM (
        (SELECT submission.user_id,
                submission.difficulty,
                max(submission.score) AS best_time
         FROM submission
         WHERE (submission.minigame_id = 6)
         GROUP BY submission.user_id, submission.difficulty) s
        JOIN profiles p ON ((p.id = s.user_id))
    )
)
SELECT username, best_time, difficulty, rank
FROM ranked
WHERE (rank <= 10)
ORDER BY difficulty, rank;

CREATE VIEW public.sudoku_leaderboard AS
WITH ranked AS (
    SELECT p.username,
        s.best_time,
        s.difficulty,
        rank() OVER (PARTITION BY s.difficulty ORDER BY s.best_time) AS rank
    FROM (
        (SELECT submission.user_id,
                submission.difficulty,
                min(submission.score) AS best_time
         FROM submission
         WHERE (submission.minigame_id = 2)
         GROUP BY submission.user_id, submission.difficulty) s
        JOIN profiles p ON ((p.id = s.user_id))
    )
)
SELECT username, best_time, difficulty, rank
FROM ranked
WHERE (rank <= 10)
ORDER BY difficulty, rank;

CREATE VIEW public.minigame1_leaderboard AS
WITH ranked AS (
    SELECT p.username,
        s.best_time,
        s.difficulty,
        rank() OVER (PARTITION BY s.difficulty ORDER BY s.best_time) AS rank
    FROM (
        (SELECT submission.user_id,
                submission.difficulty,
                min(submission.score) AS best_time
         FROM submission
         WHERE (submission.minigame_id = 1)
         GROUP BY submission.user_id, submission.difficulty) s
        JOIN profiles p ON ((p.id = s.user_id))
    )
)
SELECT username, best_time, difficulty, rank
FROM ranked
WHERE (rank <= 10)
ORDER BY difficulty, rank;