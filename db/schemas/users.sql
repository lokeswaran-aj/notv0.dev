-- Create a table for users
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  full_name text,
  avatar_url text
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;

-- Create policies
create policy "Users can view all profiles" on users
  for select using (true);

create policy "Users can insert their own profile" on users
  for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile" on users
  for update using ((select auth.uid()) = id);

-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;
