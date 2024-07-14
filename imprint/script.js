// Sobald das Dokument geladen ist, wird das XML mittels XSL transformiert
document.addEventListener('DOMContentLoaded', function () {
    transformXML();
});

// laden der dafuer notwendigen Dateien
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

// XSLT verarbeiten und Ergebnis in main-content div laden
async function transformXML() {
    try {
        const xmlDoc = await loadFile('../static/data/imprint.xml');
        const xslDoc = await loadFile('../transformations/imprint.xsl');

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

            outputElement.innerHTML = '';  
            outputElement.appendChild(resultDocument);
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}



