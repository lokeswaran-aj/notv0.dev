-- Create a table for chats
create table chats (
  id uuid not null primary key,
  title varchar(255) not null,
  user_id uuid references users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table chats enable row level security;

create policy "Users can view all chats" on chats
  for select using (true);

create policy "Users can insert their own chat" on chats
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own chat" on chats
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own chat" on chats
  for delete using ((select auth.uid()) = user_id);