//"use strict"
                                        // Класс Node для каждой из ячеек поля
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
                                        // Рисование карты
function MakeAMap(event){
    
    event.preventDefault();
    context.clearRect(0, 0, canvas.width, canvas.height);
    /*if (typeof way != "undefined"){
        way.length = 0;
    }
    if (typeof grid != "undefined"){
        grid.length = 0;
    }
    if(typeof opened != "undefined"){
        opened.length = 0;
    }
    if(typeof closed != "undefined"){
        closed.length = 0;
    }*/
    if (typeof grid != "undefined"){
        delete grid;
    }
    if (typeof way != "undefined"){
        delete way;
    }

    number = document.getElementById('size').value;
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
                                        // Функции для взаимодействия с полем при расстановке клеток
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

function place_X(coor){
    coor -= canvas.offsetLeft;
    coor = Math.floor(coor/size);
    return coor;
}
function place_Y(coor){
    coor -= canvas.offsetTop;
    coor = Math.floor(coor/size);
    return coor;
}

function fill(event){
    if(color != null){
        var posX = place_X(event.pageX);
        var posY = place_Y(event.pageY);
        context.fillStyle = color;

        if (color == lightblue){
            start = grid[posY][posX];
            fillWithColor(posX, posY, size);
        }
        else if (color == darkblue){
            finish = grid[posY][posX];
            fillWithColor(posX, posY, size);
        }
        else{
            fillWithColor(posX, posY, size);
            grid[posY][posX].walkable = false;
        }
    }
}

function wall(event){
    if(isMouseDown && color == black){
        var posX = place_X(event.pageX);
        var posY = place_Y(event.pageY);
        context.fillStyle = color;
        fillWithColor(posX, posY, size);
        grid[posY][posX].walkable = false;
    }
}

                                        // Алгоритм А*
// отображение пути на поле
function showThePath(way){
    for(let i = 0; i < way.length - 1; i++){
        context.fillStyle = "#ffa5d8"; //#7B68EE
        context.fillRect(way[i].y * size, way[i].x * size, size, size);
        context.strokeRect(way[i].y * size, way[i].x * size, size, size);
    }
}
function path(node){
    var way = [];
    var current = node;
    while(current.parent != null){
        way.push(current);
        current = current.parent;
    }
    way.reverse();
    console.log(way);
    showThePath(way);
}

function heuristic(neigh, fin){
    var x = Math.abs(fin.x - neigh.x);
    var y = Math.abs(fin.y - neigh.y);
    return (x + y) * 10;
}

async function A_star(){
    var opened = [];
    var closed = [];
    var moves_x = [-1, 0, 1, 0];
    var moves_y = [0, -1, 0, 1];
    var current_Node;
    var current_Index;
    var neighbour_x;
    var neighbour_y;
    var neighbour;
    var isPathExist = false;
    color = null;

    opened.push(start);

    while (opened.length > 0){
        
        current_Node = opened[0];
        current_Index = 0;
        for (let i = 0; i < opened.length; i++){
            if(opened[i].f < current_Node.f){
                current_Node = opened[i];
                current_Index = i;
            }
        }

        opened.splice(current_Index, 1);
        closed.push(current_Node);

        //ДОБАВЛЕНИЕ!!!!!!!!!!!!!
        if(current_Node != start){
            context.fillStyle = "#9579d1"; //#7a3776
            fillWithColor(current_Node.y, current_Node.x, size);
        }

        if (current_Node.x == finish.x && current_Node.y == finish.y){
            path(current_Node);
            isPathExist = true;
            break;
        }
        
        // соседи
        for (let k = 0; k < 4; k++){
            neighbour_x = current_Node.x + moves_x[k];
            neighbour_y = current_Node.y + moves_y[k];
            //проверка корректности соседа
            if(neighbour_x > number - 1 || neighbour_x < 0 || neighbour_y > number - 1 || neighbour_y < 0 || grid[neighbour_x][neighbour_y].walkable == false){
                continue;
            }
            else{
                neighbour = grid[neighbour_x][neighbour_y]; 
            }

            //проверка соседа по спискам
            if(closed.includes(neighbour)){
                continue;
            }
            if (!opened.includes(neighbour)){
                neighbour.parent = current_Node;
                neighbour.g = current_Node.g + 1;
                neighbour.h = heuristic(neighbour, finish);
                neighbour.f = neighbour.g + neighbour.h;
                opened.push(neighbour);
                
                context.fillStyle = "#be9ddf"; //#cab3e6
                fillWithColor(neighbour_y, neighbour_x, size);
            }
            else if (opened.includes(neighbour) && current_Node.g + 1 < neighbour.g){
                neighbour.parent = current_Node;
                neighbour.g = current_Node.g + 1;
                neighbour.f = neighbour.g + neighbour.h;
            }
        }
        if(isPathExist == false){
            await delay(600);
        }
    }
    if(isPathExist == false){
        alert("Пути не существует");
    }
}
function delay(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}


var canvas = document.getElementById("map"); 
var context = canvas.getContext("2d");
var grid;
var size;
var number;
var start;
var finish;
var lightblue = "#92ddea";
var darkblue = "#7eb8da";
var black = "#4c565f";
var color = null;
var isMouseDown;
var isPathExist = false;

grid = document.getElementById('generate').onclick = MakeAMap;

document.getElementById('rectangle to start').addEventListener('click',setAColor_s);
document.getElementById('rectangle to finish').addEventListener('click',setAColor_f);
document.getElementById('rectangle deadEnd').addEventListener('click',setAColor_d);

document.getElementById('map').addEventListener('click',fill);

document.getElementById('map').addEventListener('mousedown',function(){
    isMouseDown = true;
});
document.getElementById('map').addEventListener('mouseup',function(){
    isMouseDown = false;
});
document.getElementById('map').addEventListener('mousemove',wall);

document.getElementById('algoritm').addEventListener('click',A_star);


