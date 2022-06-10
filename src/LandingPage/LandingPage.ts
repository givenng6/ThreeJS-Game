import * as THREE from "three";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Room2 from "../Room2/Room2";
import room from "../Room1/Nathi2";
import Room3 from "../Room3/Nathi";
import room4 from "../Room4/Room";

const LandingPage = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x4a4b4d);
  // const gui = new GUI();

  document.getElementById("loading").style.display = "flex";
  document.getElementById("nathi").style.display = "none";
  // document.getElementById("nathiTimer").style.display = "none";
  document.getElementById("counter").style.display = "none";
  document.getElementById("timerDiv").style.display = "none";
  document.getElementById("timerText").style.display = "none";
  // document.getElementById("divv").style.display = "none";

  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000000
  );
  camera.position.x = -2;
  camera.position.y = -5;
  camera.position.z = -15;

  // RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // LIGHTS
  light();

  var myRoom: THREE.Group;

  new GLTFLoader().load("LandingPage/room/scene.gltf", function (gltf) {
    myRoom = gltf.scene;

    scene.add(myRoom);
    // myRoom.scale.set(a,a,a);
    // myRoom.scale.set(.6,.6,.6)
    myRoom.position.set(-30, -130, -500);
    myRoom.scale.set(30, 30, 30);

    myRoom.castShadow = true;
    myRoom.receiveShadow = true;
  });
  THREE.DefaultLoadingManager.onProgress = function (
    itemPath,
    itemIndex,
    totalItems
  ) {
    // console.log(itemIndex, totalItems);

    if (itemIndex === totalItems) {
      document.getElementById("loading").style.display = "none";
    }
  };

  // MODEL WITH ANIMATIONS
  var model: THREE.Group;
  var mixer: THREE.AnimationMixer = new THREE.AnimationMixer(model);
  // var characterControls: CharacterControls;

  new GLTFLoader().load("Characters/Soldier/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.position.set(20, -15, -50);
    model.scale.set(12, 12, 12);
    // let a = 8;
    // model.scale.set(a, a, 1 * a);
    // model.position.x = 12;
    // model.position.y = -2;
    // model.position.z = 5;
    model.rotation.y = Math.PI;
    
    model.castShadow = true;
    model.receiveShadow = true;

    

    model.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
        //   console.log(object.geometry.boundingBox);
      }
    });

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    // console.log(gltf.animations);
    mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations.filter((a) => a.name == "Idle");

    mixer.clipAction(gltfAnimations[0]).play();
  });

  const loader = new THREE.FontLoader();

  const buttons = ["P L A Y"];

  var FONT: THREE.Font;

  loader.load("helvetiker_bold.typeface.json", function (font) {
    let i = 4;
    let counter = 0;
    FONT = font;

    for (let a = 60; a < 180; a += 90) {
      const geometry2 = new THREE.TextGeometry(`${buttons[counter]}`, {
        font: font,
        size: 2,
        height: 5,
        
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const text = new THREE.Mesh(geometry2, textMaterial);
      text.name = buttons[counter];
      scene.add(text);
      text.position.set(-820,40,-1000);
      text.scale.set(20,20,1)
      
      counter++;
      break;
    }
  });

  loader.load("helvetiker_bold.typeface.json", function (font) {
    const titleGeo = new THREE.TextGeometry("E S C A P E  R O O M", {
      font: font,
      size: 3,
      height: 5,
    });
    const titleMat = new THREE.MeshPhongMaterial({ color: 0xffffff });

    const title = new THREE.Mesh(titleGeo, titleMat);
    scene.add(title);
    title.position.set(-350, 265, -960);
    title.scale.set(17, 17, 0);

    
  });

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  document.getElementById("pauseIcon").style.display = "none";

  window.addEventListener("click", (event: any) => {
    raycaster.setFromCamera(mouse, camera);

    buttons.map((button, index) => {
      let intersects = raycaster.intersectObject(scene.getObjectByName(button));

      console.log(intersects.length);

      if (intersects.length > 0) {
        

        console.log(button);
        if (button === "P L A Y") {
          console.log("hello");
          window.removeEventListener("click", onClick);
          document.body.removeChild(renderer.domElement);
          // Room3();
          // Room2();
          // Room1();
          room();
        }
      }
    });
  });

  function onMouseMove(event: any) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener("pointermove", onMouseMove);

  function onClick(event: any) {
    raycaster.setFromCamera(mouse, camera);
  }

  window.addEventListener("click", onClick);

  // const keyDisplayQueue = new KeyDisplay();

  const timeStep = 1 / 60;
  // ANIMATE

  function animate() {
    // Checking for obstacles in front of the character
    mixer.update(timeStep);

    renderer.render(scene, camera);
  }

  document.body.appendChild(renderer.domElement);

  // animate();
  renderer.setAnimationLoop(animate);

  // RESIZE HANDLER
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   keyDisplayQueue.updatePosition();
  }
  window.addEventListener("resize", onWindowResize);

  function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
  }
};

export default LandingPage;
