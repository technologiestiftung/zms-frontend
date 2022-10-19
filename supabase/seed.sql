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

INSERT INTO public.service_types (text)
	VALUES ('Abmeldung einer Wohnung'), ('Adressänderung in der Zulassungsbescheinigung Teil I (ZBI) bzw. in dem Fahrzeugschein'), ('Änderung/Wechsel der Hauptwohnung'), ('Aufenthaltsdokument-GB auf einen neuen Pass übertragen'), ('Aufenthaltserlaubnis auf einen neuen Pass übertragen'), ('Aufenthaltserlaubnis für im Bundesgebiet geborene Kinder - Erteilung'), ('Bankbrief / -zulassungsbescheinigung Teil II'), ('Beglaubigung von Kopien'), ('Beglaubigung von Unterschriften'), ('Bescheinigung über ein unbefristetes Aufenthaltsrecht'), ('Blaue Karte EU auf einen neuen Pass übertragen'), ('eID-Karte abholen (EU/EWR-Bürger/innen)'), ('eID-Karte beantragen (EU/EWR-Bürger/innen)'), ('elektronischer Aufenthaltstitel (eAT) - Ausgabe'), ('Fahrerlaubnis - Begleitetes Fahren mit 17'), ('Fahrerlaubnis - Ersterteilung beantragen'), ('Fahrerlaubnis - Erweiterung auf die Klassen D1, D1E, D und DE'), ('Fahrerlaubnis - Erweiterung beantragen'), ('Fahrerlaubnis - Fahrerqualifizierungsnachweis (FQN) beantragen, erweitern oder verlängern'), ('Fahrerlaubnis - Neuerteilung beantragen'), ('Fahrerlaubnis - Umschreibung einer ausländischen Fahrerlaubnis aus einem EU-/EWR-Staat'), ('Fahrerlaubnis - Umschreibung einer ausländischen Fahrerlaubnis aus einem Nicht-EU/EWR-Land (Drittstaat/Anlage 11)'), ('Fahrerlaubnis - Umschreibung einer Dienstfahrerlaubnis'), ('Fahrerlaubnis - Umtausch eines alten Führerscheins in einen EU-Kartenführerschein beantragen'), ('Fahrerlaubnis verlängern'), ('Fahrerlaubnis zur Fahrgastbeförderung (P-Schein) - Erteilung'), ('Fahrerlaubnis zur Fahrgastbeförderung (P-Schein) - Verlängerung beantragen'), ('Führerschein - Ersatzführerschein nach Verlust oder Diebstahl beantragen'), ('Führerschein - Internationalen Führerschein beantragen'), ('Führerschein - Kartenführerschein umtauschen'), ('Führungszeugnis beantragen'), ('Fundsachen abgeben'), ('Gewerbezentralregister - Auskunft beantragen'), ('Kinderreisepass beantragen / verlängern / aktualisieren'), ('Kraftfahrzeug außer Betrieb setzen (Kfz abmelden)'), ('Meldebescheinigung beantragen'), ('Melderegisterauskunft sperren'), ('Niederlassungserlaubnis oder Erlaubnis zum Daueraufenthalt-EU auf einen neuen Pass übertragen'), ('Online-Ausweisfunktion (eID) - nachträglich aktivieren'), ('Online-Ausweisfunktion (eID) - PIN ändern / neu setzen'), ('Personalausweis abholen'), ('Personalausweis beantragen'), ('Personalausweis vorläufig beantragen'), ('Reisepass abholen'), ('Reisepass beantragen'), ('Reisepass beantragen (vorläufiger Reisepass)'), ('Reisepass - Verlust melden'), ('RlvF-Bescheinigung beantragen'), ('Service-Konto Berlin Sicherheitsstufe 2 – Hochstufung bzw. Bearbeitung der Nutzerdaten'), ('Verlust des Personalausweises melden (Verlustanzeige)'), ('Widerspruchsrechte gegen Datenübermittlungen und Melderegisterauskünfte'), ('Wohnberechtigungsschein (WBS) beantragen'), ('Wohngeld - Lastenzuschuss beantragen'), ('Wohngeld - Mietzuschuss beantragen'), ('Wohnraumförderung durch die IBB - Einkommensbescheinigung beantragen'), ('Zulassungsbescheinigung Teil II für KFZ wegen Verlust oder Diebstahl ersetzen')
ON CONFLICT
	DO NOTHING;

