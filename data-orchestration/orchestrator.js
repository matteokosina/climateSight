/* Hier werden die Daten der unterschiedlichen APIs zusammengetragen und in ein wohkgeformtes XML Dokument ueberfuehrt. Dieses XML Dokument wird dann
mithilfe von XSL transformiert und angezeigt.
*/  

// Importieren der Datenlieferanten
import { getCurrentWeather } from './currentWeather.js';
import { getFacts } from './facts.js';
import {  getHistoricalWeather } from './historicalWeather.js';

// Ueberpruefung, ob Cookies bereits akzeptiert wurden, wenn nicht, wird man auf die Startseite zurueck gefuehrt
if (!cookiesAccepted() && location.pathname != "/index.html") {
    location.assign("http://" + location.host + "/index.html");
}
// auslesen des localstorage
function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}

// sobald das Dokument geladen ist wird mit der XML-Transformation begonnen
document.addEventListener("DOMContentLoaded", transformXML);

// Zusammenfuehrung der XML-Daten
async function generateXMLData(){

    // hier wird ausgelesen auf welches Land ( und Koordinaten ) der / Nutzer:in geklickt hat
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lon = urlParams.get('lon');
    const country = urlParams.get('country');


    // Erstellung des XML-Dokuments mit Angabe der DTD
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlData += '<!DOCTYPE climatesight SYSTEM "climatesight.dtd">\n';
            xmlData += '<data>\n';
            xmlData += await getFacts(country.toLocaleLowerCase());
            xmlData += await getCurrentWeather(lat, lon);
            xmlData += await getHistoricalWeather(lat, lon, '2010-01-01');
        xmlData += '\n</data>';
        
        return xmlData;
}

// parsen des XML-Strings zu einem Dokument
async function loadXMLStringAsDocument(xmlString) {
    let xml = await xmlString;
    return new DOMParser().parseFromString(xml, "application/xml");
}

// laden von benoetigten Dateien
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

// hier wird das erzeugte XML mithilfe von XSL transformiert und das Resultat in data div eingefuegt
async function transformXML() {
    try {
        const xmlString = generateXMLData();
        const xmlDoc = await loadXMLStringAsDocument(xmlString);
        const xslDoc = await loadFile('../transformations/analytics-data.xsl');

        const outputElement = document.getElementById("data");

        if (window.ActiveXObject || "ActiveXObject" in window) { 
            const ex = xmlDoc.transformNode(xslDoc);
            outputElement.innerHTML = ex;
        } else if (document.implementation && document.implementation.createDocument) { 
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslDoc);
            const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);

            if (!(resultDocument instanceof DocumentFragment)) {
                throw new Error("Transformation did not return a DocumentFragment");
            }

            outputElement.innerHTML = '';  // Clear previous content
            outputElement.appendChild(resultDocument);
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}

