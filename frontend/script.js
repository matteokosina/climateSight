document.addEventListener('DOMContentLoaded', function() {


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
        renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.5);
        document.getElementById('globe').appendChild(renderer.domElement);

        // Create globe geometry
        const geometry = new THREE.SphereGeometry(2, 32, 32);

        // Create globe texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./texture.png');

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

// Initialize the scene
    init();

});
