-- Create a table for artifacts
create table artifacts (
  id uuid not null primary key,
  chat_id uuid not null references chats on delete cascade,
  sandbox_id varchar(255) null,
  sandbox_url varchar(255) null,
  code jsonb null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table artifacts enable row level security;

create policy "Users can view their own artifacts" on artifacts
  for select using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

create policy "Users can insert their own artifacts" on artifacts
  for insert with check (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

create policy "Users can update their own artifacts" on artifacts
  for update using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

create policy "Users can delete their own artifacts" on artifacts
  for delete using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );