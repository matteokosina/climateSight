 // Initialize Leaflet map
        var map = L.map('map').setView([0, 0], 2); // Initial center and zoom level
        var maxBounds = L.latLngBounds(
            L.latLng(-90, -180),   // Südwestlicher Eckpunkt der Begrenzung
            L.latLng(90, 180)      // Nordöstlicher Eckpunkt der Begrenzung
        );
        // Add OpenStreetMap tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            center: [51.505, -0.09],
            zoom: 1,
            maxZoom: 17,
            minZoom: 2,
            maxBoundsViscosity: 1.0,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.setMaxBounds(maxBounds);


        // Function to add KML layer to the map
        function addKMLToMap(kmlData) {
            console.log(kmlData)
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(kmlData, "text/xml");

            var coordinates = [];
            console.log
            for(let i = 0; i < xmlDoc.getElementsByTagName('kml:coordinates').length; i++){

           
            var coords = xmlDoc.getElementsByTagName('kml:coordinates')[i].textContent.trim().split(' ');

            coords.forEach(function(coord) {
                var lngLat = coord.split(',');
                var lat = parseFloat(lngLat[1]);
                var lng = parseFloat(lngLat[0]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    coordinates.push([lat, lng]);
                }
            });
            
            if (coordinates.length > 0) {
                var polygon = L.polygon(coordinates, {
                    color: getNextColor(i),
                    fillColor: getNextColor(i),
                    fillOpacity: 0.5
                }).addTo(map);
          

                // Fit map view to the bounds of the polygon
                map.fitBounds(polygon.getBounds());
            } else {
                console.error('Invalid or empty coordinates in KML file.');
            }
        }
        }

        function getNextColor(index){
            index = index%5;
            switch(index){
                case 0:
                    return "blue"
                case 1:
                    return "green"
                case 2:
                    return "orange"
                case 3:
                    return "magenta"
                case 4:
                    return "teal"
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
          
          document.addEventListener("DOMContentLoaded", function() {
            const link = document.getElementById("showZones");
            if (link) {
              link.addEventListener("click", handleLinkClick);
            }
          });
          function handleLinkClick(event) {
            getTransformedResult('../transformations/discover.xsl', '../static/data/zones.xml').then(result => {
                addKMLToMap(result)
                });
          }
