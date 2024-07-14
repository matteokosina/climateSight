
// cookie check
if (!cookiesAccepted() && location.pathname != "/index.html") {
    location.assign("http://" + location.host + "/index.html");
}
function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}

let zonesDrawn = false;

let map;
// Initialize Leaflet map
function initMap(){
        
        map = L.map('map').setView([0, 0], 2); // Initial center and zoom level
        var maxBounds = L.latLngBounds(
            L.latLng(-90, -180),   // Südwestlicher Eckpunkt der Begrenzung
            L.latLng(90, 180)      // Nordöstlicher Eckpunkt der Begrenzung
        );
        // Add OpenStreetMap tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            center: [51.505, -0.09],
            zoom: 1,
            maxZoom: 40,
            minZoom: 3,
            maxBoundsViscosity: 1.0,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.setMaxBounds(maxBounds);
        map.on('click', function (e) {
        
            // Reverse Geocoding: Get country name based on coordinates
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&accept-language=en`)
                .then(response => response.json())
                .then(data => {
                    redirectToAnalytics(e.latlng.lat, e.latlng.lng, data.address.country);
                })
                .catch(error => {
                    console.error('Error fetching country:', error);
                });
        });
        map.attributionControl.setPosition('topright');

}




// Function to add KML layer to the map
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


            // Fit map view to the bounds of the polygon
            map.fitBounds(polygon.getBounds());
        } else {
            console.error('Invalid or empty coordinates in KML file.');
        }
    }
    zonesDrawn = true;
}

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

async function fetchFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return await response.text();
}

function transformXML(xsltText, xmlText) {
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

        const result = transformXML(xsltText, xmlText);
        return result;
    } catch (error) {
        console.error(`Error during transformation: ${error}`);
        return null;
    }
}
function setupActionListener() {
    const link = document.getElementById("showZones");
    if (link) {
        link.addEventListener("click", handleLinkClick);
    }


}
function handleLinkClick(event) {
    getTransformedResult('../transformations/kml.xsl', '../static/data/zones.xml').then(result => {
        addKMLToMap(result)
    });
}



async function redirectToAnalytics(lat, lon, country) {

    // Erzeuge die URL mit den Parametern
    const url = `../analytics/analytics.html?lat=${lat}&lon=${lon}&country=${country}`;
    // Führe die Weiterleitung aus
    window.location.href = url;
}
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}
async function transformXML2() {
    try {
        const xmlDoc = await loadFile('../static/data/discover.xml');
        const xslDoc = await loadFile('../transformations/discover.xsl');

        const outputElement = document.getElementById("main-content");

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
            setupActionListener()
            initMap()
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}
transformXML2();



