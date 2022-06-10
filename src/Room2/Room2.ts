import { KeyDisplay, W } from "../utils";
import { CharacterControls } from "../characterControls";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import LandingPage from "../LandingPage/LandingPage";
import Room3 from "../Room3/Nathi";

const Room2 = () => {
  // const gui = new GUI();

  //Game logic variables
  let WORD: any[] = [
    " _ ",
    " _ ",
    " _ ",
    " _ ",
    " _ ",
    " _ ",
    " _ ",
    " _ ",
    " _ ",
  ]; //Correctly guessed words
  const FINALWORD: string[] = ["A", "L", "G", "O", "R", "I", "T", "H", "M"]; // Actual word
  let MOVESCOUNT: number = 25; //Number of moves
  let CORRECTCOUNT: number = 0; //Number of letters found
  let TILEINDEX: number; //Index of the tile the charector is currently in
  let openTiles: any[] = []; // Open tile
  const LETTERS: any[] = [
    {
      index: 0,
      letter: "G",
    },
    {
      index: 1,
      letter: "R",
    },
    {
      index: 2,
      letter: "L",
    },
    {
      index: 3,
      letter: "R",
    },
    {
      index: 4,
      letter: "H",
    },
    {
      index: 5,
      letter: "M",
    },
    {
      index: 6,
      letter: "I",
    },
    {
      index: 7,
      letter: "A",
    },
    {
      index: 8,
      letter: "M",
    },
    {
      index: 9,
      letter: "T",
    },
    {
      index: 10,
      letter: "O",
    },
    {
      index: 11,
      letter: "T",
    },
    {
      index: 12,
      letter: "L",
    },
    {
      index: 13,
      letter: "O",
    },
    {
      index: 14,
      letter: "I",
    },
    {
      index: 15,
      letter: "G",
    },
    {
      index: 16,
      letter: "A",
    },
    {
      index: 17,
      letter: "H",
    },
  ]; // Letters under each tile

  document.getElementById("loading").style.display = "flex"; //Show the loading screen while the models are still loading

  // HTML elements needed for the current room
  var modal = document.getElementById("myModal");
  document.getElementById("pauseIcon").style.display = "block";
  document.getElementById("modalText").style.display = "none";
  document.getElementById("continueBtn").style.display = "block";
  document.getElementById("restartBtn").style.display = "block";
  document.getElementById("timerDiv").style.display = "none";
  document.getElementById("timerText").style.display = "none";

  //Create a scenne
  const scene = new THREE.Scene();
  const loader = new THREE.FontLoader();
  scene.background = new THREE.Color(0x000000);

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
  orbitControls.minDistance = 700;
  orbitControls.maxDistance = 1000000000;
  orbitControls.enablePan = false;
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
  orbitControls.update();

  // LIGHTS
  light();

  // Load the models

  // A group on all the models that make up the room that the charecter must not move throght
  var roomComponents: THREE.Group = new THREE.Group();

  var myRoom: THREE.Group = new THREE.Group(); //current room

  new GLTFLoader().load("Room2/room/scene.gltf", function (gltf) {
    myRoom = gltf.scene;
    roomComponents.add(myRoom);
    let scale = 100;
    myRoom.scale.set(scale, scale, scale);

    myRoom.castShadow = true;
    myRoom.receiveShadow = true;
  });

  var tv: THREE.Group; //TV model

  var textMesh: THREE.Mesh; //Mesh for the found letters on the TV screen
  var FONT: THREE.Font;
  var movesMesh: THREE.Mesh; // Mesh for the moves count on the TV screen

  new GLTFLoader().load("Room2/tv/scene.gltf", function (gltf) {
    tv = gltf.scene;
    roomComponents.add(tv);

    tv.scale.set(8.5, 6, 2);
    tv.position.set(0, 170, -580);

    let info = ["W e l c o m e  t o  r o o m 2"]; //Text to be displayed on the TV screen

    loader.load("helvetiker_bold.typeface.json", (font) => {
      //Load font
      FONT = font;

      //First text on the screen
      const textGeometry = new THREE.TextGeometry(`${info[0]}`, {
        font: font,
        size: 3,
        height: 5,
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      tv.add(textMesh);
      textMesh.position.x = -26;

      //Number of moves
      const movesGeometry = new THREE.TextGeometry(MOVESCOUNT.toString(), {
        font: font,
        size: 5,
        height: 5,
      });

      const movesMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      movesMesh = new THREE.Mesh(movesGeometry, movesMaterial);
      movesMesh.position.set(0, 8, 0);
    });
  });

  //Create the tiles

  let TileBoxes: THREE.Box3[] = []; //Invinsible boxes array to get the position of the character

  loader.load("helvetiker_bold.typeface.json", (font) => {
    let colorCount = 0;
    let counter = 0; //Tile index
    for (let i = -200; i < 400; i += 200) {
      for (let j = -500; j <= 500; j += 200) {
        //Create a tile
        const tileGeometry = new THREE.BoxGeometry(200, 15, 200);
        const tileMaterial = new THREE.MeshPhongMaterial({
          color: colorCount % 2 === 0 ? 0x000000 : 0xffffff,
          transparent: true,
          opacity: 1,
        });

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.name = "cylinder" + counter.toString();
        roomComponents.add(tile);

        tile.position.set(i, 0, j);

        //Letter under the tile
        const letterGeometry = new THREE.TextGeometry(LETTERS[counter].letter, {
          font: font,
          size: 7,
          height: 1,
        });
        const letterMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const letter = new THREE.Mesh(letterGeometry, letterMaterial);
        letter.name = counter.toString();
        scene.add(letter);
        letter.position.set(i, 5, j);
        letter.scale.set(6.6, -7, 6.6);
        letter.rotateX(Math.PI / 2);

        //Invinsible Box
        const invinsibleBox = new THREE.Mesh(
          new THREE.BoxGeometry(200, 800, 200),
          new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.001,
          })
        );
        invinsibleBox.position.set(i, 0, j);

        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(invinsibleBox);
        TileBoxes.push(boundingBox);

        colorCount += 1;
        counter += 1;
      }
      colorCount += 1;
    }
  });

  //Loading manager. Notify me when all the models are fully loaded
  THREE.DefaultLoadingManager.onProgress = function (
    itemPath,
    itemIndex,
    totalItems
  ) {
    if (itemIndex === totalItems) {
      //If all the models are loaded, hide the loading screen
      document.getElementById("loading").style.display = "none"; //Hide loading screen
    }
  };

  // In three seconds, remove the welcome message on the screen and start the game
  setTimeout(() => {
    textMesh.geometry = new THREE.TextGeometry(WORD.toString(), {
      font: FONT,
      size: 3,
      height: 5,
    });
    textMesh.position.x = -24;
    tv.add(movesMesh);
    document.getElementById("infoAlert").style.display = "flex";
  }, 3000);

  setTimeout(() => {document.getElementById("infoAlert").style.display = "none";},8000)

  // MODEL WITH ANIMATIONS
  var model: THREE.Group;
  var Mixer: THREE.AnimationMixer;
  var characterControls: CharacterControls;

  new GLTFLoader().load("Characters/Soldier/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.scale.set(130, 130, 130);
    model.position.z = 250;
    model.castShadow = true;
    model.receiveShadow = true;

    model.traverse(function (object: any) {
      if (object.isMesh) {
        object.castShadow = true;
      }
    }); //Make the charactor have a shadow.

    // gltfAnimations
    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations
      .filter((a) => a.name != "T_Pose") //Remove the Tpose from the animations
      .forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });

    characterControls = new CharacterControls( //Add character controls and set the default animations to Idle
      model,
      mixer,
      animationsMap,
      orbitControls,
      camera,
      "Idle"
    );
  });

  let mouse = new THREE.Vector2();

  function onMouseMove(event: any) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener("pointermove", onMouseMove);

  scene.add(roomComponents); // Add room components to the scene

  //EVENT LISTENERS

  //Character controls movement keys
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

  let FOUNDINDEX: any[] = [];

  //Space key event listener for openning the tiles
  document.addEventListener("keyup", (event) => {
    if (event.key === "space" || event.key === " ") {
      const curr = scene.getObjectByName("cylinder" + TILEINDEX.toString()); //Get the current tile by name from the scene

      if (openTiles.length === 0) {
        //If no tile is open
        LETTERS.map((letter, index) => {
          if (letter.index === TILEINDEX) {
            //Get the letter under the current tile by index
            openTiles.push(letter); //add it to the open tiles array
            curr.visible = false; //Open tile
          }
        });
      } else {
        //If we have a tile open

        if (openTiles[0].index !== TILEINDEX && FOUNDINDEX.indexOf(TILEINDEX) === -1) {

          let openTile = openTiles[0];
          let currTile = LETTERS[TILEINDEX];
          curr.visible = false; //one current tile
          MOVESCOUNT -= 1;

          if (MOVESCOUNT === 0 && CORRECTCOUNT !== 9) {
            //Check if the player still has moves
            //if no moves left
            textMesh.geometry = new THREE.TextGeometry("GAME OVER", {
              font: FONT,
              size: 4,
              height: 5,
            }); //Display GAME over on the screen
            movesMesh.visible = false; //Hide moves

            setTimeout(() => {
              //Two seconds after the player loses,
              // show the modal and give the player an option to either
              // Go to the home page to restart the current level
              renderer.setAnimationLoop(null); //Pause the game
              modal.style.display = "block";
              document.getElementById("modalText").style.display = "block";
              document.getElementById("modalText").innerHTML = "Game Over!";
              document.getElementById("continueBtn").style.display = "none";
              document.getElementById("homeBtn").style.display = "block";
            }, 2000);
          } else {
            // if we have moves left
            movesMesh.geometry = new THREE.TextGeometry(MOVESCOUNT.toString(), {
              font: FONT,
              size: 4,
              height: 5,
            });

            if (openTile.letter !== currTile.letter) {
              // Incorrct tile openned

              setTimeout(() => {
                curr.visible = true;
                scene.getObjectByName(
                  "cylinder" + openTile.index.toString()
                ).visible = true;
              }, 1500);
            } else {
              //Correct tile openned

              CORRECTCOUNT++;
              FOUNDINDEX.push(TILEINDEX);
              FOUNDINDEX.push(openTile.index);
              WORD[FINALWORD.indexOf(openTile.letter)] = currTile.letter;
              textMesh.geometry = new THREE.TextGeometry(`${WORD.toString()}`, {
                font: FONT,
                size: 3,
                height: 5,
              });

              if (CORRECTCOUNT === 9) {
                //Got all the letters
                setTimeout(() => {
                  movesMesh.visible = false;
                  textMesh.geometry = new THREE.TextGeometry(
                    `CONGRATULATIONS!!!! \nSEE YOU ON THE OTHER SIDE`,
                    { font: FONT, size: 3, height: 5 }
                  );
                }, 1000);

                setTimeout(() => {
                  //in four seconds, got to the next room
                  // renderer.setAnimationLoop(null);
                  // modal.style.display = "block";
                  // document.getElementById("modalText").style.display = "block";
                  // document.getElementById("modalText").innerHTML = "CONGRATULATIONS!!!!";
                  // document.getElementById("continueBtn").style.display = "none";
                  // document.getElementById("restartBtn").style.display = "none";
                  // document.getElementById("homeBtn").style.display = "block";

                  document.body.removeChild(renderer.domElement);
                  Room3();
                }, 4000);
              }
            }
          }

          openTiles = [];
          // console.log(openTiles)
        }
      }
      // console.log(openTiles);
    }
  });

  //Pause game
  document.getElementById("pauseIcon").addEventListener("click", () => {
    renderer.setAnimationLoop(null);
    modal.style.display = "block";
  });

  //Continue
  document.getElementById("continueBtn").addEventListener(
    "click",
    () => {
      modal.style.display = "none";
      renderer.setAnimationLoop(animate);
    },
    false
  );

  //restart game
  document.getElementById("restartBtn").addEventListener(
    "click",
    () => {
      // modal.style.display = "none";
      // renderer.setAnimationLoop(animate);
      document.body.removeChild(renderer.domElement);
      modal.style.display = "none";
      Room2();
    },
    false
  );

  //home
  document.getElementById("homeBtn").addEventListener(
    "click",
    () => {
      document.body.removeChild(renderer.domElement);
      modal.style.display = "none";
      LandingPage();
    },
    false
  );

  const timeStep = 1 / 60;
  // ANIMATE
  var start = 0;
  var modelBoundingBox: THREE.Box3;
  var bounded: any;
  let date = new Date();

  let callOnce = false;

  function animate() {
    let count = 0;

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
          if (count < 1) {
            modelBoundingBox = object.geometry.boundingBox.setFromObject(model);
            bounded = object;
            count++;
          }
        }
      });

      //Postions of the character based on the invinsible boxes
      TileBoxes.map((boundingBox, index) => {
        if (boundingBox.containsBox(modelBoundingBox) && !callOnce) {
          TILEINDEX = index; //index of the tile the character is currently in.

          callOnce = true;
        }
        if (!boundingBox.containsBox(modelBoundingBox) && callOnce) {
          callOnce = false;
        }
      });
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
      if (roomComponents) {
        roomComponents.traverse(function (object: any) {
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
        if (roomComponents) {
          roomComponents.traverse(function (object: any) {
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

export default Room2;
