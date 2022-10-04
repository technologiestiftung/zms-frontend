ALTER TABLE "public"."processes"
	ADD COLUMN "check_in_time" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;

