function Dot(X,Y){
    this.x = X;
    this.y = Y;
    this.group = undefined;
}

function Group(coor1, coor2){
    this.center_dot = new Dot(coor1, coor2);
    this.dots_included = [];
}

function drawAPoint(event){
    if(abilityToMakePoints == true){
        var x, y;
        var current_dot;
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
        console.log(dots);
    }
}

function getRandom(min, max){
    return Math.random() * (max - min) + min;
}

function MoveCenters(){
    var finished = false;
    for(var i = 0; i < clusters.length; i++){
        finished = true;
        if(clusters[i].dots_included.length == 0){
            return;
        }
        
        var new_x = 0;
        var new_y = 0;
        for(var k = 0; k < clusters[i].dots_included.length; k++){
            new_x += clusters[i].dots_included[k].x;
            new_y += clusters[i].dots_included[k].y;
        }

        var old_center;
        old_center = new Dot(clusters[i].center_dot.x, clusters[i].center_dot.y);

        new_x = new_x / clusters[i].dots_included.length;
        new_y = new_y / clusters[i].dots_included.length;

        clusters[i].center_dot.x = new_x;
        clusters[i].center_dot.y = new_y;

        if(old_center.x !== new_x || old_center.y !== new_y){
            finished = false;
        }
    }
    if(finished){
        console.log(clusters);
    }
    else{
        for(var j = 0; j < clusters.length; j++){
            clusters[j].dots_included.length = 0;
        }
    }

}

function UpdateGroups(){
    for(var d in dots){
        var min = Infinity;
        var dist;
        var groupOfDot;
        for(var c in clusters){
            dist = Math.pow(clusters[c].center_dot.x - dots[d].x, 2) + Math.pow(clusters[c].center_dot.y - dots[d].y, 2);
            if(dist < min){
                min = dist;
                groupOfDot = c;
            }
        }
        dots[d].group = groupOfDot;
        clusters[groupOfDot].dots_included.push(dots[d]);
    }
}

function K_means_algoritm(){
    var clusterNumber;
    var flag;
    clusterNumber = document.getElementById('number').value;
    flag = false;
    for(var i = 0; i < clusterNumber; i++){
        var c_x;
        var c_y;
        c_x = getRandom(0,canvas.width);
        c_y = getRandom(0,canvas.height);
        clusters[i] = new Group(c_x, c_y);
        console.log(clusters);
    }
    for(var i = 0; i < 3; i++){
        if(flag){
            MoveCenters();
        }
        else{
            UpdateGroups();
        }
        flag = !flag;
        console.log(dots);
    }
    
    /*while(true){
        if(flag){
            MoveCenters();
        }
        else{
            UpdateGroups();
        }
        flag = !flag;
        console.log(dots);
    }*/

}

var canvas = document.getElementById("field"); 
var context = canvas.getContext("2d");
var abilityToMakePoints = false;
var dots = [];
var clusters = [];

document.getElementById('points').addEventListener('click',function(){
    abilityToMakePoints = true;
})
document.getElementById('clear').addEventListener('click', function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(typeof dots != undefined){
        dots.length = 0;
    }
})
document.getElementById('field').addEventListener('click', drawAPoint);
document.getElementById('start').addEventListener('click', K_means_algoritm);