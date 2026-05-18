import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Allgemeine Geschäftsbedingungen - Cappai',
}

export default function AGB() {
  return (
    <React.Fragment>
      <Header />
      <div className="container-max py-20">
        <h1 className="text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="prose prose-sm max-w-3xl space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Geltungsbereich und Vertragsparteien</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen, die von Cappai UG (haftungsbeschränkt) im Zusammenhang mit der Nutzung ihrer Website und ihrer Dienstleistungen erbracht werden. Vertragsparteien sind die Cappai UG (haftungsbeschränkt) und der Nutzer der Website (nachfolgend "Kunde").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Kostenpflichtige Dienstleistungen</h2>
            <p>
              Für die Inanspruchnahme kostenpflichtiger Dienstleistungen gelten die jeweils im Shop oder in der Plattform ausgezeichneten Preise. Alle Preisangaben sind in Euro und gelten für in Deutschland ansässige Unternehmen zuzüglich Umsatzsteuer. Abweichungen sind möglich, wenn eine Umsatzsteuer-ID vorhanden ist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Zahlung und Kreditwürdigkeit</h2>
            <p>
              Zahlungen sind entsprechend der ausgewählten Zahlungsart zu leisten. Die verfügbaren Zahlungsarten werden bei der Bestellung angezeigt. Der Kunde verpflichtet sich, korrekte Angaben zu seiner Person und seinem Unternehmen zu machen. Der Kunde garantiert die Echtheit und Gültigkeit der bereitgestellten Zahlungsinformationen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Lieferumfang und Leistungsbeschreibung</h2>
            <p>
              Die Leistungen von Cappai werden jeweils individuell beschrieben und können in den folgenden Kategorien eingeteilt werden:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>SaaS-Plattformzugang</li>
              <li>Managed Services (Done-for-You)</li>
              <li>Consulting und Implementierungsservices</li>
              <li>Support und Wartung</li>
            </ul>
            <p className="mt-4">
              Die genaue Leistungsbeschreibung ist dem jeweiligen Angebot oder der Vertragsbestätigung zu entnehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Widerrufsrecht</h2>
            <p>
              Gemäß den gesetzlichen Bestimmungen des deutschen Fernabsatzgesetzes haben Verbraucher (nicht aber Unternehmer) das Recht, einen Vertrag über digitale Inhalte innerhalb von 14 Tagen nach Vertragsschluss zu widerrufen. Das Widerrufsrecht erlischt jedoch, wenn der Kunde die digitale Leistung vor Ablauf der 14-Tage-Frist in Anspruch nimmt.
            </p>
            <p>
              Zur Ausübung des Widerrufsrechts muss der Kunde uns innerhalb von 14 Tagen in Textform (E-Mail oder Brief) benachrichtigen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Kündigungsrecht und Vertragslaufzeit</h2>
            <p>
              Abonnement- und Serviceverträge können mit einer Frist von 30 Tagen zum Ende eines Kalendermonats gekündigt werden, wenn nicht anders vereinbart. Kündigungen müssen schriftlich eingereicht werden.
            </p>
            <p>
              Eine automatische Verlängerung findet statt, wenn die Kündigung nicht rechtzeitig eingereicht wird.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Haftung und Gewährleistung</h2>
            <p>
              Cappai haftet nur für Schäden, die durch vorsätzliche oder grobe Fahrlässigkeit verursacht wurden. Cappai haftet nicht für entgangene Gewinne, Umsatzausfälle oder indirekte Schäden.
            </p>
            <p>
              Cappai gewährleistet, dass die erbrachten Leistungen nach dem Stand der Technik ausgeführt werden und den allgemeinen Industrie-Standards entsprechen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Datenschutz und Datensicherheit</h2>
            <p>
              Der Kunde akzeptiert die Datenschutzerklärung von Cappai. Cappai garantiert die Einhaltung der DSGVO und aller anwendbaren Datenschutzgesetze. Der Kunde ist selbst verantwortlich für die Sicherung seiner Zugangsänderungen und Passwörter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <p>
              Alle Inhalte, Werkzeuge, Designs und Grafiken auf der Website und in den Dienstleistungen sind Eigentum von Cappai oder deren Lizenzgebern und werden durch Urheberrechte und andere Gesetze geschützt. Der Kunde erhält lediglich eine begrenzte Lizenz zur Nutzung der Dienstleistungen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Änderungen dieser AGB</h2>
            <p>
              Cappai behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden dem Kunden per E-Mail oder bei Anmeldung zur Plattform mitgeteilt. Die Fortsetzung der Nutzung nach einer Mitteilung gilt als Zustimmung zu den neuen Bedingungen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Schlussbestimmungen</h2>
            <p>
              Diesen AGB und alle daraus entstehenden oder damit zusammenhängenden Beziehungen unterliegen den Gesetzen der Bundesrepublik Deutschland.
            </p>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, wird die Wirksamkeit der übrigen Bestimmungen dadurch nicht beeinträchtigt.
            </p>
            <p>
              Alle Mitteilungen müssen schriftlich erfolgen und können per E-Mail an hello@optimazed.de übermittelt werden.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              Stand: Mai 2024<br/>
              Zuletzt aktualisiert: 9. Mai 2024
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  )
}
