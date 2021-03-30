function calculateFitness(){

    for(var i = 0; i < population.length; i++){
        var d = calcDistance(cities, population[i]);
        if(d < recordDistance){ 
          recordDistance = d;
          bestEver = population[i];
        }
    
        fitness[i] = 1 / (d + 1);
      }
}

function normalizeFitness(){
    var sum = 0;
    for(var i = 0; i < fitness.length; i++){
        sum += fitness[i];
    }
    for(var i = 0; i < fitness.length; i++){
        fitness[i] /= sum;
    }
}

function nextGeneration(){
    var newPopulation = [];
    for(var i = 0; i < population.length; i++){
        var orderA = pickOne(population, fitness);
        var orderB = pickOne(population, fitness);
        var order = crossOver(orderA, orderB);
        mutate(order);
        newPopulation[i] = order;
    }
    population = newPopulation;
}

function pickOne(list, prob){
    var index = 0;
    var r = random(1);

    while(r > 0){
        r -= prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

function crossOver(orderA, orderB){
    var start = floor(random(orderA.length));
    var end = floor(random(start + 1, orderA.length));
    var neworder = orderA.slice(start, end);

    for(var i = 0; i < orderB.length; i++){
        var city = orderB[i];
        if(!neworder.includes(city)){
            neworder.push(city);
        }
    }
    return neworder;
}


function mutate(order){
    var indexA = floor(random(order.length));
    var indexB = floor(random(order.length));
    swap(order, indexA, indexB); 
}
