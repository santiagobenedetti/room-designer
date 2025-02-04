import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
new OrbitControls(camera, renderer.domElement);
document.body.appendChild( renderer.domElement );

camera.position.set(12, 6, 12)
camera.lookAt(0, 0, 0);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// Lighting
// const ambientLight = new THREE.AmbientLight( 0x404040 );
// scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xFFFFFF );
light.position.set( 5, 3, 25);
light.castShadow = true;
scene.add( light );

const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );


// Walls
const wallThickness = 0.3;
const wallHeight = 10;
const wallWidth = 10;
const textureLoader = new THREE.TextureLoader();
const bricksTexture = textureLoader.load('/textures/bricks.webp');
bricksTexture.wrapS = THREE.RepeatWrapping;
bricksTexture.wrapT = THREE.RepeatWrapping;
bricksTexture.repeat.set(2, 2);

const floorTexture = textureLoader.load('/textures/floor.webp');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

const wallOptions: THREE.MeshStandardMaterialParameters = { 
  color: 0xfafafa, 
  metalness: 0.1, 
  roughness: 0.25,
  map: bricksTexture
};
const floorOptions: THREE.MeshStandardMaterialParameters = {
  color: 0xfafafa,
  metalness: 0.1,
  roughness: 0.25,
  map: floorTexture
};

const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
const leftWallMaterial = new THREE.MeshStandardMaterial(wallOptions);
const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.set(-wallThickness / 2, wallHeight / 2, wallWidth / 2);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
const rightWallMaterial = new THREE.MeshStandardMaterial(wallOptions);
const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.set(wallWidth / 2, wallHeight / 2, -wallThickness / 2);
rightWall.rotation.y = Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

const floorGeometry = new THREE.BoxGeometry(wallWidth + wallThickness, wallThickness, wallWidth + wallThickness);
const floorMaterial = new THREE.MeshStandardMaterial(floorOptions);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(wallWidth / 2 - wallThickness / 2, -wallThickness / 2, wallWidth / 2 - wallThickness / 2);
floor.receiveShadow = true;
scene.add(floor);

// Cube
const cubeGeometry = new THREE.SphereGeometry( 1, 100, 100); 
const cubeMaterial = new THREE.MeshStandardMaterial( {color: 0x00ff00, wireframe: true} ); 
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.position.set(2, 0.5, 4); 
cube.castShadow = true;
cube.material.metalness = 0.75;
// const textureLoader = new THREE.TextureLoader();
// const bricksTexture = textureLoader.load('../public/textures/bricks.jpg');
// cube.material.map = bricksTexture;
// scene.add(cube);

let plant: THREE.Object3D;
let desk: THREE.Object3D;
let lamp: THREE.Object3D;
let lampLight: THREE.PointLight;

// Load Plant Model
const loader = new GLTFLoader();
loader.load('/models/plant/scene.gltf', function (gltf) {
    console.log('Plant model loaded successfully');
    plant = gltf.scene;
    plant.position.set(wallThickness * 4, 1.84, wallThickness * 2); // Adjust the position as needed
    plant.scale.set(1, 1, 1); // Adjust the scale as needed
    plant.castShadow = true;
    plant.receiveShadow = true;
    plant.traverse(function (node) {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).castShadow = true;
        (node as THREE.Mesh).receiveShadow = true;
      }
    });
    scene.add(plant);
}, undefined, function (error) {
    console.error('Error loading plant model:', error);
});

// Load Desk Model
loader.load('/models/desk/scene.gltf', function (gltf) {
  console.log('Desk model loaded successfully');
  desk = gltf.scene;
  desk.position.set(wallThickness, 0, wallThickness); // Adjust the position as needed
  desk.scale.set(10, 10, 10); // Adjust the scale as needed
  desk.castShadow = true;
  desk.receiveShadow = true;
  desk.traverse(function (node) {
    if ((node as THREE.Mesh).isMesh) {
      (node as THREE.Mesh).castShadow = true;
      (node as THREE.Mesh).receiveShadow = true;
    }
  });
  scene.add(desk);
}, undefined, function (error) {
  console.error('Error loading desk model:', error);
});

// Load Lamp Model
loader.load('/models/lamp/scene.gltf', function (gltf: THREE.GLTF) {
  console.log('Lamp model loaded successfully');
  lamp = gltf.scene;
  lamp.position.set(wallThickness * 11, 1.84, wallThickness * 3); // Adjust the position as needed
  lamp.scale.set(0.03, 0.03, 0.03); // Adjust the scale as needed
  lamp.castShadow = true;
  lamp.receiveShadow = true;
  lamp.rotation.y = Math.PI;
  lamp.traverse(function (node: THREE.Object3D) {
    if ((node as THREE.Mesh).isMesh) {
      (node as THREE.Mesh).castShadow = true;
      (node as THREE.Mesh).receiveShadow = true;
    }
  });

  const target = new THREE.Object3D();
  target.position.set(wallThickness * 8.7 , 0,  wallThickness * 3); // Position the target below the lamp
  scene.add(target);
  
  // Create a PointLight and attach it to the lamp
  const lampLight = new THREE.SpotLight( 0xffffff );
  lampLight.position.set(wallThickness * 10, 3.3, wallThickness * 3);
  lampLight.angle = Math.PI / 5;
  lampLight.intensity = 3;
  lampLight.penumbra = 0.5;
  lampLight.decay = 2;
  lampLight.castShadow = true; // default false
  lampLight.target = target;
  // lampLight.camera.lookAt = new THREE.Vector3(wallThickness * 11, 0, wallThickness * 3);
  // lampLight.lookAt = new THREE.Vector3(wallThickness * 11, 0, wallThickness * 3);
  scene.add( lampLight );

  // const helper = new THREE.CameraHelper( lampLight.shadow.camera );
  // scene.add( helper );

  scene.add(lamp);
}, undefined, function (error: ErrorEvent) {
  console.error('Error loading lamp model:', error);
});

// const gui = new GUI()
// const cubeFolder = gui.addFolder('cube')
// cubeFolder.addColor({ color: cube.material.color.getHex() }, 'color').onChange(value => {
//     cube.material.color.set(value);
// });
// cubeFolder.add(cube.position, 'x', 0, Math.PI * 2)
// cubeFolder.add(cube.position, 'y', 0, Math.PI * 2)
// cubeFolder.add(cube.position, 'z', 0, Math.PI * 2)
// cubeFolder.open()
