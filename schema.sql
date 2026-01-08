create table public.certificates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  key text unique not null,
  ciclo_escolar text not null,
  nombre_alumno text not null,
  curp text not null,
  licenciatura text not null,
  plan_estudios text not null,
  cct text not null,
  promedio text not null,
  folio text not null,
  folio_digital text not null
);
