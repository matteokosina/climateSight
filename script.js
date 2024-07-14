// Sobald das Dokument geladen ist, wird das XML mittels XSL transformiert
document.addEventListener('DOMContentLoaded', function () {
    transformXML("./transformations/index.xsl", "./static/data/index.xml");
});

// falls noch nicht akzeptiert soll der Cookie-Banner angezeigt werden
function showCookieBanner() {
    if (localStorage.getItem("cookieSeen") != "shown") {
        let cookie = document.getElementById('main-content').querySelector('.cookie-banner');
        cookie.style.display = "block"
    }
    const link = document.getElementById('main-content').querySelector('#close');
    if (link) {
        link.addEventListener("click", cookieClose);
    }
    // erst dann soll der Globus sichtbar werden
    showGlobe();
}

// cookies akzeptieren
function cookieClose(event) {
    localStorage.setItem("cookieSeen", "shown");
    location.reload();
}

function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}

function showGlobe() {
    // nur sofern cookies akzeptiert sind
    if (!cookiesAccepted()) return;

    let scene, camera, renderer, globe;

    // Globus initialisieren
    init();
}

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight), 1, 10);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);
    let mainContent = document.getElementById('main-content');
    mainContent.querySelector('#globe').appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(2, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./static/assets/texture.png');

    const material = new THREE.MeshBasicMaterial({ map: texture });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Start animation
    animate();
}

  // animiert den Globus
function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.005;
    renderer.render(scene, camera);
}

// noetige Dateien laden
async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

// XML via XSL transformieren
async function transformXML() {
    try {
        const xmlDoc = await loadFile('./static/data/index.xml');
        const xslDoc = await loadFile('./transformations/index.xsl');

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
            showCookieBanner()
        } else {
            throw new Error("Your browser does not support XSLT transformations");
        }
    } catch (error) {
        console.error("Error during XML transformation:", error);
    }
}