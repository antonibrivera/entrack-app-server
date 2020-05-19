CREATE TABLE tasks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  task_name TEXT NOT NULL,
  duration INTERVAL NOT NULL,
  description TEXT,
  task_date DATE NOT NULL
);