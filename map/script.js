let zonesDrawn = false;
let map;
// XML mithilfe von XSL transformieren um Discover Seite zu erhalten
transformXML();

// Ueberpruefung, ob Cookies bereits akzeptiert wurden, wenn nicht, wird man auf die Startseite zurueck gefuehrt
if (!cookiesAccepted() && location.pathname != "/index.html") {
    location.assign("http://" + location.host + "/index.html");
}

// auslesen des localstorage
function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}

// Initialisierung der Leaflet-Karte
function initMap(){
        map = L.map('map').setView([0, 0], 2); // Initiales Zoom-Level
        
        // Begrenzungen fuer den Zoom
        var maxBounds = L.latLngBounds(
            L.latLng(-90, -180),   // Südwestlicher Eckpunkt der Begrenzung
            L.latLng(90, 180)      // Nordöstlicher Eckpunkt der Begrenzung
        );
        //  OpenStreetMap tile layer zur Karte hinzufuegen
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            center: [51.505, -0.09],
            zoom: 1,
            maxZoom: 40,
            minZoom: 3,
            maxBoundsViscosity: 1.0,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.setMaxBounds(maxBounds);

        // Klick-Event wenn man auf die Karte klickt
        map.on('click', function (e) {
        
            // Reverse Geocoding: diese API liefert das Land zu den uebergebenen Koordinaten zurueck
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&accept-language=en`)
                .then(response => response.json())
                .then(data => {
                    // Weiterleitung zur Analytics-Seite und Codierung der Koordinaten
                    redirectToAnalytics(e.latlng.lat, e.latlng.lng, data.address.country);
                })
                .catch(error => {
                    console.error('Error fetching country:', error);
                });
        });
        // Copyright einblenden
        map.attributionControl.setPosition('topright');

}

// hier werden die Daten aus der KML zur Karte hinzugefuegt
function addKMLToMap(kmlData) {
    if (zonesDrawn) {
        return;
    }
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(kmlData, "text/xml");

    for (let i = 0; i < xmlDoc.getElementsByTagName('kml:coordinates').length; i++) {
        var coordinates = [];
        var coords = xmlDoc.getElementsByTagName('kml:coordinates')[i].textContent.trim().split(' ');

        coords.forEach(function (coord) {
            var lngLat = coord.split(',');
            var lat = parseFloat(lngLat[1]);
            var lng = parseFloat(lngLat[0]);
            if (!isNaN(lat) && !isNaN(lng)) {
                coordinates.push([lat, lng]);
            }
        });

        if (coordinates.length > 0) {
            var polygon = L.polygon(coordinates, {
                color: getColor(i),
                fillColor: getColor(i),
                fillOpacity: 0.5
            }).addTo(map);


            map.fitBounds(polygon.getBounds());
        } else {
            console.error('Invalid or empty coordinates in KML file.');
        }
    }
    zonesDrawn = true;
}

// Einfaerbungsfarbe der Klima-Zonen
function getColor(index) {
    switch (index) {
        case 0:
            return "blue"
        case 1:
            return "magenta"
        case 2:
            return "orange"
        case 3:
            return "magenta"
        case 4:
            return "blue"
        default:
            return "red"
    }
}

// laden der noetigen Dateien (als Text)
async function fetchFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return await response.text();
}

function transformXMLtoKML(xsltText, xmlText) {
    const parser = new DOMParser();
    const xsltDoc = parser.parseFromString(xsltText, "application/xml");
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);

    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const serializer = new XMLSerializer();
    return serializer.serializeToString(resultDoc);
}

async function getTransformedResult(xsltUrl, xmlUrl) {
    try {
        const [xsltText, xmlText] = await Promise.all([
            fetchFile(xsltUrl),
            fetchFile(xmlUrl)
        ]);

        const result = transformXMLtoKML(xsltText, xmlText);
        return result;
    } catch (error) {
        console.error(`Error during transformation: ${error}`);
        return null;
    }
}

// ActionListener wird erzeugt um auf ein Klick-Event zu hoeren, wenn gedrueckt werden die Zonen eingezeichnet
function setupActionListener() {
    const link = document.getElementById("showZones");
    if (link) {
        link.addEventListener("click", handleLinkClick);
    }
}

// KML aus XML transformieren und der Karte hinzufuegen
function handleLinkClick(event) {
    getTransformedResult('../transformations/kml.xsl', '../static/data/zones.xml').then(result => {
        addKMLToMap(result);
        map.setView([0, 0], 2);
    });
}


async function redirectToAnalytics(lat, lon, country) {
    // Erzeuge die URL mit den Parametern
    const url = `../analytics/analytics.html?lat=${lat}&lon=${lon}&country=${country}`;
    // Führe die Weiterleitung aus
    window.location.href = url;
}

// laden der noetigen Dateien (als Dokument)
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

// transformieren der Seiteninhalte und anschließendes hinzufuegen zum main-content div
async function transformXML() {
    try {
        const xmlDoc = await loadFile('../static/data/discover.xml');
        const xslDoc = await loadFile('../transformations/discover.xsl');

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

            // wenn das Dokument vollstaendig transformiert ist:
            setupActionListener()
            initMap()
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}




