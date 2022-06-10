import * as THREE from "three";
import { Mesh } from "three";

export default function (
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.Renderer
) {
  const loader = new THREE.FontLoader();

  const letterBoxIndex = ["0", "19", "3", "11", "14", "2"];
  const letterBoxColours = ["L", "I", "S", "T", "E", "N"]; //Anagram of Silent
  let allLetters: any = [];

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let font: any;

  loader.load("helvetiker_bold.typeface.json", function (font) {
    let i = 2;
    let counter = 0;
    let inCount = 0;

    for (let a = 60; a < 300; a += 60) {
      for (let b = 0; b < 425; b += 85) {
        // console.log(letterBoxColours[counter])
        const randomCharacter =
          alphabet[Math.floor(Math.random() * alphabet.length)];

        var letterBox: THREE.Group;
        const geometry = new THREE.BoxGeometry(30, 15, 30);
        const material = new THREE.MeshPhongMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.5,
        });
        material.needsUpdate = true;

        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.name = counter.toString()+"box";
        cylinder.visible = false;
        scene.add(cylinder);

        cylinder.scale.set(i, i, i);
        cylinder.position.z = -1500;
        cylinder.position.y = a;
        cylinder.position.x = b;

        let letter =
          letterBoxIndex.indexOf(`${counter.toString()}`) !== -1
            ? letterBoxColours[inCount]
            : randomCharacter;

        allLetters.push(letter);

        const geometry2 = new THREE.TextGeometry(`${letter}`, {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 5,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        
        if (letterBoxIndex.indexOf(`${counter.toString()}`) !== -1) {
          inCount++;
        }

        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(geometry2, textMaterial);
        text.name = counter.toString()+"letter";
        scene.add(text);
        text.visible = false;
        // text.needsUpdate = true;
        text.scale.set(0.2, 0.2, 0.2);
        text.position.z = -1500;
        text.position.y = a;
        text.position.x = b;
        counter++;

        //   scene.add(letterBox);
      }
    }
  });
  let time = 25;

  // const timer = setInterval(() => {
  //   document.getElementById("counter").innerHTML =
  //     time >= 0 ? time.toString() : "Game over";
  //   time -= 1;
  //   if (document.getElementById("counter").innerHTML == "Game over") {
  //     window.removeEventListener("click", onClick);
  //   }
  // }, 1000);

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  function onClick(event: any) {
    raycaster.setFromCamera(mouse, camera);

    for (let i = 0; i < 20; i++) {
      let intersects = raycaster.intersectObject(
        scene.getObjectByName(i.toString()+"box")
      );
      if (intersects.length > 0) {
        console.log("hey");
        // document.getElementById("error").innerHTML = "";
        // let currWord = document.getElementById("input").innerHTML.toString();

        for(let a = 0; a <20;a++){
          const curr:any = scene.children[a]
          if(curr.name!==undefined){
            if(curr.name===a.toString()+"box"){
              scene.children[a] = new THREE.Mesh(curr.geometry,new THREE.MeshPhongMaterial({
                color: 0xbd9fb9,
                transparent: true,
                opacity: 0.9,
              }))
            }

          }
        }

        

        return;
      }
    }
  }

  // window.addEventListener("click", onClick);
}
