
// Liste der zufälligen API-Endpunkte
const apiEndpoints = [
   // 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m',
    'https://api.chucknorris.io/jokes/random',
];

// Funktion, um einen zufälligen API-Endpunkt zu erhalten
function getRandomApiEndpoint() {
    const randomIndex = Math.floor(Math.random() * apiEndpoints.length);
    return apiEndpoints[randomIndex];
}

// Daten von einer zufälligen API abrufen
async function fetchData() {

    const randomApi = getRandomApiEndpoint();
    try {
        const response = await fetch(randomApi);
        const data = await response.json(); // Angenommen, die Antwort ist XML

        transformData(jsonToXml(data.value, "de"));
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

// Daten mithilfe von XSLT transformieren
function transformData(xmlData) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlData, 'application/xml');

    // XSLT-Datei laden
    fetch('../i18n/translate_analytics_de.xsl')
        .then(response => response.text())
        .then(xsltText => {
            const xslt = parser.parseFromString(xsltText, 'application/xml');
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslt);

            const resultDocument = xsltProcessor.transformToDocument(xml);
            const serializer = new XMLSerializer();
            const transformedText = serializer.serializeToString(resultDocument);

            document.getElementById('content').innerHTML = transformedText;
        })
        .catch(error => {
            console.error('Fehler beim Laden der XSLT-Datei:', error);
        });
}

function jsonToXml(json, rootName) {
    let xml = '';

    function processObject(obj, nodeName) {
        let xmlString = '';
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            xmlString += `<${nodeName}>`;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    xmlString += processObject(obj[key], key);
                }
            }
            xmlString += `</${nodeName}>`;
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                xmlString += processObject(item, nodeName);
            }
        } else {
            xmlString += `<${nodeName}>${obj}</${nodeName}>`;
        }
        return xmlString;
    }

    xml += processObject(json, rootName || 'root');
    return xml;
}

// fetchData aufrufen, um den Prozess zu starten
fetchData();
