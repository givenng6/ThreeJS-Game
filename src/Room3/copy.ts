import { KeyDisplay } from "../utils";
import { CharacterControls } from "../characterControls";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LandingPage from "../LandingPage/LandingPage";
import SecondGame from "./SecondGame";

function Nathi() {
  // SCENE
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  document.getElementById("loading").style.display = "flex";
  document.getElementById("timerDiv").style.display = "flex";

  var modal = document.getElementById("myModal");

  document.getElementById("pauseIcon").style.display = "block";
  document.getElementById("modalText").style.display = "none";
  document.getElementById("continueBtn").style.display = "block";
  document.getElementById("restartBtn").style.display = "block";

  document.getElementById("pauseIcon").addEventListener("click", () => {
    renderer.setAnimationLoop(null);
    modal.style.display = "block";
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
      //   renderer.setAnimationLoop(null);
      modal.style.display = "none";
      document.body.removeChild(renderer.domElement);
      Nathi();
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
  var myRoom: THREE.Group, Mixer: THREE.AnimationMixer;

  var GLTFLoaderr = new GLTFLoader();
  GLTFLoaderr.load("Room1/Models/RoomToBeEscaped/scene.gltf", function (gltf) {
    myRoom = gltf.scene;
    scene.add(myRoom);
    // myRoom.castShadow = true
    // myRoom.receiveShadow = true
    myRoom.traverse(function (object: any) {
      if (object.isMesh) {
        // object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  });

  // GLTFLoaderr.onProgress  = function
  THREE.DefaultLoadingManager.onProgress = function (
    itemPath,
    itemIndex,
    totalItems
  ) {
    if (itemIndex === totalItems) {
      document.getElementById("loading").style.display = "none";
    }
  };

  // MODEL WITH ANIMATIONS
  var model: THREE.Group, characterControls: CharacterControls;

  var tmpMxr: THREE.AnimationMixer;
  new GLTFLoader().load("Characters/Soldier/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.scale.set(150, 150, 150);
    model.position.z = -250;
    model.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
        // console.log(object.geometry.boundingBox)
      }
    });
    console.log(gltf);
    tmpMxr = new THREE.AnimationMixer(gltf.scene);
    // gltf.animations.push()
    gltf.animations.forEach((clip) => {
      if (clip.name === "Run") {
        tmpMxr.clipAction(clip).play();
      }
    });
    // new GLTFLoader().load('Characters/Soldier/Soldier.glb', function (soldier) {
    //     console.log(soldier)
    //     gltf.animations = soldier.animations
    //     console.log(gltf)

    //     // const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    //     // const mixer = new THREE.AnimationMixer(model);
    //     // const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    //     // gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
    //     //     animationsMap.set(a.name, mixer.clipAction(a))
    //     // })
    //     // console.log(characterControls)
    //     // characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle')
    // })
    // console.log(gltf)
    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations
      .filter((a) => a.name != "TPose")
      .forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });
    // console.log(characterControls)
    characterControls = new CharacterControls(
      model,
      mixer,
      animationsMap,
      orbitControls,
      camera,
      "Idle"
    );
  });

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

  var timer: any = 5;
  document.getElementById("timerText").innerHTML = timer;
  var interval = setInterval(function () {
    timer--;
    if (parseInt(document.getElementById("counter").innerHTML) !== 0 && !win) {
      // timer = parseInt(document.getElementById('counter').innerHTML) - 1
      document.getElementById("counter").innerHTML = timer.toString();
      document.getElementById("timerText").innerHTML = timer;
    } else {
      clearInterval(interval);
    }
  }, 1000); //run this thang every 1 seconds

  var firstBoundingBox: THREE.Box3;
  const buttonsBoard = new THREE.Group();
  function firstGame() {
    const geometry = new THREE.SphereBufferGeometry(10);
    const materialRed = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const redButton = new THREE.Mesh(geometry, materialRed);
    redButton.name = "Red";
    buttonsBoard.add(redButton);

    const materialBlue = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const blueButton = new THREE.Mesh(geometry, materialBlue);
    blueButton.position.x = 25;
    blueButton.name = "Blue";
    buttonsBoard.add(blueButton);

    const materialGreen = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const greenButton = new THREE.Mesh(geometry, materialGreen);
    greenButton.position.x = -25;
    greenButton.name = "Green";
    buttonsBoard.add(greenButton);

    const boardGeometry = new THREE.BoxBufferGeometry(80, 0, 20);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    buttonsBoard.add(board);

    buttonsBoard.rotation.x = (90 * Math.PI) / 180;
    buttonsBoard.position.y = 300;
    buttonsBoard.position.z = 1500;
    scene.add(buttonsBoard);
    const box = openPortal();
    box.material.color.set(0xffffff);
    box.material.opacity = 0.0000001;
    box.position.z = 1500;
    firstBoundingBox = new THREE.Box3();
    firstBoundingBox.setFromObject(box);
    // console.log(buttonsBoard)
  }
  firstGame();
  // SecondGame(scene);

  var popUpMessage: any, Font: any, board: any;
  function askFirstRiddle() {
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
        "P r e s s  O n e  O f  T h e  B u t t o n s , \nF a i l u r e  T o  P r e s s  A  B u t t o n  I n  9 0  S e c o n d s  W i l l  R e s u l t  T o  A  L o s s\nP r e s s i ng  T h e  W r o n g  B u t t o n  W i l l  C a u s e  T i m e  T o  M o v e  F a s t e r",
        {
          font: font,
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
      text.position.z = 10;
      text.position.x = -210;
      // console.log(text)
    });

    popUpMessage.position.z = 1600;
    popUpMessage.position.y = 100;
    popUpMessage.rotation.y = (180 * Math.PI) / 180;
  }

  const random = Math.floor(Math.random() * 3) + 1;
  var clueText = new THREE.Group();
  function clue() {
    const boardGeometry = new THREE.BoxBufferGeometry(100, 100, 20);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 300;

    clueText.add(board);
    scene.add(clueText);

    const loader = new THREE.FontLoader();

    loader.load("helvetiker_bold.typeface.json", function (font: any) {
      var geometry: THREE.TextGeometry;
      const geometryRed = new THREE.TextGeometry(
        "T D U \n       N O R \n              T E B",
        {
          font: font,
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
      const geometryBlue = new THREE.TextGeometry(
        "T E U \n       N O B \n              T L B U",
        {
          font: font,
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
      const geometryGreen = new THREE.TextGeometry(
        "T G U E \n       N O R N \n              T E B",
        {
          font: font,
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

      if (random === 1) {
        geometry = geometryRed;
      } else if (random === 2) {
        geometry = geometryBlue;
      } else {
        geometry = geometryGreen;
      }

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const text = new THREE.Mesh(geometry, textMaterial);
      clueText.add(text);
      text.scale.set(0.1, 0.1, 0.1);
      text.position.y = 310;
      text.position.z = 10;
      text.position.x = -40;
      // console.log(text)
    });

    clueText.position.z = 1500;
    clueText.position.y = -30;
    clueText.position.x = -90;
    clueText.rotation.y = (180 * Math.PI) / 180;
  }

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

  function winner() {
    console.log("Winner");
    // popUpMessage.children[1].geometry = new THREE.TextGeometry('CONGRATULATIONS!!!!! \n You Survived This Round', {
    //     font: Font,
    //     size: 80,
    //     height: 5,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 5,
    //     bevelSize: 8,
    //     bevelOffset: 0,
    //     bevelSegments: 5
    // });
    win = true;
    scene.remove(buttonsBoard);
    scene.remove(clueText);
    scene.remove(popUpMessage);
    window.removeEventListener("click", onClick);
    var victory = new Audio("Sounds/Victory.mp3");
    victory.play();
    audio.pause();
    clearInterval(interval);
    document.body.removeChild(renderer.domElement);
    renderer.setAnimationLoop(null);

    // Lindo()
    // startSecondGame()
  }

  var retry, youLose: HTMLElement, newCharacterControls: CharacterControls;
  function loser() {
    scene.remove(buttonsBoard);
    scene.remove(clueText);
    window.removeEventListener("click", onClick);
    newCharacterControls = characterControls;
    characterControls = null;
    orbitControls.enabled = false;
    retry = document.getElementById("retry");
    retry.style.display = "flex";
    retry.style.flex = "row";
    // retry.innerHTML = '<Button> Retry </Button>'
    retry.addEventListener("click", Retry);

    youLose = document.getElementById("youLose");
    youLose.style.display = "flex";
    youLose.style.flex = "row";
    // youLose.innerHTML = '<div> TIME"S UP, YOU LOSE!!!! </div>'
    document.getElementById("continueBtn").style.display = "none";
    document.getElementById("modalText").style.display = "block";
    document.getElementById("modalText").innerHTML = "TIME'S UP, YOU LOSE!!!!";
    modal.style.display = "block";
  }
  var win = false;

  var newCharacterControls: CharacterControls;
  function Retry() {
    scene.add(buttonsBoard);
    scene.add(clueText);
    window.addEventListener("click", onClick);
    characterControls = newCharacterControls;
    characterControls.update(timeStep, keysPressed);
    orbitControls.update();
    orbitControls.enabled = true;
    var retry = document.getElementById("retry");
    retry.innerHTML = "<div}></div>";
    youLose.innerHTML = "<div}></div>";

    document.getElementById("counter").innerHTML = "90";
    timer = 3;
    divider = 0;
    console.log(divider);
    faster();
    once = false;
  }

  var divider = 1;
  function faster() {
    divider++;
    interval = setInterval(function () {
      if (
        parseInt(document.getElementById("counter").innerHTML) !== 0 &&
        !win
      ) {
        timer = parseInt(document.getElementById("counter").innerHTML) - 1;
        document.getElementById("counter").innerHTML = timer.toString();
      } else {
        divider = 0;
        clearInterval(interval);
      }
    }, 1000 / divider); //run this thang faster than 1 second
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
    var direction: THREE.Vector3;
    if (characterControls) {
      direction = characterControls.walkDirection;
      direction.normalize();
    }

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

      if (firstBoundingBox.containsBox(modelBoundingBox) && !callOnce) {
        askFirstRiddle();
        clue();
        callOnce = true;
      }
    }

    // Checking for obstacles in front of the character
    var step = false;
    var origin;
    var intersects: THREE.Intersection[][][] = [];
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

    if (timer === 0 && !once) {
      console.log("loser");
      // clearInterval(interval)
      loser();
      once = true;
    }
    if (Mixer) Mixer.update(delta);

    // console.log(tmpMxr)
    if (characterControls) {
      characterControls.update(timeStep, keysPressed);
    }
    orbitControls.update();
    // if (tmpMxr) tmpMxr.update(delta);
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

  function onClick(event: any) {
    raycaster.setFromCamera(mouse, camera);
    let intersectsRed = raycaster.intersectObject(scene.getObjectByName("Red"));
    let intersectsBlue = raycaster.intersectObject(
      scene.getObjectByName("Blue")
    );
    let intersectsGreen = raycaster.intersectObject(
      scene.getObjectByName("Green")
    );
    if (intersectsRed.length > 0 && random === 1) {
      winner();
      return;
    } else if (intersectsBlue.length > 0 && random === 2) {
      winner();
      return;
    } else if (intersectsGreen.length > 0 && random === 3) {
      winner();
      return;
    } else if (
      intersectsGreen.length > 0 ||
      intersectsRed.length > 0 ||
      intersectsBlue.length > 0
    ) {
      faster();
      return;
    }
  }
  window.addEventListener("click", onClick);

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

  // document.body.onkeyup = function (e) {
  //     if (e.key == " " || e.code == "Space") {
  //         alert('Space Clicked')
  //     }
  // }
}
export default Nathi;
