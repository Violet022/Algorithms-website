let cities = [];
let totalCities;

let recordDistance = Infinity;
let bestEver = [];
let isWorking = 0;
let button;
let buttonStop;

let canvasLength = 600;
let canvasHeight = 600;

let Q = 5;
let alpha = 1;
let beta = 2;
let reductionCoefficient = 0.95;
let start = 0;
let pheromones = [];
let distances = [];
let visited = [];
let changedPheromones = [];

function setup(){
  
  let canvas = createCanvas(canvasLength, canvasHeight);
  canvas.id("myCanvas");
  document.getElementById('myCanvas').addEventListener('click', MousePressed);
  background(214, 214, 214);
  
  
}

function stop(){
  isWorking = 0;
}

function MousePressed(){
  if (isWorking == 0 && mouseX <= canvasLength && mouseY <= canvasHeight){
    cities.push(new City(mouseX, mouseY));
    stroke(138, 138, 138);
    strokeWeight(4);
    noFill();
    ellipse(mouseX, mouseY, 16);
    totalCities = cities.length;
  }
}

document.getElementById('toStop').addEventListener('click', stop);

function check(){
  
  isWorking = 1;
  
  for(let i = 0; i < totalCities; i++){
    bestEver[i] = i;
    pheromones[i] = [];
    distances[i] = [];
    changedPheromones[i] = [];
    for(let j = 0; j < totalCities; j++){
      pheromones[i][j] = 1;
      changedPheromones[i][j] = 0;
      distances[i][j] = dist(cities[i].x, cities[i].y, cities[j].x, cities[j].y);
    }
  }
  
  bestEver.push(bestEver[0]);
  

}

document.getElementById('toStart').addEventListener('click', check);

function draw(){
  if (isWorking){
    background(214, 214, 214);
    
    nullVisited();
    
    start %= totalCities;

    oneAnt(start);


    stroke(138, 138, 138);
    strokeWeight(4);
    noFill();

    beginShape();

    for(let i = 0; i < bestEver.length; i++){
      let n = bestEver[i];
      vertex(cities[n].x, cities[n].y);
      ellipse(cities[n].x, cities[n].y, 16); 
    }
  
    //vertex(cities[0].x, cities[0].y);
    //line(cities[0].x, cities[0].y, cities[bestEver[0]].x, cities[bestEver[0]].y);
    //ellipse(cities[totalCities - 1].x, cities[totalCities - 1].y, 16);
    endShape();
  }

  visited.length = 0;
  start++;
}

class City{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}


function calcDistance(points, order){
  let sum = 0;
  for(var i = 0; i < order.length - 1; i++){
    let cityAIndex = order[i];
    let cityA = points[cityAIndex];
    let cityBIndex = order[i + 1];
    let cityB = points[cityBIndex];

    let d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }

  return sum;
}