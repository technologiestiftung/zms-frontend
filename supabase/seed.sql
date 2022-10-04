INSERT INTO public.processes (service_id, scheduled_time, notes, score)
	VALUES (123, (
			SELECT
				now() + interval '15min'),
		'foo',
		0),
(456, (
		SELECT
			now() + interval '30min'),
	'foo',
	0),
(7658, (
		SELECT
			now() + interval '1min'),
	'foo',
	0),
(5656, (
		SELECT
			now() - interval '10min'),
	'foo',
	0);

