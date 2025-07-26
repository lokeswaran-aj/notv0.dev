-- Create a table for messages
create table messages (
  id uuid not null primary key,
  chat_id uuid not null references chats on delete cascade,
  role varchar(255) not null,
  parts jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

-- Users can view messages from chats they own
create policy "Users can view their own messages" on messages
  for select using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

-- Users can insert messages into chats they own
create policy "Users can insert their own messages" on messages
  for insert with check (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

-- Users can update messages in chats they own
create policy "Users can update their own messages" on messages
  for update using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );

-- Users can delete messages from chats they own
create policy "Users can delete their own messages" on messages
  for delete using (
    (select auth.uid()) = (
      select user_id from chats where chats.id = chat_id
    )
  );