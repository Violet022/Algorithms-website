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

    order.shift();

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

  vertex(cities[0].x, cities[0].y);
  line(cities[0].x, cities[0].y, cities[bestEver[0]].x, cities[bestEver[0]].y);
  ellipse(cities[0].x, cities[0].y, 16, 16);
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

  sum += dist(points[0].x, points[0].y, points[order[0]].x, points[order[0]].y);
  sum += dist(points[0].x, points[0].y, points[order[order.length - 1]].x, points[order[order.length - 1]].y);

  return sum;
}
