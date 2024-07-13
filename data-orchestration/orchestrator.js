// Import functions from other modules
import { getCurrentWeather } from './currentWeather.js';
import { getFacts } from './facts.js';
import {  getHistoricalWeather } from './historicalWeather.js';

// cookie check
if (!cookiesAccepted() && location.pathname != "/index.html") {
    location.assign("http://" + location.host + "/index.html");
}
function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}

async function generateXMLData(){
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lon = urlParams.get('lon');
    const country = urlParams.get('country');


    
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlData += '<!DOCTYPE weather SYSTEM "climatesight.dtd">\n';
        xmlData += '<data>\n';
    
        xmlData += await getFacts(country.toLocaleLowerCase());
        xmlData += await getCurrentWeather(lat, lon);
        xmlData += await getHistoricalWeather(lat, lon, '2010-01-01');


        /*
        // mock data for charts:
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="Temperatur in °C" color="#4287f5">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2019" x="0" y="00" />\n<point tag="2020" x="100" y="60" />\n<point tag="2021" x="200" y="122" />\n<point tag="2022" x="300" y="30" />\n<point tag="2023" x="400" y="-15" />\n</values>\n</chart>';
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="0" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="00" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="229" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';
        */
        
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
        const xslDoc = await loadXSLTFile('../transformations/analytics.xsl');

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