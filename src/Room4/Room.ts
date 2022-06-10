import { KeyDisplay, W } from "../utils";
import { CharacterControls } from "../characterControls";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LandingPage from "../LandingPage/LandingPage";

function room() {
  // Global variables
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var intersected: any;
  var selectableObjects: any = [];
  document.getElementById('timerDiv').style.display = "none";
  document.getElementById('timerText').style.display = "none";
  // SCENE
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);
  document.getElementById("loading").style.display = "flex";
  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000000
  );
  camera.position.y = 5;
  camera.position.z = 5;
  camera.position.x = 0;

  // RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  //orbitControls.enableZoom = false
  orbitControls.minDistance = 250;
  orbitControls.maxDistance = 10;
  orbitControls.enablePan = false;
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
  orbitControls.update();

  // adding audio in the scene
  var audioLoader = new THREE.AudioLoader();
  var listener = new THREE.AudioListener();
  camera.add(listener);
  var sound = new THREE.Audio(listener);

  // Music by The War On Drugs - Thinking Of A Place
  var stream = "/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3";
  //Music by "http://opengameart.org/content/project-utopia-seamless-loop"
  var stream2 = "/sounds/Project_Utopia.mp3";

  audioLoader.load(stream2, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.4);
    //sound.play();
  });

  // LIGHTS
  light();

  //room
  var myRoom2: THREE.Group;

  new GLTFLoader().load("Room4/room2/scene.gltf", function (gltf) {
    myRoom2 = gltf.scene;
    scene.add(myRoom2);
    myRoom2.scale.set(4, 4, 4);
    myRoom2.position.set(500, -1000, -4600);
    myRoom2.castShadow = true;
    myRoom2.receiveShadow = true;
  });

  // textures
  const textureLoader = new THREE.TextureLoader();
  const textureMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("/textures/excape.jpg"),
    side: THREE.DoubleSide,
  }); //{ color: "gray",side: THREE.DoubleSide, transparent: false }

  // walls
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(550, 700),
    textureMaterial
  );
  wall.rotation.y = Math.PI;
  wall.position.x = 100;
  wall.position.y = 200;
  wall.position.z = -2400;

  scene.add(wall);

  const wall2 = wall.clone();
  wall2.position.x = -600;
  wall2.position.y = 200;
  wall2.position.z = -3700;
  wall2.rotation.y = Math.PI / 2;

  scene.add(wall2);

  // Puzzels
  var group = new THREE.Group();
  group.position.y = 100;
  group.position.z = -4655;
  //group.position.z = -3000;

  let materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 100),
    new THREE.MeshBasicMaterial({
      color: "blue",
      side: THREE.DoubleSide,
      transparent: false,
    })
  );
  plane.position.y = 0;
  plane.position.x = 0;
  plane.position.z = 0;
  plane.rotation.x = 0;
  group.add(plane);

  var textMesh: any;
  var question_answer = get_Puzzels();
  loadQuestion();

  function loadQuestion() {
    const loader = new THREE.FontLoader();
    THREE.Cache.enabled = true;
    loader.load("helvetiker_bold.typeface.json", function (font: any) {
      const textGeo = new THREE.TextGeometry(question_answer[1], {
        font: font,
        size: 10,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeo.computeBoundingBox();

      textMesh = new THREE.Mesh(textGeo, materials);

      textMesh.position.x = -80;
      textMesh.position.y = 25;
      textMesh.position.z = 10;
      group.add(textMesh);

      get_answer(font);
    });
  }

  scene.add(group);

  function get_answer(font: any) {
    var group2 = new THREE.Group();
    group2.position.x = -70;
    group2.position.y = -40;
    group2.position.z = 2;

    const geo = new THREE.BoxGeometry(30, 20, 2);
    const box = new THREE.Mesh(
      geo,
      new THREE.MeshPhongMaterial({ color: "red", transparent: true })
    );
    box.position.z = -1;
    box.position.x = 13;
    box.position.y = 5;
    group2.add(box);

    const textGeo = new THREE.TextGeometry("Yes", {
      font: font,
      size: 12,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    const textGeo2 = new THREE.TextGeometry("No", {
      font: font,
      size: 12,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const box2 = box.clone();
    box2.position.z = -1;
    box2.position.x = 13;
    box2.position.y = -35;
    group.add(box2);
    textGeo.computeBoundingBox();
    textGeo2.computeBoundingBox();

    let textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.position.z += 10;
    group2.add(textMesh1);
    group.add(group2);

    let textMesh2 = new THREE.Mesh(textGeo2, materials);
    textMesh2.position.x = 5;
    textMesh2.position.y = -40;
    textMesh2.position.z = 10;

    selectableObjects.push(textMesh1);
    selectableObjects.push(textMesh2);

    group.add(textMesh2);
  }

  // MODEL WITH ANIMATIONS
  var model: THREE.Group;
  var characterControls: CharacterControls;

  new GLTFLoader().load("Characters/Soldier/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.scale.set(150, 150, 150);
    console.log(model.position);
    model.position.z = -250;
    model.position.set(0, -130, -3000);
    model.castShadow = true;
    model.receiveShadow = true;

    model.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
        console.log(object.geometry.boundingBox);
      }
    });

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations
      .filter((a) => a.name != "TPose")
      .forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });

    characterControls = new CharacterControls(
      model,
      mixer,
      animationsMap,
      orbitControls,
      camera,
      "Idle"
    );
  });

  const geometry2 = new THREE.BoxGeometry(10, 20, 10);
  const material2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const telepotation_door = new THREE.Mesh(geometry2, material2);

  let i2 = 1;
  telepotation_door.scale.set(20 * i2, 18 * i2, 20 * i2);
  telepotation_door.position.z = -2500;
  telepotation_door.position.y = 50;
  telepotation_door.position.x = 10;
  telepotation_door.material.transparent = true;
  telepotation_door.material.opacity = 0.5;

  const boundingBox2 = new THREE.Box3();
  boundingBox2.setFromObject(telepotation_door);

  // message to the player

 

  THREE.DefaultLoadingManager.onProgress = function (
    itemPath,
    itemIndex,
    totalItems
  ) {
    if (itemIndex === totalItems) {
      document.getElementById("loading").style.display = "none";
      // pause=false;
      document.getElementById("infoAlert1").style.display = 'block';
      document.getElementById("infoAlert2").style.display = 'block';
    }
  };

  // keeking track of correct answers and incorrect answers
  var correct_answers = 0;
  var incorrect_answers = 0;

  // EVENTS
  //  on mouse move
  function onMouseMove(event: any) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the ray
    var intersects = raycaster.intersectObjects(selectableObjects, true);

    var answer = "";

    if (intersects.length > 0) {
      if (intersects[0].object === selectableObjects[0]) {
        answer = "Yes";
      } else {
        answer = "No";
      }
    }

    const displayResult = (ans:boolean)=>{
      const alert = document.getElementById("resultAlert");
      alert.style.display = "block";




      alert.textContent = ans ? "You are correct!" : "You are incorrect!"
      alert.style.backgroundColor = ans ? "rgba(0,255,0,0.5)" : "rgba(255,0,0,0.5)";
      alert.style.borderColor = ans ? "rgb(0,255,0)" : "rgb(255,0,0)";

      setTimeout(()=>alert.style.display = "none",2000)
      
    }

    if (question_answer[0] === answer) {
      scene.remove(textMesh);
      question_answer = get_Puzzels();
      loadQuestion();
      scene.add(textMesh);
      // alert("You are correct!");
      displayResult(true)
      correct_answers++;
    } else if (answer !== "" && question_answer[0] !== answer) {
      scene.remove(textMesh);
      question_answer = get_Puzzels();
      loadQuestion();
      scene.add(textMesh);
      // alert("You are incorrect!");
      displayResult(false)
      incorrect_answers++;
    }

    // if the limit of incorrect numbers has been reached, the player dies
    if (incorrect_answers == 2) {
      // scene.remove(model);
      // scene.remove(group);
      modal.style.display = "block";
      document.getElementById("modalText").style.display = "block";
      document.getElementById("modalText").innerHTML = "You lose!!";
      document.getElementById("continueBtn").style.display = "none";
    }

    // the player has won
    nextLevel();
  }

  // CONTROL KEYS
  const keysPressed = {};
  const keyDisplayQueue = new KeyDisplay();
  document.addEventListener(
    "keydown",
    (event) => {
      keyDisplayQueue.down(event.key);
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
      }
    },
    false
  );
  document.addEventListener(
    "keyup",
    (event) => {
      keyDisplayQueue.up(event.key);
      (keysPressed as any)[event.key.toLowerCase()] = false;
    },
    false
  );
  const timeStep = 1 / 60;

  var modal = document.getElementById("myModal");
  console.log(modal);
  document.getElementById("pauseIcon").style.display = "block";

  document.getElementById("pauseIcon").addEventListener("click", () => {
    renderer.setAnimationLoop(null);
    modal.style.display = "block";
    // pause=true;
  });

  document.getElementById("continueBtn").addEventListener(
    "click",
    () => {
      modal.style.display = "none";
      renderer.setAnimationLoop(animate);
      // pause=false;
    },
    false
  );

  
  document.getElementById("restartBtn").addEventListener(
    "click",
    () => {
      
      modal.style.display = "none";
      document.body.removeChild(renderer.domElement);
      room();
    },
    false
  );

  document.getElementById("homeBtn").addEventListener(
    "click",
    () => {
      modal.style.display = "none";
      document.body.removeChild(renderer.domElement);

      LandingPage();
    },
    false
  );

  // ANIMATE
  var start = 0;
  var modelBoundingBox2: THREE.Box3;
  var bounded2: any;

  document.body.appendChild(renderer.domElement);
  renderer.setAnimationLoop(animate);

  function animate() {
    let count2 = 0;

    var direction: THREE.Vector3;
    if (characterControls) {
      direction = characterControls.walkDirection;
      direction.normalize();
    }

    var origin;
    var intersects: THREE.Intersection[][][] = [];
    // Teleportation
    if (model) {
      model.traverse(function (object: any) {
        if (object.isMesh) {
          if (count2 < 1) {
            modelBoundingBox2 =
              object.geometry.boundingBox.setFromObject(model);
            bounded2 = object;
            count2++;
          }
        }
      });

      if (boundingBox2.containsBox(modelBoundingBox2)) {
        console.log("contained");
        model.position.set(30, -30, 150);
        renderer.setAnimationLoop(null);
        document.body.removeChild(renderer.domElement);
        LandingPage();
        count2 = 0;
      }
    }

    // Checking for obstacles in front of the character
    var step = false;
    if (model) {
      origin = new THREE.Vector3(
        model.position.x,
        model.position.y + start,
        model.position.z
      );

      const downRaycaster = new THREE.Raycaster(
        origin,
        new THREE.Vector3(0, -1, 0),
        0,
        700000000000000
      );

      let downIntersects: THREE.Intersection[][] = [];

      if (myRoom2) {
        myRoom2.traverse(function (object: any) {
          if (object.isMesh) {
            let thisDownIntersect = downRaycaster.intersectObject(object);
            if (thisDownIntersect.length !== 0) {
              downIntersects.push(thisDownIntersect);
            }
          }
        });
      }
      if (wall) {
        wall.traverse(function (object: any) {
          if (object.isMesh) {
            let thisDownIntersect = downRaycaster.intersectObject(object);
            if (thisDownIntersect.length !== 0) {
              downIntersects.push(thisDownIntersect);
            }
          }
        });
      }
      if (wall2) {
        wall2.traverse(function (object: any) {
          if (object.isMesh) {
            let thisDownIntersect = downRaycaster.intersectObject(object);
            if (thisDownIntersect.length !== 0) {
              downIntersects.push(thisDownIntersect);
            }
          }
        });
      }
      if (downIntersects.length !== 0) {
        let newYPosition = downIntersects[0][0].distance;
        if (newYPosition > 27) {
          start = 0;
        }
      }

      let preIntersect = 0;
      while (origin.y !== 260 + start) {
        const raycaster = new THREE.Raycaster(origin, direction, 0, 70);

        var thisRayIntersects: THREE.Intersection[][] = [];

        if (myRoom2) {
          myRoom2.traverse(function (object: any) {
            if (object.isMesh) {
              let intersected = raycaster.intersectObject(object);
              if (intersected.length !== 0) {
                thisRayIntersects.push(intersected);
              }
            }
          });
        }

        if (wall) {
          wall.traverse(function (object: any) {
            if (object.isMesh) {
              let intersected = raycaster.intersectObject(object);
              if (intersected.length !== 0) {
                thisRayIntersects.push(intersected);
              }
            }
          });
        }

        if (wall2) {
          wall2.traverse(function (object: any) {
            if (object.isMesh) {
              let intersected = raycaster.intersectObject(object);
              if (intersected.length !== 0) {
                thisRayIntersects.push(intersected);
              }
            }
          });
        }

        if (thisRayIntersects.length !== 0 && thisRayIntersects.length < 55) {
          preIntersect = origin.y;
        }

        if (thisRayIntersects.length !== 0) {
          intersects.push(thisRayIntersects);
        }

        if (
          thisRayIntersects.length === 0 &&
          origin.y <= 10 &&
          intersects.length !== 0
        ) {
          model.position.y = preIntersect;
          start = preIntersect;
          step = true;
          break;
        }
        origin.y += 5;
      }
    }

    // Keeping the character and camera at the same position if there are obstacles
    // step = false;
    if (model !== undefined && intersects.length !== 0 && !step) {
      if (characterControls) {
        orbitControls.maxDistance = 150; // to be able to see the character when blocked
        model.position.set(
          characterControls.modelPrePos.x,
          characterControls.modelPrePos.y,
          characterControls.modelPrePos.z
        );
        characterControls.camera.position.set(
          characterControls.camPrePos.x,
          characterControls.camPrePos.y,
          characterControls.camPrePos.z
        );
      }
    } else {
      orbitControls.maxDistance = 1000; // to be able to see the character when blocked
    }

    if (characterControls) {
      characterControls.update(timeStep, keysPressed);
    }

    orbitControls.update();
    renderer.render(scene, camera);
  }
  var count = 0;
  function nextLevel() {
    if (correct_answers == 5) {
      scene.remove(group);
      scene.add(telepotation_door);
      correct_answers = 0;
      if (count == 0) {
        alert("Look For A Green Box And Stand Inside It To Escape The Room");
        count++;
      }
    }
  }

  function get_Puzzels() {
    let puzzels = [
      ["No", "What is one the capital\n city of South Africa is Japan"],
      ["No", "Is 0/0 equal to zero"],
      [
        "Yes",
        "Who make it doesn't need it,\nwho buy it doesn't use it,\nwho use it never sees it,\n what is it? Coffin?",
      ],
      ["Yes", "Can cats jump six times their length?"],
      ["No", "Have you ever seen a UFO?"],
      ["Yes", "Do mice really eat cheese?"],
      ["NO", "Can you see out the \nback of your head?"],
      ["Yes", "Has Backgammon been played for 5,000 years?"],
      ["Yes", "Have you ever worn \nunderwear two days in a row?"],
      ["Yes", "Have you ever lied to your parents?"],
      ["No", "Afica is made up of 100 countries"],
      ["No", "Is it possible to sneeze with your eyes open?"],
    ];

    let puzzel_Random_Index = Math.floor(Math.random() * puzzels.length);

    return puzzels[puzzel_Random_Index];
  }

  // RESIZE HANDLER
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition();
  }
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", onMouseMove, false);

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

    var toplight = new THREE.PointLight(0xffffff, 0.2);
    toplight.castShadow = true;
    toplight.position.set(0, 100, -3000);
    scene.add(toplight);

    scene.add(dirLight);
  }
}

export default room;
