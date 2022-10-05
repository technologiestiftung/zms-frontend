CREATE UNIQUE INDEX processes_pkey ON public.processes USING btree (id);

ALTER TABLE "public"."processes"
	ADD CONSTRAINT "processes_pkey" PRIMARY KEY USING INDEX "processes_pkey";

