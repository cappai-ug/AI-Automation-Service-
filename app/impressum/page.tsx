import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Impressum | OPTIMAZED',
}

export default function Impressum() {
  return (
    <React.Fragment>
      <Header />
      <div className="container-max py-20">
        <h1 className="text-4xl font-bold mb-8">Impressum</h1>

        <div className="prose prose-sm max-w-3xl space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG und § 7 Abs. 1 ECG</h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Cappai UG (haftungsbeschränkt)</p>
              <p>Freiherr-vom-Stein-Str 14a</p>
              <p>61440 Oberursel</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Kontaktinformationen</h2>
            <p>
              <strong>E-Mail:</strong> <a href="mailto:info@cappai-ug.de" className="text-primary-600 hover:underline">info@cappai-ug.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Unternehmensregistrierung</h2>
            <p>
              <strong>Registergericht:</strong> Amtsgericht Bad Homburg v.d.H.<br/>
              <strong>Handelsregister:</strong> HRB 17299<br/>
              <strong>Umsatzsteuer-ID:</strong> DE460846617
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Vertretung</h2>
            <p>
              Die Gesellschaft wird durch die Geschäftsführer vertreten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Haftungsausschluss</h2>
            <p>
              <strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit großer Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-4">
              <strong>Haftung für Links:</strong> Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
            <p className="mt-4">
              <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors oder Urhebers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="mt-4">
              <strong>KI-unterstützte Inhalte:</strong> Blog-Beiträge und ähnliche redaktionelle Inhalte auf dieser Website können unter Einsatz künstlicher Intelligenz erstellt worden sein. Solche Beiträge sind direkt am jeweiligen Artikel als KI-unterstützt gekennzeichnet (Transparenzhinweis gemäß Art. 50 Abs. 4 EU AI Act). Alle KI-generierten Inhalte werden vor Veröffentlichung redaktionell geprüft, ersetzen jedoch keine individuelle fachliche oder rechtliche Beratung. Details zum Einsatz von KI finden Sie in unserer <a href="/datenschutz" className="text-primary-600 hover:underline">Datenschutzerklärung</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Streitschlichtung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              Stand: Mai 2026
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  )
}
