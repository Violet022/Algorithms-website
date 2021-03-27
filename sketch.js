var cities = [];
var totalCities = 5;

var population = [];
var fitness = [];

var popSize = 10;
var recordDistance = Infinity;
var bestEver;
var currentBest;


function setup(){
    createCanvas(600, 600);
    var order = [];

    for(var i = 0; i < totalCities; i++){
        var v = createVector(random(width), random(height));
        cities[i] = v;
        order[i] = i;
    }
    //order.shift();
    console.log(order);
    for(var i = 0; i < popSize; i++){
      population[i] = shuffle(order);
    }
    
}


function draw(){
  background(0);

//genetic algorithm
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(255);
  strokeWeight(4);
  noFill();

  beginShape();
  for(var i = 0; i < bestEver.length; i++){
    var n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }

  endShape();

  strokeWeight(1);

  beginShape();
  for(var i = 0; i < currentBest.length; i++){
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();
}


function swap(a, i, j){
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}


function calcDistance(points, order){
  var sum = 0;
  for(var i = 0; i < order.length - 1; i++){
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];

    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }

  /*
  cityAIndex = order[0];
  cityA = points[cityAIndex];
  cityB = points[0];
  sum += dist(cityA.x, cityA.y, cityB.x, cityB.y);

  cityAIndex = order[order.length - 1];
  sum += dist(cityA.x, cityA.y, cityB.x, cityB.y);
  */

  return sum;
}
