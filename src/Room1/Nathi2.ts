import { KeyDisplay } from "../utils";
import { CharacterControls } from "../characterControls";
import * as THREE from "three";
import LandingPage from "../LandingPage/LandingPage";
// import 'threex.domevents/threex.domevents'

// import { CameraHelper, FontLoader, TextGeometry, BoxBufferGeometry, MeshPhongMaterial } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Room2 from "../Room2/Room2";
// import Lindo from './Lindo';

export function Nathi2() {
  // SCENE
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);
  let pause: boolean = true;

  document.getElementById("timerDiv").style.display = "flex";
  document.getElementById("timerText").style.display = "flex";

  var modal = document.getElementById("myModal");
  document.getElementById("loading").style.display = "flex";
  document.getElementById("pauseIcon").style.display = "flex";
  document.getElementById("modalText").style.display = "none";
  document.getElementById("continueBtn").style.display = "block";
  document.getElementById("restartBtn").style.display = "block";

  document.getElementById("pauseIcon").addEventListener("click", () => {
    renderer.setAnimationLoop(null);
    modal.style.display = "block";
    pause = true;
  });

  document.getElementById("continueBtn").addEventListener(
    "click",
    () => {
      modal.style.display = "none";
      renderer.setAnimationLoop(animate);

    },
    false
  );

  document.getElementById("restartBtn").addEventListener(
    "click",
    () => {
      // modal.style.display = "none";
      // renderer.setAnimationLoop(animate);
      modal.style.display = "none";
      document.body.removeChild(renderer.domElement);
      Nathi2();
    },
    false
  );

  document.getElementById("homeBtn").addEventListener(
    "click",
    () => {
      document.body.removeChild(renderer.domElement);
      modal.style.display = "none";
      LandingPage();
    },
    false
  );

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

  // CONTROLS
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 100;
  orbitControls.maxDistance = 1000000000;
  orbitControls.enablePan = false;
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
  orbitControls.update();

  // MOUSE
  var mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // LIGHTS
  light();
  var myRoom: THREE.Group,
    clock: THREE.Group,
    thanos: THREE.Group,
    stones: THREE.Group,
    Mixer: THREE.AnimationMixer;
  var MixerTesseract: THREE.AnimationMixer,
    Scepter: THREE.Object3D<THREE.Event> | THREE.Group;
  var tesseract: THREE.Object3D<THREE.Event> | THREE.Group,
    eyeOfAgamotto: THREE.Object3D<THREE.Event> | THREE.Group;

  myRoom = new THREE.Group();
  new GLTFLoader().load("Room1/Models/escapeRoom/scene.gltf", function (gltf) {
    myRoom.add(gltf.scene);
    scene.add(myRoom);
    // myRoom.castShadow = true
    myRoom.receiveShadow = true;
    myRoom.scale.set(45, 45, 45);
    myRoom.translateZ(1500);
    myRoom.translateY(50);
    myRoom.traverse(function (object: any) {
      if (object.isMesh) {
        // object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    const geometry = new THREE.BoxBufferGeometry(1200, 550, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(0, 5, -12);
    wall.scale.set(0.022, 0.022, 0.022);
    wall.name = "wall";
    myRoom.add(wall);
  });
  new GLTFLoader().load("Room1/Models/wallClock/scene.gltf", function (gltf) {
    clock = gltf.scene;
    myRoom.add(clock);
    // clock.name = 'clock'
    // myRoom.castShadow = true
    clock.castShadow = true;
    clock.scale.set(10, 10, 10);
    clock.position.set(0, 7, -11.5);

    clock.traverse(function (object: any) {
      if (object.isMesh) {
        // object.castShadow = true;
        object.castShadow = true;
        object.name = "clock";
      }
    });
  });
  THREE.DefaultLoadingManager.onProgress = function (
    itemPath,
    itemIndex,
    totalItems
  ) {
    if (itemIndex === totalItems) {
      document.getElementById("loading").style.display = "none";
      pause = false;
    }
  };

  new GLTFLoader().load("Room1/Models/thanos/scene.gltf", function (gltf) {
    thanos = gltf.scene;
    scene.add(thanos);
    thanos.castShadow = true;
    thanos.scale.set(100, 100, 100);
    thanos.position.set(520, 200, 1520);
    thanos.rotateY((-90 * Math.PI) / 180);

    thanos.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
        object.name = "thanos";
      }
    });
  });
  new GLTFLoader().load(
    "Room1/Models/decoyStones/Scepter/scene.gltf",
    function (gltf) {
      Scepter = gltf.scene;
      scene.add(Scepter);
      Scepter.castShadow = true;
      Scepter.scale.set(2000, 2000, 2000);
      Scepter.position.set(520, 280, 1100);
      Scepter.rotateY((-90 * Math.PI) / 180);
      Scepter.rotateX((-90 * Math.PI) / 180);

      Scepter.traverse(function (object: any) {
        if (object.isMesh) {
          object.castShadow = true;
          object.name = "scepter";
        }
      });
    }
  );
  new GLTFLoader().load(
    "Room1/Models/decoyStones/tesseract/scene.gltf",
    function (gltf) {
      tesseract = gltf.scene;
      scene.add(tesseract);
      tesseract.castShadow = true;
      tesseract.scale.set(70, 70, 70);
      tesseract.position.set(530, 210, 1100);
      // stones.rotateY(-90*Math.PI/180)

      tesseract.traverse(function (object: any) {
        if (object.isMesh) {
          object.castShadow = true;
          object.name = "tesseract";
        }
      });

      MixerTesseract = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        MixerTesseract.clipAction(clip).play();
      });
    }
  );
  new GLTFLoader().load(
    "Room1/Models/decoyStones/eyeOfAgamotto/scene.gltf",
    function (gltf) {
      eyeOfAgamotto = gltf.scene;
      scene.add(eyeOfAgamotto);
      eyeOfAgamotto.castShadow = true;
      eyeOfAgamotto.scale.set(1.5, 1.5, 1.5);
      eyeOfAgamotto.position.set(550, 340, 1100);
      eyeOfAgamotto.rotateY((-90 * Math.PI) / 180);

      eyeOfAgamotto.traverse(function (object: any) {
        if (object.isMesh) {
          object.castShadow = true;
          object.name = "eyeOfAgamotto";
        }
      });
    }
  );
  // }

  // MODEL WITH ANIMATIONS
  var model: THREE.Group, characterControls: CharacterControls;
  // console.log('gltf')
  new GLTFLoader().load("Characters/Soldier/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.scale.set(150, 150, 150);
    model.position.z = -250;
    model.castShadow = true;
    // model.position.set(0, 20, 1603)
    // model.receiveShadow = true

    model.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
        // console.log(object.geometry.boundingBox)
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

  //Display The Stones Once They Are Found
  function displayTheStones() {
    new GLTFLoader().load(
      "Room1/Models/InfinityStones/scene.gltf",
      function (gltf) {
        stones = gltf.scene;
        scene.add(stones);
        stones.castShadow = true;
        stones.scale.set(0.1, 0.1, 0.1);
        stones.position.set(0, 150, 1750);

        stones.traverse(function (object: any) {
          if (object.isMesh) {
            object.castShadow = true;
            object.name = "stones";
          }
        });

        Mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          Mixer.clipAction(clip).play();
        });
      }
    );
  }

  function openPortal() {
    const geometry = new THREE.BoxGeometry(10, 20, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
    });
    const box = new THREE.Mesh(geometry, material);
    // scene.add(box);
    let i = 1;
    box.scale.set(20 * i, 18 * i, 20 * i);
    box.position.z = -1500;
    box.position.y = 150;
    box.material.transparent = true;
    box.material.opacity = 0.001;

    return box;
  }

  var timer: any;

  var popUpMessage: any, Font: any, board: any;
  var audio = new Audio("Sounds/gameSound.mp3");
  document.addEventListener("click", function () {
    audio.play();
  });

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

  var retry, youLose: HTMLElement, newCharacterControls: CharacterControls;
  var win2 = false;
  function secondGameWinner() {
    console.log("Winner");
    clearInterval(interval2);
    // setInterval(interval2)
    window.addEventListener("dblclick", Continue);
    popUpMessage.children[1].geometry = new THREE.TextGeometry(
      "C O N G R A T U L A T I O N S ! ! ! ! ! \nY o u  H a v e  F o u n d  T h e  I n f i n i t y  S t o n e s\n\nD O U B L E  C L I C K  H E R E  T O  C O N T I N U E",
      {
        font: Font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      }
    );
    window.removeEventListener("dblclick", select);
    var victory = new Audio("Sounds/Victory.mp3");
    victory.play();
    win2 = true;
    // audio.pause()
    // clearInterval(interval)
    displayTheStones();
    window.addEventListener("dblclick", Continue);
  }

  function Continue() {
    raycaster.setFromCamera(mouse, camera);
    let intersectsPopUpMessage = raycaster.intersectObject(
      scene.getObjectByName("popUpMessage")
    );
    console.log(scene.getObjectByName("popUpMessage"));
    if (intersectsPopUpMessage.length > 0) {
      // console.log('I Got Here')
      throwAnotherRiddle();
      return;
    }
  }

  var anotherThrown = false;
  function throwAnotherRiddle() {
    anotherThrown = true;
    popUpMessage.children[1].geometry = new THREE.TextGeometry(
      "F I N D  A  W A Y  O U T \nI T  D O E S N ' T  M A T T E R  W H E R E  Y O U  G O ,  \nT H A N O S  S E E ' S  A L L",
      {
        font: Font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      }
    );
  }

  function rotateThanos() {
    // console.log(Math.round(thanos.rotation.y * 180 / Math.PI))
    if (Math.round((thanos.rotation.y * 180) / Math.PI) !== 0) {
      thanos.rotation.y += (1 * Math.PI) / 180;
    } else {
      anotherThrown = false;
      addAWayOut();
    }
  }

  var portal: THREE.Box3;
  function addAWayOut() {
    const box = openPortal();
    box.material.opacity = 1;
    box.position.set(500, 150, 2000);
    // scene.add(box)
    portal = new THREE.Box3();
    portal.setFromObject(box);
  }

  // var newCharacterControls: CharacterControls, check: boolean
  function secondGameLoser() {
    // clearInterval(interval)
    window.removeEventListener("dblclick", select);
    // youLose = document.getElementById("youLose");
    // youLose.style.display = "flex";
    // youLose.style.flex = "row";
    // youLose.innerHTML = '<div> TIME"S UP, YOU LOSE!!!! </div>';

    modal.style.display = "block";
    document.getElementById("modalText").style.display = "block";
    document.getElementById("modalText").innerHTML = "TIME'S UP, YOU LOSE!!!!";
    document.getElementById("continueBtn").style.display = "none";
  }

  var divider2 = 1;
  function faster2() {
    divider2++;
    interval2 = setInterval(function () {
      if (!pause) {
        if (
          parseInt(document.getElementById("timerText").innerHTML) !== 0 &&
          !win2
        ) {
          timer = parseInt(document.getElementById("timerText").innerHTML) - 1;
          document.getElementById("timerText").innerHTML = timer.toString();
        } else {
          divider2 = 0;
          clearInterval(interval2);
        }
      }
    }, 1000 / divider2); //run this thang faster than 1 second
  }
  //Load If The Player Is Confident About His Selection
  var yes: HTMLElement;
  function IfYes() {
    yes.innerHTML = "<div}></div>";
    if (intersectsClock.length > 0) {
      // check = true
      secondGameWinner();
      return;
    } else {
      // check = false
      faster2();
      return;
    }
  }

  //Start Second Game If The Player Wins
  var interval2: any;
  function loadGame() {
    var avengers = new Audio("Sounds/Avengers.mp3");
    avengers.autoplay;
    avengers.play();
    avengers.loop = true;
    model.position.set(0, 20, 1603);
    characterControls.camera.position.z += 1603;
    characterControls.cameraTarget.x = characterControls.model.position.x;
    characterControls.cameraTarget.y = characterControls.model.position.y + 250;
    characterControls.cameraTarget.z = characterControls.model.position.z;

    // scene.remove(myRoom)
    // loadSecondRoom()
    popUpMessage = new THREE.Group();
    const boardGeometry = new THREE.BoxBufferGeometry(500, 100, 20);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 300;
    // popUpMessage.name = 'popUpMessage'
    board.name = "popUpMessage";

    popUpMessage.add(board);
    scene.add(popUpMessage);

    const loader = new THREE.FontLoader();

    loader.load("helvetiker_bold.typeface.json", function (font: any) {
      Font = font;
      const geometry = new THREE.TextGeometry(
        "F I N D  T H E  I N F I N T Y  S T O N E S\n\nP O S S E S S I N G  A L L  S T O N E S   W I E L D S  I N F I N I T E  P O W E R.\nW I T H I N  T H I S  S P A C E  Y O U ' L L  F I N D  T H E M  A L L  I N  T I M E .\nA L T E R  Y O U R  M I N D , B E N D  Y O U R  R E A L I T Y .\nL O O K  D E E P  I N T O  Y O U R  S O U L .\nT H E R E ' S  N O  T I M E  L I K E  P R E S E N T .\nB U T  F I R S T ,  Y O U R  M I N D  M U S T  B E  I N  O R D E R\n\nN . B .: D O U B L E  C L I C K  T H E  O B J E C T  Y O U  T H I N K  T H E  S T O N E S  M I G H T  B E  H I D D E N  I N\nC H O O S I N G  A  W R O N G  O B J E C T  W I L L  C A U S E  T I M E  T O  M O V E  F A S T E R",
        {
          font: Font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 5,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5,
        }
      );
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const text = new THREE.Mesh(geometry, textMaterial);
      // text.name = 'popUpMessage'
      popUpMessage.add(text);
      text.scale.set(0.1, 0.1, 0.1);
      text.position.y = 310;
      text.position.z = 20;
      text.position.x = -210;
      // console.log(text)
    });
    popUpMessage.position.z = 1600;
    popUpMessage.position.y = 100;
    popUpMessage.rotation.y = (180 * Math.PI) / 180;
    // popUpMessage.children[1].geometry
    board.position.y -= 40;
    board.position.x += 50;
    popUpMessage.position.z += 450;
    board.scale.set(1.2, 1.6, 1);
    scene.add(popUpMessage);
    document.getElementById("timerText").innerHTML = "90";
    timer = 90;
    // win = false
    interval2 = setInterval(function () {
      if (!pause) {
        if (
          parseInt(document.getElementById("timerText").innerHTML) !== 0 &&
          !win2
        ) {
          timer = parseInt(document.getElementById("timerText").innerHTML) - 1;
          document.getElementById("timerText").innerHTML = timer.toString();
        } else {
          clearInterval(interval2);
        }
      }
    }, 1000); //run this thang every 1 second
  }

  // ANIMATE
  var start = 0,
    modelBoundingBox: THREE.Box3,
    callOnce = false,
    Clock = new THREE.Clock(),
    once = false,
    once2 = false,
    portalOnce = true;
  const timeStep = 1 / 60;
  function animate() {
    // console.log(just)
    // just++
    document.getElementById("error").innerHTML = "";
    document.getElementById("question").innerHTML = "";
    document.getElementById("input").innerHTML = "";
    if (model && !once) {
      loadGame();
      once = true;
    }
    var direction: THREE.Vector3;
    if (characterControls) {
      direction = characterControls.walkDirection;
      direction.normalize();
    }

    var origin;
    var intersects: THREE.Intersection[][][] = [];
    // Teleportation
    let count = 0;
    if (model) {
      model.traverse(function (object: any) {
        if (object.isMesh) {
          if (count < 1) {
            modelBoundingBox = object.geometry.boundingBox.setFromObject(model);
            count++;
          }
        }
      });
      if (portal) {
        if (portal.containsBox(modelBoundingBox) && portalOnce) {
          document.body.removeChild(renderer.domElement);
          renderer.setAnimationLoop(null);
          Room2();
          portalOnce = false;
        }
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
      // if (myRoom) {
      //     myRoom.traverse(function (object: any) {
      //         if (object.isMesh) {
      //             let thisDownIntersect = downRaycaster.intersectObject(object)
      //             if (thisDownIntersect.length !== 0) {
      //                 downIntersects.push(thisDownIntersect)
      //             }
      //         }
      //     })
      // }

      if (downIntersects.length !== 0) {
        let newYPosition = downIntersects[0][0].distance;
        if (newYPosition > 27) {
          // console.log("distance = "+downIntersects[0][0].distance)
          // model.position.y = 0
          start = 0;
          // modelBody.position.y = 0
        }
      }

      // const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), origin, 700000000000000, 0x0000ff);
      // scene.add(arrowHelper);
      let preIntersect = 0;
      while (origin.y !== 260 + start) {
        const raycaster = new THREE.Raycaster(origin, direction, 0, 70);

        var thisRayIntersects: THREE.Intersection[][] = [];
        if (myRoom) {
          myRoom.traverse(function (object: any) {
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

        // const arrowHelper = new THREE.ArrowHelper(direction, origin, 70, 0x0000ff);
        // scene.add(arrowHelper);

        if (
          thisRayIntersects.length === 0 &&
          origin.y <= 55 &&
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

    // Keeping the character and camera and the same position if there are obstacles
    if (model !== undefined && intersects.length !== 0 && !step) {
      if (characterControls) {
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
    }
    var delta = Clock.getDelta();

    if (timer === 0 && !once2 && thanos) {
      console.log("SecondGameLoser");
      // clearInterval(interval)
      secondGameLoser();
      once2 = true;
    }

    if (anotherThrown) {
      rotateThanos();
    }

    if (Mixer) Mixer.update(delta);
    if (MixerTesseract) MixerTesseract.update(delta / 4);

    if (characterControls) {
      characterControls.update(timeStep, keysPressed);
    }
    orbitControls.update();
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
    keyDisplayQueue.updatePosition();
  }
  window.addEventListener("resize", onWindowResize);

  function onMouseMove(event: any) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener("pointermove", onMouseMove);

  let intersectsClock: any;
  let preSelection: any[] = [];
  function select() {
    if (clock) {
      if (preSelection.length > 0) {
        for (let i = 0; i < preSelection.length; i++) {
          var object: any = scene.getObjectByName(preSelection[0].name);
          var red = preSelection[0].color.red;
          object.material.color.r = red;
          object.material.color.g = preSelection[0].color.green;
          object.material.color.b = preSelection[0].color.blue;
          console.log(object.material.color);
          // console.log(preSelection)
        }
      }
      raycaster.setFromCamera(mouse, camera);
      intersectsClock = raycaster.intersectObject(
        myRoom.getObjectByName("clock")
      );
      // console.log(intersectsClock)
      let intersects = raycaster.intersectObjects(scene.children);
      let intersected: any[][] = [];
      myRoom.traverse(function (object: any) {
        if (object.isMesh) {
          let intersect = raycaster.intersectObject(object);
          if (intersect.length > 0) {
            intersected.push(intersect);
          }
        }
      });
      thanos.traverse(function (object: any) {
        if (object.isMesh) {
          let intersect = raycaster.intersectObject(object);
          if (intersect.length > 0) {
            intersected.push(intersect);
          }
        }
      });
      tesseract.traverse(function (object: any) {
        if (object.isMesh) {
          let intersect = raycaster.intersectObject(object);
          if (intersect.length > 0) {
            intersected.push(intersect);
          }
        }
      });
      Scepter.traverse(function (object: any) {
        if (object.isMesh) {
          let intersect = raycaster.intersectObject(object);
          if (intersect.length > 0) {
            intersected.push(intersect);
          }
        }
      });
      eyeOfAgamotto.traverse(function (object: any) {
        if (object.isMesh) {
          let intersect = raycaster.intersectObject(object);
          if (intersect.length > 0) {
            intersected.push(intersect);
          }
        }
      });

      // preSelection = intersected
      console.log(intersected);

      if (intersected.length > 0) {
        preSelection = [];
        var closest = intersected[0][0].distance;
        var path = intersected[0][0];
        for (let i = 0; i < intersected.length; i++) {
          for (let j = 0; j < intersected[i].length; j++) {
            if (closest > intersected[i][j].distance) {
              closest = intersected[i][j].distance;
              path = intersected[i][j];
            }
          }
        }
        var red = path.object.material.color.r;
        var green = path.object.material.color.g;
        var blue = path.object.material.color.b;

        var color = { red, green, blue };

        preSelection.push({ color: color, name: path.object.name });
        path.object.material.color.r = 1;
        path.object.material.color.g = 0;
        path.object.material.color.b = 0;
      }

      yes = document.getElementById("YES");
      yes.style.display = "flex";
      yes.style.flex = "column";
      yes.innerHTML = "<button> YES </button>";
      yes.addEventListener("click", IfYes);
    }
  }
  window.addEventListener("dblclick", select);

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
  }
}
export default Nathi2;
