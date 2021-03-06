TRUNCATE preset_tasks CASCADE;
TRUNCATE tasks CASCADE;
TRUNCATE users CASCADE;
ALTER SEQUENCE preset_tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

INSERT INTO users (first_name, last_name, username, password, email)
VALUES 
  ('John', 'Doe', 'demouser', '$2a$06$LEEHmRC.c/zDlm.Rj2iRB.ECJdx7ZEpj1uTHdNYvV5qF.8rEIAJMq', 'demo@email.com'),
  ('John', 'Doe', 'demouser2', '$2a$06$/NNHiUo9U04baBZWZTQ47..4f1bESqPOrcKRI3c48EMNIOG15sEEK', 'demo2@email.com');

INSERT INTO tasks (user_id, task_name, duration, description, task_date)
VALUES 
  ('1', 'Send invoice', '20 M', 'Remember to CC the CEO', '2020/05/20'),
  ('1', 'Give team evaluation', '2 H', '', '2020/05/21'),
  ('1', 'Approve PTO', '1 H', 'Check amount of PTO Mike has left', '2020/05/22');

INSERT INTO preset_tasks (user_id, task_name, duration, description)
VALUES
    ('1', 'Send invoice', '20 M', 'Remember to CC the CEO');