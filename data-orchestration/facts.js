/*  Hier wird eine API Anfrage an restcountries.com gestellt.
    Die API stellt allgemeine Informationen zu Laendern, wie z.B. Hauptstadt, Einwohnerzahl, etc zur Verfügung
    Die Daten lassen sich nur in JSON-Format konsumieren, daher werden hier zusätzlich die Daten in ein XML Format konveriert.
    Das Datenformat sieht wie folgt aus (es handelt sich dabei nur um einen Ausschnitt und wird in orchestrator.js in eine wohlgeformte XML geparsed):

<facts>
    <country>Bundesrepublik Deutschland</country>
    <capital>Berlin</capital>
    <flag>https://flagcdn.com/de.svg</flag>
    <altFlag>The flag of Germany is composed of three equal horizontal bands of black, red and gold.</altFlag>
    <population>83240525</condition>
</facts>
*/

export async function getFacts(country) {
    const url = `https://restcountries.com/v3.1/name/`;
    try {
        const response = await fetch(`${url}${country}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const facts = await response.json();

        if (facts.length === 0) {
            throw new Error('Informationen for this country are not available.');
        }

        console.log()
        return jsonToXML(facts[0]);
    } catch (error) {
        console.error('Failed to fetch facts:', error);
        return { error: 'Unable to fetch facts' };
    }
}

// Konvertierung der erhaltenen JSON Daten in XML
function jsonToXML(data) {

    let xmlResult = "<facts>";
    xmlResult += "\n<country>" + data.translations.deu.official + "</country>";
    xmlResult += "\n<capital>" + data.capital + "</capital>";

    // URL zu einer SVG Grafik der Flagge
    xmlResult += "\n<flag>" + data.flags.svg + "</flag>";
    
    // alt Text für die Flagge          
    xmlResult += "\n<altFlag>" + ((data.flags.alt == undefined) ? ("Flagge von " + data.translations.deu.official) : data.flags.alt) + "</altFlag>";
    xmlResult += "\n<population>" + ((data.population < 1000) ? (data.population  + " Mio") : data.population )+ "</population>";
    xmlResult += "\n</facts>\n"
    return xmlResult
}

