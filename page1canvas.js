//"use strict"

function Position(X, Y)
{
    this.x = X;
    this.y = Y;
}

function Node(i, j)
{
    this.x = i;
    this.y = j;
    
    this.f = 0;
    this.g = 0;
    this.h = 0;
    
    this.parent = null;
    this.walkable = true;

    this.draw = function(size)
    {
        context.strokeRect(this.y * size, this.x * size, size, size);
    }
}

function MakeAMap(event){
    
    event.preventDefault();
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof grid != "undefined"){
        delete grid;
    }

    var number = document.getElementById('size').value;
    grid = new Array(number);
    size = canvas.width / number;

    for (var i = 0; i < number; i++){
        grid[i] = new Array(number);
    }
    for (var i = 0; i < number; i++){
        for (var j = 0; j < number; j++){
            grid[i][j] = new Node(i, j);
        }
    }

    for(var i = 0; i < number; i++){
        for(var j = 0; j < number; j++){
            grid[i][j].draw(size);
        }
    }
    return grid;
}

function setAColor_s(){
    color = lightblue;
}
function setAColor_f(){
    color = darkblue;
}
function setAColor_d(){
    color = black;
}

function fillWithColor(x, y, size){
    context.fillRect(x * size, y * size, size, size);
    context.strokeRect(x * size, y * size, size, size);
}

function fill(event){
    if(color != null){
        var x = event.pageX;;
        var y = event.pageY;;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        var posX = Math.floor(x/size);
        var posY = Math.floor(y/size);

        context.fillStyle = color;
        if (color == lightblue){
            start = new Node(posY, posX);
            fillWithColor(posX, posY, size);
        }
        else if (color == darkblue){
            finish = new Node(posY, posX);
            fillWithColor(posX, posY, size);
        }
        else{
            fillWithColor(posX, posY, size);
            grid[posY][posX].walkable = false;
        }
    }
}


function showThePath(path){
    for(var i = 0; i < path.length - 1; i++){
        context.fillStyle = "#66CDAA";
        context.fillRect(path[i].y * size, path[i].x * size, size, size);
        context.strokeRect(path[i].y * size, path[i].x * size, size, size);
    }
}

function path(node){
    var path = [];
    var current = node;
    while(current.parent != null){
        path.push(current);
        current = current.parent;
    }
    path.reverse();
    console.log(path);
    showThePath(path);
}

function heuristic(neigh, fin){
    var x = Math.pow((fin.x - neigh.x),2);
    var y = Math.pow((fin.y - neigh.y),2);
    return x + y;
}

function A_star(){
    var open = [];
    var closed = [];
    var moves_x = [-1, 0, 1, 0]; //up, left, down, right
    var moves_y = [0, -1, 0, 1];
    var current_Node;
    var current_Index;

    open.push(start);

    while(open.length != 0){
        current_Node = open[0];
        current_Index = 0;
        for (var i = 0; i < open.length; i++){
            if(open[i].f < current_Node.f){
                current_Node = open[i];
                current_Index = i;
            }
        }

        open.splice(current_Index, 1);
        closed.push(current_Node);
        console.log(current_Node);

        if ((current_Node.x == finish.x) && (current_Node.y == finish.y)){
            path(current_Node);
        }
    
        var neighbours = [];
        for (var k = 0; k < 4; k++){
            var neighbour_x = current_Node.x + moves_x[k];
            var neighbour_y = current_Node.y + moves_y[k];
    
            if(neighbour_x > size - 1 || neighbour_x < 0 || neighbour_y > size - 1 || neighbour_y < 0){
                continue;
            }
            if(grid[neighbour_x][neighbour_y].walkable == false){
                continue;
            }
            neighbours.push(grid[neighbour_x][neighbour_y]);
        }

        for(var n = 0; n < neighbours.length; n++){
            if(closed.includes(neighbours[n])){
                continue;
            }
            var gScore = current_Node.g + 1;
            var best = false;
    
            if(!open.includes(neighbours[n])){
                best = true;
                open.push(neighbours[n]);
            }
            else if(gScore < neighbours[n].g){
                best = true;
            }

            if(best){
                neighbours[n].parent = current_Node;
                neighbours[n].g = current_Node.g + 1;
                neighbours[n].h = heuristic(neighbours[n], finish);
                neighbours[n].f = neighbours[n].g + neighbours[n].h;
            }
        }
    }
    return false;
}

var canvas = document.getElementById("map"); 
var context = canvas.getContext("2d");
var grid;
var size;
var start;
var finish;
var lightblue = "#96c8eb";
var darkblue = "#67b2e7";
var black = "#4c565f";
var color = null;

grid = document.getElementById('generate').onclick = MakeAMap;

document.getElementById('rectangle to start').addEventListener('click',setAColor_s);
document.getElementById('rectangle to finish').addEventListener('click',setAColor_f);
document.getElementById('rectangle deadEnd').addEventListener('click',setAColor_d);

document.getElementById('map').addEventListener('click',fill);

document.getElementById('algoritm').addEventListener('click',A_star);

