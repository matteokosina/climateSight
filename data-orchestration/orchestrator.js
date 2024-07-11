// Import functions from other modules
import { getCurrentWeather } from './currentWeather.js';
import { getFacts } from './facts.js';
import {  getHistoricalWeather } from './historicalWeather.js';

async function generateXMLData(){
    
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlData += '<!DOCTYPE weather SYSTEM "climatesight.dtd">\n';
        xmlData += '<data>\n';
    
        xmlData += await getFacts("germany");
        xmlData += await getCurrentWeather(60, 60);
        xmlData += await getHistoricalWeather(60, 60, '2000-01-01', '2024-01-01');
       
        // Ende des XML Dokumentes
        xmlData += '\n</data>';
        
        return xmlData;
}

async function loadXMLStringAsDocument(xmlString) {
    let xml = await xmlString;
    console.log(xml)
    return new DOMParser().parseFromString(xml, "application/xml");
}

async function loadXSLTFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load XSLT file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

async function transformXML() {
    try {
        const xmlString = generateXMLData();
        const xmlDoc = await loadXMLStringAsDocument(xmlString);
        const xslDoc = await loadXSLTFile('./transformations/analytics.xsl');

        const outputElement = document.getElementById("output");

        if (window.ActiveXObject || "ActiveXObject" in window) { // IE
            const ex = xmlDoc.transformNode(xslDoc);
            outputElement.innerHTML = ex;
        } else if (document.implementation && document.implementation.createDocument) { // Modern browsers
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

document.addEventListener("DOMContentLoaded", transformXML);