let cities = [];
let totalCities;

let population = [];
let fitness = [];

let popSize = 10;
let recordDistance = Infinity;
let bestEver;
let isWorking = 0;
let button;
let canvasLength = 600;
let canvasHeight = 600;

function setup(){
    createCanvas(canvasLength, canvasHeight);
    background(0);
    button = createButton('Lets start');
    button.position(700, 0);
    button.mousePressed(check);
}

function mousePressed(){
  if (isWorking == 0 && mouseX <= canvasLength && mouseY <= canvasHeight){
    cities.push(new City(mouseX, mouseY));
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(mouseX, mouseY, 16);
    totalCities = cities.length;
  }
}

function check(){
  isWorking = 1;
  var basicOrder = [];

  for(let i = 0; i < totalCities; i++){
    basicOrder[i] = i;
  }

  basicOrder.shift();

  for(let i = 0; i < popSize; i++){
    population[i] = shuffle(basicOrder);
  }
}



function draw(){
  if (isWorking){
    background(0);
    //genetic algorithm
    calculateFitness();
    normalizeFitness();
    nextGeneration();

    stroke(255);
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

    let d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }

  sum += dist(points[0].x, points[0].y, points[order[0]].x, points[order[0]].y);
  sum += dist(points[0].x, points[0].y, points[order[order.length - 1]].x, points[order[order.length - 1]].y);

  return sum;
}
