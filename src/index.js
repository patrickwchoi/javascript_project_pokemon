// JS Entry File
console.log('Hello');
const Sprite = require("./sprite.js");
const collisions = require("./collisions.js");
const Player = require("./player.js");

//Create Canvas
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext("2d");
ctx.fillRect(0,0,canvas.width, canvas.height);

//iterate through collisions arr incrementing by width. Creates 2d arr of collisions
const collisionsMap = [];
for (let i=0; i<collisions.length; i+=125){ //do i do .length-1?
  collisionsMap.push(collisions.slice(i, i+125))
}
class Boundary {
  static width = 16;
  static height = 16;
  constructor({pos}){
    this.pos = pos
    this.width = 16
    this.height = 16  //dimensions of tiles after adjusting for zoom
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}
const boundaries = [];
const offset = [0,-80] //default location of map at start

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j)=>{
    if (symbol === 17281){ //if pos on our collisions grid has collision, add boundaruy
      boundaries.push(new Boundary({
      pos: [j*Boundary.width + offset[0],i*Boundary.height+ offset[1]] 
    }))}
    //pushing boundary object where i is row, j is coln in our collisions arr
  })
})

//Create Variables
const map = new Image();
map.src = '../img/tilemap3.png';
const james = new Image();
james.src = '../img/james_sprites.png';
let james_width = james.width*2
let james_height = james.height*2

const background = new Sprite({pos: offset, image: map, ctx:ctx});
const player = new Player({
  pos: [canvas.width/2 - 48/3, canvas.height/2 - 80/4] , //manually fixed pos based on james.png dim
  image: james, ctx:ctx, 
  frames:{width:3, height:4}});

const keys = {
  w:{ pressed: false},
  a:{ pressed: false},
  s:{ pressed: false},
  d:{ pressed: false},
}

const testBoundary = new Boundary({pos: [100,50]});
const moveables = [background, testBoundary];

function rectangularCollision(rec1, rec2){
      // If one rectangle is on left side of other
      if (rec1.pos[0] > rec2.pos[0]+rec2.width || rec1.pos[0]+rec1.width < rec2.pos[0]) {
          return false;
      }

      // If one rectangle is above other
      if (rec2.pos[1] > rec1.pos[1]+rec1.height || rec2.pos[1]+rec2.height < rec1.pos[1]) {
          return false;
      }

      return true;
  // return (
  //   rec1.pos[0]+rec1.width >= rec2.pos[0]&&
  //   rec1.pos[0] <= rec2.pos[0]+rec2.width&&
  //   rec1.pos[1]+rec1.height >= rec2.pos[1]&&
  //   rec1.pos[1] <= rec2.pos[1]+rec2.height
  // )
}
function animate() { //animates screen. will run infinietly and 'refresh' screen
  window.requestAnimationFrame(animate);
  // ctx.drawImage(map, background.pos[0] ,background.pos[1]); 
  background.draw();
  boundaries.forEach(boundary => { 
    boundary.draw(); //animate our collisions
  })
  testBoundary.draw();
  // ctx.drawImage(james, 
  //   0,0,
  //   16,20, //first 4 args are cropping sprite
  //   canvas.width/2-james_width/2,
  //   canvas.height/2-james_height/2, //where on canvas we place james, from the top left corner
  //   32,
  //   40); //how big james is
  player.draw();
    //check if movement will collide with a collision
    if (rectangularCollision(player, testBoundary)){
      console.log('colliding')
    }
    //moving background with WASD
    if (keys.w.pressed && lastkey==='w') {
      moveables.forEach((moveable) =>{
        moveable.pos[1]+=8
      })}
    else if(keys.s.pressed && lastkey==='s'){
      moveables.forEach((moveable) =>{
        moveable.pos[1]-=8
      })}
    else if(keys.a.pressed && lastkey==='a'){
      moveables.forEach((moveable) =>{
        moveable.pos[0]+=8
      })}
    else if(keys.d.pressed && lastkey==='d'){
      moveables.forEach((moveable) =>{
        moveable.pos[0]-=8
      })}
    }
animate();


let lastkey = ''; //this is a bit redundant, but it helps tidy up wasd in case multiple keys are pressed down at once
window.addEventListener("keydown", (e)=>{ //whenever a key is pressed, will update keys hash
  switch(e.key){
    case 'w': 
      keys.w.pressed = true
      lastkey = 'w'
      break;
    case 'a': 
      keys.a.pressed = true
      lastkey = 'a'
      break;
    case 's': 
      keys.s.pressed = true
      lastkey = 's'
      break;
    case 'd': 
      keys.d.pressed = true
      lastkey = 'd'
      break;
  }
})
window.addEventListener("keyup", (e)=>{ //whenever a key is not pressed, will update keys hash
  switch(e.key){
    case 'w': 
      keys.w.pressed = false
      break;
    case 'a': 
      keys.a.pressed = false
      break;
    case 's': 
      keys.s.pressed = false
      break;
    case 'd': 
      keys.d.pressed = false
      break;
  }
})