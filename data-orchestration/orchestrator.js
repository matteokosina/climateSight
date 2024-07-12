// Import functions from other modules
import { getCurrentWeather } from './currentWeather.js';
import { getFacts } from './facts.js';
import {  getHistoricalWeather } from './historicalWeather.js';

async function generateXMLData(){
    
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlData += '<!DOCTYPE weather SYSTEM "climatesight.dtd">\n';
        xmlData += '<data>\n';
    
        xmlData += await getFacts("france");
        xmlData += await getCurrentWeather(60, 60);
        xmlData += await getHistoricalWeather(60, 60, '2000-01-01', '2024-01-01');


        //mock data:
        xmlData += '<historical>';
        xmlData += ' <year value="2010">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += ' <year value="2011">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += ' <year value="2012">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += ' <year value="2013">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += ' <year value="2014">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += ' <year value="2015">\n<average_precipitation_sum>2.4</average_precipitation_sum>\n<average_temperature_2m_max>-22.5</average_temperature_2m_max>\n<snowfall_sum>1.68</snowfall_sum>\n</year>';
        xmlData += '</historical>';
 

        // mock data for charts:
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="Temperatur in °C" color="#4287f5">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2019" x="0" y="10" />\n<point tag="2020" x="100" y="60" />\n<point tag="2021" x="200" y="122" />\n<point tag="2022" x="300" y="30" />\n<point tag="2023" x="400" y="205" />\n</values>\n</chart>';
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="10" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';
        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="10" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';

        
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