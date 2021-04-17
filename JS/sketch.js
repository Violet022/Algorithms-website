let cities = [];
let totalCities;

let population = [];
let fitness = [];
let distances = [];

let popSize = 10000;
let recordDistance = Infinity;
let bestEver;
let isWorking = 0;

let canvasLength = 600;
let canvasHeight = 600;

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
  if (isWorking == 0){ 
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
  var basicOrder = [];

  for(let i = 0; i < totalCities; i++){
    basicOrder[i] = i;
    distances[i] = [];
    for(let j = 0; j < totalCities; j++){
      distances[i][j] = dist(cities[i].x, cities[i].y, cities[j].x, cities[j].y);
    }
  }
  console.log(distances);
  basicOrder.shift();

  for(let i = 0; i < popSize; i++){
    population[i] = shuffle(basicOrder);
  }
}

document.getElementById('toStart').addEventListener('click', check);

function draw(){
  if (isWorking){
    background(214, 214, 214);

    //genetic algorithm
    calculateFitness();
    normalizeFitness();
    nextGeneration();

    stroke(138, 138, 138);
    strokeWeight(4);
    noFill();

    beginShape();

    for(let i = 0; i < bestEver.length; i++){
      let n = bestEver[i];
      vertex(cities[n].x, cities[n].y);
      ellipse(cities[i].x, cities[i].y, 16); 
    }
  
    vertex(cities[0].x, cities[0].y);
    line(cities[0].x, cities[0].y, cities[bestEver[0]].x, cities[bestEver[0]].y);
    ellipse(cities[totalCities - 1].x, cities[totalCities - 1].y, 16);
    endShape();
  }
}

class City{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

function swap(a, i, j){
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points, order){
  let sum = 0;
  for(var i = 0; i < order.length - 1; i++){
    let cityAIndex = order[i];
    let cityA = points[cityAIndex];
    let cityBIndex = order[i + 1];
    let cityB = points[cityBIndex];

    let d = distances[cityAIndex][cityBIndex];
    sum += d;
  }
  sum += distances[0][order[0]];
  sum += distances[0][order[order.length - 1]];
  

  return sum;
}