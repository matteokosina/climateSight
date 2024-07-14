// Sobald das Dokument geladen ist, wird das XML mittels XSL transformiert
document.addEventListener('DOMContentLoaded', function () {
    transformXML();
});

// ActionListener wird erzeugt um auf ein Klick-Event zu hoeren, wenn gedrueckt wird printPage aufgerufen
function setupActionListener() {
    const link = document.getElementById("print");
    if (link) {
        link.addEventListener("click", printPage);
    }
}

// druckt den Seiteninhalt
function printPage() {
    window.print();
}

// wird genutzt um die noetigen Dateien einzulesen
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

// transformiert die XML Daten mittels XSLT und fuegt das Resultat dem main-content div an
async function transformXML() {
    try {
        const xmlDoc = await loadFile('../static/data/analytics.xml');
        const xslDoc = await loadFile('../transformations/analytics.xsl');

        const outputElement = document.getElementById("main-content");

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

            outputElement.innerHTML = '';  // leeren des vorherigen Inhalts, falls vorhanden
            outputElement.appendChild(resultDocument);

            //sobald das Dokument vollstaendig transformiert wurde, wird der ActionListener initialisiert
            setupActionListener();
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}



