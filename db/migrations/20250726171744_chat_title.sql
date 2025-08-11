alter table "public"."chats" drop column "name";

alter table "public"."chats" add column "title" character varying(255) not null;


