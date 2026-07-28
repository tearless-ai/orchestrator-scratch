-- The whole schema. Applied by hand to the Neon template branch; every task
-- branch is a copy-on-write clone of that branch, so nothing here runs per task.
-- Deliberately not a migration runner: that complexity belongs to the real
-- project, and reproducing it here would only create ambiguity about what failed.

create table if not exists widgets (
  id serial primary key,
  name text not null unique
);

insert into widgets (name) values ('alpha'), ('beta'), ('gamma')
on conflict (name) do nothing;
