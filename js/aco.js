function probability(i, j){

    if(i == j || visited[j] == 1){
        return 0;
    }
    
    let sum = 0;
    
    for(let k = 0; k < totalCities; k++){
        
        if (visited[k] != 1 && k != i){
            
            sum += pow(1/distances[i][k], beta) * pow(pheromones[i][k], alpha);
            
        }
    }
    
    let p = pow(1/distances[i][j], beta) * pow(pheromones[i][j], alpha) / sum;
    
    return p;
  }
  
  function whereToGo(i){  
    let r = random();
    let sum = 0;
    for(let k = 0; k < totalCities; k++){
        sum += probability(i, k);
        
        if(sum >= r){
            
            visited[k] = 1;
            
            return k;
        }
    }
  }
  
  function changePheromones(points, order){
    
    let length = calcDistance(points, order);
    
    
    for(let i = 0; i < totalCities - 1; i++){
        pheromones[order[i]][order[i + 1]] += Q / length;
        pheromones[order[i + 1]][order[i]] += Q / length;
  
        changedPheromones[order[i]][order[i + 1]] = 1;
        changedPheromones[order[i + 1]][order[i]] = 1;
        
    }
    
  
    for(let i = 0; i < totalCities; i++){
        for(let j = 0; j < totalCities; j++){
            if(changedPheromones[i][j] != 1){
                pheromones[i][j] *= reductionCoefficient;
            }
        }
    }
  }
  
  function oneAnt(begin){
  
    let order = [];
    order.push(begin);
    visited[begin] = 1;

    let from = begin;
    let to;
    
    while(order.length < totalCities){
  
        to = whereToGo(from);
        order.push(to);
        from = to;
  
    }
  
    order.push(begin);
    
    if(calcDistance(cities, order) < calcDistance(cities, bestEver)){
      bestEver = order;
    }

    changePheromones(cities, order);
    nullVisited();
    nullChangedPheromones();
  }
  
  function nullVisited(){
    for(let i = 0; i < totalCities; i++){
        visited[i] = 0;
    }
  }
  
  function nullChangedPheromones(){
    for(let i = 0; i < totalCities; i++){
        for(let j = 0; j < totalCities; j++){
            changedPheromones[i][j] = 0;
        }
    }
  }