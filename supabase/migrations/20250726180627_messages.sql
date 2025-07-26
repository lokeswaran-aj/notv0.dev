create table "public"."messages" (
    "id" uuid not null,
    "chat_id" uuid not null,
    "role" character varying(255) not null,
    "parts" jsonb not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."messages" enable row level security;

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."messages" add constraint "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_chat_id_fkey";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

create policy "Users can delete their own messages"
on "public"."messages"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = messages.chat_id))));


create policy "Users can insert their own messages"
on "public"."messages"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = messages.chat_id))));


create policy "Users can update their own messages"
on "public"."messages"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = messages.chat_id))));


create policy "Users can view their own messages"
on "public"."messages"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = messages.chat_id))));



