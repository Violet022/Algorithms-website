function Dot(X,Y){ 
    this.x = X;
    this.y = Y;
}
function Cluster(coor1, coor2){
    this.center_dot = new Dot(coor1, coor2);
    this.dots_included = [];
    this.common_dist = Infinity;
}

function DrawAPoint(event){
    if(abilityToMakePoints == true){
        let x, y;
        let current_dot;
        
        x = event.pageX;
        x -= canvas.offsetLeft;
        y = event.pageY;
        y -= canvas.offsetTop;
        current_dot = new Dot(x, y);
        
        dots.push(current_dot);
        
        context.beginPath();
        context.fillStyle = "#000000";
        context.arc(x, y, 7, 0, Math.PI*2);
        context.fill();
    }
}

function MoveCenters(){
    let finished;
    let numberOfDotsInClust;
    let clusters_dist = 0;
    finished = false;
    for(let i = 0; i < clusters.length; i++){
        finished = true;
        numberOfDotsInClust = clusters[i].dots_included.length;

        if(numberOfDotsInClust == 0){
            clusters[0].common_dist = Infinity;
            return finished;
        }
        
        let new_x = 0;
        let new_y = 0;
        let old_center = clusters[i].center_dot;
        for(let k = 0; k < numberOfDotsInClust; k++){
            new_x += clusters[i].dots_included[k].x;
            new_y += clusters[i].dots_included[k].y;
        }
        new_x = new_x / numberOfDotsInClust;
        new_y = new_y / numberOfDotsInClust;
        clusters[i].center_dot.x = new_x;
        clusters[i].center_dot.y = new_y;

        if(old_center.x !== new_x || old_center.y !== new_y){
            finished = false;
        }
    }
    
    for(let clust = 0; clust < clusters.length; clust++){
        let current_cluster = clusters[clust];
        for(let gr = 0; gr < current_cluster.dots_included.length; gr++){
            let curr_dot = current_cluster.dots_included[gr];
            clusters_dist += Math.pow(current_cluster.center_dot.x - curr_dot.x, 2) + Math.pow(current_cluster.center_dot.y - curr_dot.y, 2);
        }
    }
    clusters[0].common_dist = clusters_dist;
    
    if(!finished){
        for(let j = 0; j < clusters.length; j++){
            clusters[j].dots_included.length = 0;
        }
    }
    return finished;
}
function UpdateClusters(){
    let min, dist, groupOfDot;
    for(let d in dots){
        min = Infinity;
        for(let c in clusters){
            dist = Math.pow(clusters[c].center_dot.x - dots[d].x, 2) + Math.pow(clusters[c].center_dot.y - dots[d].y, 2);
            if(dist < min){
                min = dist;
                groupOfDot = c;
            }
        }
        clusters[groupOfDot].dots_included.push(dots[d]);
    }
}

function ShowClusters(mas){
    let colors = [];
    let cnt = 0;
    while(colors.length != clusters.length){
        let r = Math.floor(Math.random() * (256));
        let g = Math.floor(Math.random() * (256));
        let b = Math.floor(Math.random() * (256));
        let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
        if(!colors.includes(color) && color.length == 7){
            colors[cnt] = color;
            cnt++;
        }
    }
    for(let i = 0; i < mas.length; i++){
        for(let j = 0; j < mas[i].length; j++){
            context.beginPath();
            context.fillStyle = colors[i];
            context.arc(mas[i][j].x, mas[i][j].y, 7, 0, Math.PI*2);
            context.fill();
            context.stroke();
        }
    }
}

function GetRandomInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function K_means_algoritm(){ 
    let clusterNumber;
    let flag;
    let shouldStop;
    let bestCluster = [];
    let W;
    let centers = [];
    let spot;
    clusterNumber = document.getElementById('number').value;
    W = Infinity;

    for(let count = 0; count < 100; count++){
        flag = false;
        shouldStop = false;
        centers.length = 0;

        while(centers.length != clusterNumber){
            let number = GetRandomInt(0, dots.length);
            if(!centers.includes(number)){
                centers.push(number);
            }
        }
        for(let i = 0; i < clusterNumber; i++){
            spot = dots[centers[i]];
            clusters[i] = new Cluster(spot.x, spot.y);
        }
    
        while(true){
            if(flag){
                shouldStop = MoveCenters();
            }
            else{
                UpdateClusters();
            }
        
            flag = !flag;
            if(shouldStop){
                if(clusters[0].common_dist < W){
                    W = clusters[0].common_dist;
                    for(let i = 0; i < clusterNumber; i++){
                        bestCluster[i] = clusters[i].dots_included;
                    }
                }
                break;
            }
        }
    }
    ShowClusters(bestCluster);  
}

let canvas = document.getElementById("field"); 
let context = canvas.getContext("2d");
let abilityToMakePoints = false;
let dots = [];
let clusters = [];

document.getElementById('points').addEventListener('click',function(){
    abilityToMakePoints = true;
})
document.getElementById('clear').addEventListener('click', function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    abilityToMakePoints = false;
    dots.length = 0;
    if(typeof clusters != undefined){
        clusters.length = 0;
    }
})
document.getElementById('field').addEventListener('click', DrawAPoint);
document.getElementById('start').addEventListener('click', K_means_algoritm);