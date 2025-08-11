create table "public"."artifacts" (
    "id" uuid not null,
    "chat_id" uuid not null,
    "sandbox_id" character varying(255),
    "sandbox_url" character varying(255),
    "code" jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."artifacts" enable row level security;

CREATE UNIQUE INDEX artifacts_pkey ON public.artifacts USING btree (id);

alter table "public"."artifacts" add constraint "artifacts_pkey" PRIMARY KEY using index "artifacts_pkey";

alter table "public"."artifacts" add constraint "artifacts_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."artifacts" validate constraint "artifacts_chat_id_fkey";

grant delete on table "public"."artifacts" to "anon";

grant insert on table "public"."artifacts" to "anon";

grant references on table "public"."artifacts" to "anon";

grant select on table "public"."artifacts" to "anon";

grant trigger on table "public"."artifacts" to "anon";

grant truncate on table "public"."artifacts" to "anon";

grant update on table "public"."artifacts" to "anon";

grant delete on table "public"."artifacts" to "authenticated";

grant insert on table "public"."artifacts" to "authenticated";

grant references on table "public"."artifacts" to "authenticated";

grant select on table "public"."artifacts" to "authenticated";

grant trigger on table "public"."artifacts" to "authenticated";

grant truncate on table "public"."artifacts" to "authenticated";

grant update on table "public"."artifacts" to "authenticated";

grant delete on table "public"."artifacts" to "service_role";

grant insert on table "public"."artifacts" to "service_role";

grant references on table "public"."artifacts" to "service_role";

grant select on table "public"."artifacts" to "service_role";

grant trigger on table "public"."artifacts" to "service_role";

grant truncate on table "public"."artifacts" to "service_role";

grant update on table "public"."artifacts" to "service_role";

create policy "Users can delete their own artifacts"
on "public"."artifacts"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = artifacts.chat_id))));


create policy "Users can insert their own artifacts"
on "public"."artifacts"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = artifacts.chat_id))));


create policy "Users can update their own artifacts"
on "public"."artifacts"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = artifacts.chat_id))));


create policy "Users can view their own artifacts"
on "public"."artifacts"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = ( SELECT chats.user_id
   FROM chats
  WHERE (chats.id = artifacts.chat_id))));



