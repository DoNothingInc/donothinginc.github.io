// Constants
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

// Variables
let camera;
let renderer;
let scene;
let mainPrism;
let smallPrisms;
let textMesh;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Function to create a text mesh
function createTextMesh(text, x, y, z) {
    const loader = new THREE.FontLoader();
    loader.load('helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x, y, z);
        scene.add(textMesh);
    });
}

// Function to initialize the VR environment
function init() {
    // Create a camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // Set initial camera position
    camera.position.z = 5;

    // Create a WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a scene
    scene = new THREE.Scene();

    // Create the main prism
    const mainPrismGeometry = new THREE.ConeGeometry(1, 2, 3);
    const mainPrismMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    mainPrism = new THREE.Mesh(mainPrismGeometry, mainPrismMaterial);
    scene.add(mainPrism);

    // Create an array to store the small prisms
    smallPrisms = [];

    // Create multiple small prisms with random positions
    for (let i = 0; i < 50; i++) {
        const smallPrismGeometry = new THREE.ConeGeometry(0.2, 0.4, 3);
        const smallPrismMaterial = new THREE.MeshBasicMaterial({
            color: getRandomColor(),
        });
        const smallPrism = new THREE.Mesh(smallPrismGeometry, smallPrismMaterial);
        smallPrism.position.x = Math.random() * 10 - 5;
        smallPrism.position.y = Math.random() * 10 - 5;
        smallPrism.position.z = Math.random() * 10 - 5;
        scene.add(smallPrism);
        smallPrisms.push(smallPrism);
    }

    // Create the text mesh
    createTextMesh("2012", 0, 0, -3);

    // Add event listeners to track mouse movement and clicks
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    // Update renderer size when the window is resized
    window.addEventListener('resize', onWindowResize);
}

// Function to handle mouse movement
function onMouseMove(event) {
    if (!isMouseDown) return;

    // Calculate mouse movement
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate the difference in mouse position
    const deltaX = mouseX - previousMouseX;
    const deltaY = mouseY - previousMouseY;

    // Set camera position based on mouse movement
    camera.position.x += deltaX * 0.01
    camera.position.y -= deltaY * 0.01;

    // Set camera lookat position
    camera.lookAt(scene.position);

    // Update previous mouse position
    previousMouseX = mouseX;
    previousMouseY = mouseY;
}

// Function to handle mouse down event
function onMouseDown() {
    isMouseDown = true;

    // Store current mouse position
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

// Function to handle mouse up event
function onMouseUp() {
    isMouseDown = false;
}

// Function to handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to animate the VR environment
function animate() {
    // Rotate the main prism
    mainPrism.rotation.x += 0.01;
    mainPrism.rotation.y += 0.01;

    // Move the small prisms with jitter effect
    const jitterAmount = 0.1;
    smallPrisms.forEach((smallPrism) => {
        smallPrism.position.x += Math.random() * jitterAmount - jitterAmount / 2;
        smallPrism.position.y += Math.random() * jitterAmount - jitterAmount / 2;
        smallPrism.position.z += Math.random() * jitterAmount - jitterAmount / 2;
        smallPrism.rotation.x += Math.random() * jitterAmount - jitterAmount / 2;
        smallPrism.rotation.y += Math.random() * jitterAmount - jitterAmount / 2;
        smallPrism.rotation.z += Math.random() * jitterAmount - jitterAmount / 2;

        // Generate a random color for the small prism
        const color = getRandomColor();
        smallPrism.material.color.set(color);
    });

    // Animate the color of the main prism
    const hue = (Date.now() % 10000) / 10000; // Hue value changing over time
    const mainPrismColor = new THREE.Color().setHSL(hue, 1, 0.5);
    mainPrism.material.color.set(mainPrismColor);

    // Render the scene with the camera
    renderer.render(scene, camera);

    // Call animate again on the next frame
    requestAnimationFrame(animate);
}

// Function to generate a random color
function getRandomColor() {
    return Math.random() * 0xffffff;
}

// Initialize the VR environment
init();

// Start the animation loop
animate();
