// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue
document.getElementById('scene-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(10, 20, 10);
scene.add(sunLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x90EE90 }); // Light green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Trees
function createTree(x, z) {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    // Leaves
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5;
    
    treeGroup.add(trunk);
    treeGroup.add(leaves);
    treeGroup.position.set(x, 1, z);
    return treeGroup;
}

// Add trees
for (let i = 0; i < 20; i++) {
    const x = Math.random() * 80 - 40;
    const z = Math.random() * 80 - 40;
    if (Math.abs(x) > 5 || Math.abs(z) > 5) { // Keep center area clear
        scene.add(createTree(x, z));
    }
}

// Hidden secrets
const secrets = [
    {
        type: 'butterfly',
        found: false,
        position: new THREE.Vector3(8, 2, 8),
        hint: 'A colorful friend flutters nearby...'
    },
    {
        type: 'flower',
        found: false,
        position: new THREE.Vector3(-6, 0.5, 12),
        hint: 'Something beautiful grows in the shade...'
    },
    {
        type: 'bird',
        found: false,
        position: new THREE.Vector3(15, 5, -10),
        hint: 'Listen for a sweet melody above...'
    },
    {
        type: 'mushroom',
        found: false,
        position: new THREE.Vector3(-12, 0.2, -8),
        hint: 'A magical surprise hides near the trees...'
    },
    {
        type: 'pond',
        found: false,
        position: new THREE.Vector3(0, 0.1, -15),
        hint: 'Water reflects the summer sky...'
    }
];

// Create secret objects
secrets.forEach(secret => {
    let mesh;
    switch(secret.type) {
        case 'butterfly':
            mesh = createButterfly();
            break;
        case 'flower':
            mesh = createFlower();
            break;
        case 'bird':
            mesh = createBird();
            break;
        case 'mushroom':
            mesh = createMushroom();
            break;
        case 'pond':
            mesh = createPond();
            break;
    }
    mesh.position.copy(secret.position);
    mesh.userData.secretType = secret.type;
    scene.add(mesh);
});

// Helper functions to create secret objects
function createButterfly() {
    const butterfly = new THREE.Group();
    const wingGeometry = new THREE.CircleGeometry(0.5, 32);
    const wingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF69B4,
        side: THREE.DoubleSide
    });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.x = -0.25;
    rightWing.position.x = 0.25;
    butterfly.add(leftWing);
    butterfly.add(rightWing);
    return butterfly;
}

function createFlower() {
    const flower = new THREE.Group();
    const petalGeometry = new THREE.CircleGeometry(0.3, 8);
    const petalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF1493,
        side: THREE.DoubleSide
    });
    for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.rotation.z = (i / 6) * Math.PI * 2;
        flower.add(petal);
    }
    return flower;
}

function createBird() {
    const bird = new THREE.Group();
    const bodyGeometry = new THREE.ConeGeometry(0.2, 0.8, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    bird.add(body);
    return bird;
}

function createMushroom() {
    const mushroom = new THREE.Group();
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
    const capGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const capMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.3;
    mushroom.add(stem);
    mushroom.add(cap);
    return mushroom;
}

function createPond() {
    const pondGeometry = new THREE.CircleGeometry(2, 32);
    const pondMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4169E1,
        side: THREE.DoubleSide
    });
    const pond = new THREE.Mesh(pondGeometry, pondMaterial);
    pond.rotation.x = -Math.PI / 2;
    return pond;
}

// Camera controls
const moveSpeed = 0.15;
const rotateSpeed = 0.02;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canMove = false;

camera.position.set(0, 2, 10);

// Mouse controls
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    if (canMove) {
        mouseX = (event.clientX - window.innerWidth / 2) * rotateSpeed;
        mouseY = (event.clientY - window.innerHeight / 2) * rotateSpeed;
        camera.rotation.y -= mouseX * 0.01;
        camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x - mouseY * 0.01));
    }
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
    }
});

// Click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        checkSecret(object);
    }
});

// Secret finding logic
let secretsFound = 0;
function checkSecret(object) {
    const secretType = object.userData.secretType || 
                      (object.parent && object.parent.userData.secretType);
    
    if (secretType) {
        const secret = secrets.find(s => s.type === secretType && !s.found);
        if (secret) {
            secret.found = true;
            secretsFound++;
            document.getElementById('secrets-count').textContent = secretsFound;
            
            // Show hint for next secret
            const nextSecret = secrets.find(s => !s.found);
            if (nextSecret) {
                const hintElement = document.getElementById('hint');
                hintElement.textContent = nextSecret.hint;
                hintElement.style.opacity = '1';
                setTimeout(() => {
                    hintElement.style.opacity = '0';
                }, 3000);
            }
            
            // Victory condition
            if (secretsFound === 5) {
                alert('Congratulations! You found all the secrets!');
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (canMove) {
        // Movement
        const direction = new THREE.Vector3();
        const rotation = camera.rotation.y;
        
        if (moveForward) {
            direction.z -= Math.cos(rotation) * moveSpeed;
            direction.x -= Math.sin(rotation) * moveSpeed;
        }
        if (moveBackward) {
            direction.z += Math.cos(rotation) * moveSpeed;
            direction.x += Math.sin(rotation) * moveSpeed;
        }
        if (moveLeft) {
            direction.x -= Math.cos(rotation) * moveSpeed;
            direction.z += Math.sin(rotation) * moveSpeed;
        }
        if (moveRight) {
            direction.x += Math.cos(rotation) * moveSpeed;
            direction.z -= Math.sin(rotation) * moveSpeed;
        }
        
        camera.position.add(direction);
        
        // Animate secrets
        scene.traverse((object) => {
            if (object.userData.secretType === 'butterfly') {
                object.position.y = secret.position.y + Math.sin(Date.now() * 0.003) * 0.5;
                object.rotation.y = Math.sin(Date.now() * 0.002) * 0.5;
            } else if (object.userData.secretType === 'bird') {
                object.position.y = secret.position.y + Math.sin(Date.now() * 0.002) * 0.3;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the experience
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            canMove = true;
            // Lock pointer for better controls
            renderer.domElement.requestPointerLock();
        }, 500);
    }, 1500);
});

// Initialize
animate();