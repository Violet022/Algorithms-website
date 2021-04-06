                                                // Ячейка массива grid
function Node(i, j)
{
    this.x = i;
    this.y = j;
    
    this.f = 0;
    this.g = 0;
    this.h = 0;
    
    this.parent = null;
    this.walkable = false;

    this.draw = function(size)
    {
        context.strokeRect(this.y * size, this.x * size, size, size);
    }

    this.clear = function(){
        context.fillStyle = "#FFFFFF"; // белый
        context.fillRect(this.y * size, this.x * size, size, size);
        context.strokeRect(this.y * size, this.x * size, size, size);
        grid[this.x][this.y].walkable = true;
    }
}

                                                // Сгенерировать карту-либиринт
function MakeAMap(event){
    
    event.preventDefault();
    context.fillStyle = "#4c565f"; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (typeof grid != "undefined"){
        delete grid;
    }

    number = document.getElementById('size').value;
    size = canvas.width / number;
    grid = new Array(number);

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
    
    MakeALab();
}

                                                // Генерирование лабиринта
function getRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function MakeALab(){
    var x = getRandom(0, number - 1);
    var y = getRandom(0, number - 1);
    var possible_x;
    var possible_y;
    var nodesToCheck = [];
    var ways_x = [0, 0, -2, 2];
    var ways_y = [-2, 2, 0, 0];
    grid[x][y].clear();

    for(let k = 0; k < 4; k++){
        possible_x = x + ways_x[k];
        possible_y = y + ways_y[k];
        if(possible_x >= 0 && possible_x < number && possible_y >= 0 && possible_y < number){
            nodesToCheck.push(grid[possible_x][possible_y]);
        }
    }

    while(nodesToCheck.length > 0){
        var index = getRandom(0, nodesToCheck.length - 1);
        var dir_index;
        var current = nodesToCheck[index];
        var directions = ["Up", "Down", "Right", "Left"];
        x = current.x;
        y = current.y; 
        current.clear();
        nodesToCheck.splice(index, 1);

        while(directions.length > 0){
            dir_index = getRandom(0, directions.length - 1);
            switch (directions[dir_index]){
                case "Up":
                    if(x - 2 >= 0 && grid[x - 2][y].walkable == true){
                        grid[x - 1][y].clear();
                        directions.splice(0,directions.length);
                    }
                    break;
                case "Down":
                    if(x + 2 < number && grid[x + 2][y].walkable == true){
                        grid[x + 1][y].clear();
                        directions.splice(0,directions.length);
                    }
                    break;
                case "Right":
                    if(y + 2 < number && grid[x][y + 2].walkable == true){
                        grid[x][y + 1].clear();
                        directions.splice(0,directions.length);
                    }
                    break;
                case "Left":
                    if(y - 2 >= 0 && grid[x][y - 2].walkable == true){
                        grid[x][y - 1].clear();
                        directions.splice(0,directions.length);
                    }
                    break;
            }
            directions.splice(dir_index, 1);
        }

        for(let k = 0; k < 4; k++){
            possible_x = x + ways_x[k];
            possible_y = y + ways_y[k];
            if(possible_x >= 0 && possible_x < number && possible_y >= 0 && possible_y < number){
                if(grid[possible_x][possible_y].walkable == false && !nodesToCheck.includes(grid[possible_x][possible_y])){
                    nodesToCheck.push(grid[possible_x][possible_y]);
                }
            }
        }
    }
}

                                                // Настройка лабиринта пользователем
function setAColor_s(){
    color = lightblue;
}
function setAColor_f(){
    color = darkblue;
}
function setAColor_d(){
    color = black;
}
function setAColor_с(){
    color = white;
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

function change(cell, colour, pos_x, pos_y){
    var x_prev = cell.x;
    var y_prev = cell.y;
    var new_cell;
    grid[x_prev][y_prev].clear();
    new_cell = grid[pos_y][pos_x];
    context.fillStyle = colour;
    fillWithColor(pos_x, pos_y, size);
    return new_cell;
}

function fill(event){
    if(color != null){
        var posX = place_X(event.pageX);
        var posY = place_Y(event.pageY);
        context.fillStyle = color;

        if (color == lightblue){
            if(grid[posY][posX].walkable == true){
                if(typeof start != "undefined"){
                    start = change(start, color, posX, posY);
                }
                else{
                    start = grid[posY][posX];
                    fillWithColor(posX, posY, size);
                }
            } 
        }
        else if (color == darkblue){
            if(grid[posY][posX].walkable == true){
                if(typeof finish != "undefined"){
                    finish = change(finish, color, posX, posY);
                }
                else{
                    finish = grid[posY][posX];
                    fillWithColor(posX, posY, size);
                }
            }
        }
        else if (color == black){
            fillWithColor(posX, posY, size);
            grid[posY][posX].walkable = false;
        }
        else{
            grid[posY][posX].clear();
        }
    }
}

function wall(event){
    if(isMouseDown && (color == black || color == white)){
        var posX = place_X(event.pageX);
        var posY = place_Y(event.pageY);
        context.fillStyle = color;
        fillWithColor(posX, posY, size);
        if(color == black){
            grid[posY][posX].walkable = false;
        }
        else{
            grid[posY][posX].walkable = true;
        }
    }
}

                                                // Алгоритм А*
function showThePath(way){
    var i = 0;
    function fillColour(way){
        context.fillStyle = "#7B68EE";
        context.fillRect(way[i].y * size, way[i].x * size, size, size);
        context.strokeRect(way[i].y * size, way[i].x * size, size, size);
        i++;
        if(i == way.length - 1){
            clearInterval(timeId);
        }
    }
    let timeId = setInterval(fillColour, 50, way)
}
function path(node){
    var way = [];
    var current = node;
    while(current.parent != null){
        way.push(current);
        current = current.parent;
    }
    way.reverse();
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

        if(current_Node != start){
            context.fillStyle = "#7a3776";
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
                
                context.fillStyle = "#cab3e6";
                fillWithColor(neighbour_y, neighbour_x, size);
            }
            else if (opened.includes(neighbour) && current_Node.g + 1 < neighbour.g){
                neighbour.parent = current_Node;
                neighbour.g = current_Node.g + 1;
                neighbour.f = neighbour.g + neighbour.h;
            }
        }
        if(isPathExist == false){
            await delay(500);
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
var lightblue = "#b8e3ea";
var darkblue = "#a9bcc6";
var black = "#4c565f";
var white = "#FFFFFF";
var color = null;
var isMouseDown;
var isPathExist = false;

grid = document.getElementById('generate').onclick = MakeAMap;

document.getElementById('rectangle to start').addEventListener('click',setAColor_s);
document.getElementById('rectangle to finish').addEventListener('click',setAColor_f);
document.getElementById('rectangle to AdddeadEnd').addEventListener('click',setAColor_d);
document.getElementById('rectangle to RemoveeadEnd').addEventListener('click',setAColor_с);

document.getElementById('map').addEventListener('click',fill);

document.getElementById('map').addEventListener('mousedown',function(){
    isMouseDown = true;
});
document.getElementById('map').addEventListener('mouseup',function(){
    isMouseDown = false;
});
document.getElementById('map').addEventListener('mousemove',wall);

document.getElementById('algoritm').addEventListener('click',A_star);



