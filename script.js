

document.addEventListener('DOMContentLoaded', function () {
    transformXML("./transformations/index.xsl", "./static/data/index.xml");
});

function showCookieBanner(){
    if (localStorage.getItem("cookieSeen") != "shown") {
        let cookie = document.getElementById('main-content').querySelector('.cookie-banner');
        cookie.style.display = "block"
    
        }
        const link = document.getElementById('main-content').querySelector('#close');
        if (link) {
            link.addEventListener("click", cookieClose);
        }
        showGlobe();
        
}





function cookieClose(event) {
    console.log("bruh")
    localStorage.setItem("cookieSeen", "shown");
    //$(".cookie-banner").fadeOut();
    location.reload();
}

function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}




function showGlobe() {
    //check if cookies are accepted
    if (!cookiesAccepted()) return;


    // Initialize variables
    let scene, camera, renderer, globe;

    // Function to initialize the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();

        // Create camera
        camera = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight), 1, 10);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);
        let mainContent = document.getElementById('main-content');
        mainContent.querySelector('#globe').appendChild(renderer.domElement)


        // Create globe geometry
        const geometry = new THREE.SphereGeometry(2, 64, 64);

        // Create globe texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./static/assets/texture.png');

        // Create globe material
        const material = new THREE.MeshBasicMaterial({map: texture});

        // Create globe mesh
        globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Start animation
        animate();
    }

    // Function to animate the globe
    function animate() {
        requestAnimationFrame(animate);

        // Rotate globe
        globe.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    init();

}


async function loadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}
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



