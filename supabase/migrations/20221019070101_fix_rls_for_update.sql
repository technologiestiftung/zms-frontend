CREATE POLICY "Enable insert for authenticated users only" ON public.service_types AS PERMISSIVE
	FOR INSERT TO authenticated
		WITH CHECK (TRUE);

CREATE POLICY "Enable update for authenticated users only with select" ON public.processes AS PERMISSIVE
	FOR UPDATE TO authenticated
		USING (TRUE)
		WITH CHECK (TRUE);

CREATE POLICY "Enable delete for authenticated users only" ON public.processes AS PERMISSIVE
	FOR DELETE TO authenticated
		USING (TRUE);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.processes;

