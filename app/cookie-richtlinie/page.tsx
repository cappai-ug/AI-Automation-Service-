import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Cookie-Richtlinie - Cappai',
}

export default function CookiePolicy() {
  return (
    <main>
      <Header />
      <div className="container-max py-20">
        <h1 className="text-4xl font-bold mb-8">Cookie-Richtlinie</h1>

        <div className="prose prose-sm max-w-3xl space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Was sind Cookies?</h2>
            <p>
              Cookies sind kleine Textdateien, die auf dem Gerät des Benutzers (Computer, Tablet, Smartphone usw.) gespeichert werden. Wenn Sie eine Website besuchen, kann sie ein Cookie auf Ihrem Gerät abspeichern. Cookies können verschiedene Informationen enthalten und werden für verschiedene Zwecke verwendet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Welche Cookies verwenden wir?</h2>

            <h3 className="text-xl font-semibold mb-3">Notwendige Cookies</h3>
            <p>
              Diese Cookies sind notwendig, um unsere Website zu betreiben und die angeforderten Services bereitzustellen. Ohne diese Cookies können Sie unsere Website nicht nutzen. Diese Cookies sind kostenlos und setzen keine persönlichen Daten um.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Funktionale Cookies</h3>
            <p>
              Diese Cookies ermöglichen es uns, Ihre Vorlieben zu speichern (z. B. Sprache, Region) und die Website für Sie zu personalisieren. Sie helfen auch, Ihre Einstellungen zu merken.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Analytische Cookies</h3>
            <p>
              Diese Cookies helfen uns zu verstehen, wie Benutzer unsere Website nutzen. Sie sammeln anonyme Informationen über die Anzahl der Besucher, die aufgerufenen Seiten und die Interaktionen der Benutzer. Dies hilft uns, unsere Website zu verbessern.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Marketing Cookies</h3>
            <p>
              Diese Cookies werden verwendet, um Werbeinhalte anzuzeigen, die für Sie relevant sind. Sie können das Verhalten von Besuchern auf unserer Website und auf Partnerwebsites verfolgbar machen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Cookie-Liste</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Cookie-Name</th>
                  <th className="border border-gray-300 p-2 text-left">Typ</th>
                  <th className="border border-gray-300 p-2 text-left">Zweck</th>
                  <th className="border border-gray-300 p-2 text-left">Dauer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">cappai-cookie-consent</td>
                  <td className="border border-gray-300 p-2">Notwendig</td>
                  <td className="border border-gray-300 p-2">Speichert Cookie-Einwilligung</td>
                  <td className="border border-gray-300 p-2">1 Jahr</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-2">session_id</td>
                  <td className="border border-gray-300 p-2">Notwendig</td>
                  <td className="border border-gray-300 p-2">Authentifizierung & Session-Management</td>
                  <td className="border border-gray-300 p-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">preferences</td>
                  <td className="border border-gray-300 p-2">Funktional</td>
                  <td className="border border-gray-300 p-2">Speichert Benutzereinstellungen</td>
                  <td className="border border-gray-300 p-2">1 Jahr</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Wie Sie Cookies kontrollieren können</h2>
            <p>
              Die meisten Webbrowser ermöglichen es Ihnen, Cookies zu kontrollieren. Sie können Cookies löschen, die bereits auf Ihrem Gerät gespeichert sind, oder Sie können Ihren Browser so einstellen, dass er Cookies automatisch ablehnt oder löscht. Die Verwaltung von Cookies funktioniert je nach Browser unterschiedlich:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Chrome:</strong> Einstellungen &gt; Datenschutz und Sicherheit &gt; Cookies und andere Websitedaten</li>
              <li><strong>Firefox:</strong> Einstellungen &gt; Datenschutz & Sicherheit &gt; Cookies und Website-Daten</li>
              <li><strong>Safari:</strong> Einstellungen &gt; Datenschutz &gt; Cookies und Website-Daten</li>
              <li><strong>Edge:</strong> Einstellungen &gt; Datenschutz, Suche und Services &gt; Cookies und andere Website-Daten</li>
            </ul>
            <p className="mt-4">
              Bitte beachten Sie: Wenn Sie Cookies deaktivieren oder löschen, funktionieren einige Funktionen unserer Website möglicherweise nicht mehr ordnungsgemäß.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Drittanbieter-Cookies</h2>
            <p>
              Wir verwenden möglicherweise auch Cookies von Drittanbietern (wie Google Analytics, Tracking-Pixel) zur Verbesserung unserer Website. Diese Cookies unterliegen den Cookie-Richtlinien der jeweiligen Drittanbieter. Wir empfehlen Ihnen, die Cookie-Richtlinien dieser Anbieter zu überprüfen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Ihre Zustimmung</h2>
            <p>
              Indem Sie unsere Website nutzen und auf "Akzeptieren" in unserem Cookie-Banner klicken, stimmen Sie der Verwendung von Cookies in Übereinstimmung mit dieser Richtlinie zu. Sie können Ihre Zustimmung jederzeit widerrufen, indem Sie die Cookie-Einstellungen in unserem Cookie-Management-Panel ändern.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Kontakt</h2>
            <p>
              Wenn Sie Fragen zu dieser Cookie-Richtlinie oder zu unserer Verwendung von Cookies haben, kontaktieren Sie uns bitte unter:
            </p>
            <p>
              Cappai UG (haftungsbeschränkt)<br/>
              E-Mail: <a href="mailto:info@cappai-ug.de" className="text-primary-600 hover:underline">info@cappai-ug.de</a>
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
    </main>
  )
}
