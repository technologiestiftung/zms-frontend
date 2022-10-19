alter table "public"."processes" add column "profile_id" uuid;

alter table "public"."processes" add constraint "processes_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."processes" validate constraint "processes_profile_id_fkey";


