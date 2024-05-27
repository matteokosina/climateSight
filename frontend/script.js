if (!cookiesAccepted() && location.pathname != "/frontend/index.html") {
    location.assign("http://" + location.host + "/frontend/index.html");
}


function cookieClose() {
    localStorage.setItem("cookieSeen", "shown");
    $(".cookie-banner").fadeOut();
    location.reload();
}

function cookiesAccepted() {
    return (localStorage.getItem("cookieSeen") == "shown");
}


// Globe animation
document.addEventListener('DOMContentLoaded', showGlobe);
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

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
        document.getElementById('globe').appendChild(renderer.domElement);

        // Create globe geometry
        const geometry = new THREE.SphereGeometry(2, 64, 64);

        // Create globe texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./assets/texture.png');

        // Create globe material
        const material = new THREE.MeshBasicMaterial({ map: texture });

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

// Load new site (in its correct language)
function loadContent(lang) {

    $.ajax({
        type: "GET",
        url: "./content/index_content.xml",
        dataType: "xml",
        success: function (xml) {
            var xslFile;
            if (lang === 'en') {
                xslFile = "./i18n/translate_en.xsl";
            } else if (lang === 'de') {
                xslFile = "./i18n/translate_de.xsl";
            }
            $.ajax({
                type: "GET",
                url: xslFile,
                dataType: "xml",
                success: function (xsl) {
                    var xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xsl);
                    var resultDocument = xsltProcessor.transformToFragment(xml, document);
                    $('#main-content').empty().append(resultDocument);
                }
            });
        }
    });
}

$(document).ready(function () {
    // Load German content by default
    loadContent('de');
});
