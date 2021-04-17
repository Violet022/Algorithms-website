                                                // Ячейка массива grid, содержащая информацию о ней
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
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.y * size, this.x * size, size, size);
        context.strokeRect(this.y * size, this.x * size, size, size);
        grid[this.x][this.y].walkable = true;
    }
}

                                                // Генерирование поля для лабиринта, "дубликация" в виде массива grid
function MakeAMap(event){ 
    
    event.preventDefault();
    context.fillStyle = "#4c565f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    if (typeof grid != "undefined"){
        grid.length = 0;
    }
    if(typeof start != "undefined"){
        start = undefined;
    }
    if(typeof finish != "undefined"){
        finish = undefined;
    }

    number = document.getElementById('size').value;
    size = canvas.width / number;
    grid = new Array(number);

    for (let i = 0; i < number; i++){
        grid[i] = new Array(number);
    }
    for (let i = 0; i < number; i++){
        for (let j = 0; j < number; j++){
            grid[i][j] = new Node(i, j);
        }
    }
    for(let i = 0; i < number; i++){
        for(let j = 0; j < number; j++){
            grid[i][j].draw(size);
        }
    }
    
    MakeALab();
}

                                                // Генерирование лабиринта
function GetRandom(min, max){ 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Up(){ 
    for(let j = 0; j < number; j++){ 
        if(grid[1][j].walkable == true && grid[2][j].walkable == true){
            grid[0][j].clear();
        }
    }
}
function Right(){ 
    for(let i = 0; i < number; i++){
        if(grid[i][number - 2].walkable == true && grid[i][number - 3].walkable == true){
            grid[i][number - 1].clear();
        }
    } 
}
function Down(){ 
    for(let j = 0; j < number; j++){ 
        if(grid[number - 2][j].walkable == true && grid[number - 3][j].walkable == true){
            grid[number - 1][j].clear();
        }
    }  
}
function Left(){ 
    for(let i = 0; i < number; i++){
        if(grid[i][1].walkable == true && grid[i][2].walkable == true){
            grid[i][0].clear();
        }
    }  
}
function Sides(whichSides){
    for(let k = 0; k < whichSides.length; k++){
        switch(whichSides[k]){
            case "Up" :
                Up();
                break;
            case "Right" :
                Right();
                break;
            case "Down":
                Down();
                break;
            case "Left":
                Left();
                break;
        }
    }
}

function MakeALab(){ 
    let x = GetRandom(0, number - 1);
    let y = GetRandom(0, number - 1);
    let first_x = x;
    let first_y = y;
    let possible_x;
    let possible_y;
    let nodesToCheck = [];
    let ways_x = [0, 0, -2, 2];
    let ways_y = [-2, 2, 0, 0];
    grid[x][y].clear();

    for(let k = 0; k < 4; k++){
        possible_x = x + ways_x[k];
        possible_y = y + ways_y[k];
        if(possible_x >= 0 && possible_x < number && possible_y >= 0 && possible_y < number){
            nodesToCheck.push(grid[possible_x][possible_y]);
        }
    }

    while(nodesToCheck.length > 0){
        let index = GetRandom(0, nodesToCheck.length - 1);
        let dir_index;
        let current = nodesToCheck[index];
        let directions = ["Up", "Down", "Right", "Left"];
        x = current.x;
        y = current.y; 
        current.clear();
        nodesToCheck.splice(index, 1);

        while(directions.length > 0){
            dir_index = GetRandom(0, directions.length - 1);
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
    
    // углы
    if(number % 2 == 0){
        if(first_x % 2 == 0){
            first_y % 2 == 0 ? Sides(["Right", "Down"]) : Sides(["Left", "Down"]);
        }
        else{
            first_y % 2 == 0 ? Sides(["Right", "Up"]) : Sides(["Left", "Up"]);
        }
    }
    else{
        if(first_x % 2 != 0){
            first_y % 2 == 0 ? Sides(["Up", "Down"]) : Sides(["Up", "Down", "Left", "Right"]);
        }
        else{
            Sides(["Left", "Right"]);
        }
    }   
}

                                                // Настройка лабиринта пользователем

function FillWithColor(x, y, size){ 
    context.fillRect(x * size, y * size, size, size);
    context.strokeRect(x * size, y * size, size, size);
}

function Place_X(coor){ 
    coor -= canvas.offsetLeft;
    coor = Math.floor(coor/size);
    return coor;
}
function Place_Y(coor){ 
    coor -= canvas.offsetTop;
    coor = Math.floor(coor/size);
    return coor;
}

function Change(cell, colour, pos_x, pos_y){ 
    let x_prev = cell.x;
    let y_prev = cell.y;
    let new_cell;
    grid[x_prev][y_prev].clear();
    new_cell = grid[pos_y][pos_x];
    context.fillStyle = colour;
    FillWithColor(pos_x, pos_y, size);
    return new_cell;
}

function Fill(event){ // при клике мыши
    if(color != null){
        let posX = Place_X(event.pageX);
        let posY = Place_Y(event.pageY);
        context.fillStyle = color;

        if (color == lightblue){
            if(grid[posY][posX].walkable == true){
                if(typeof start != "undefined"){
                    start = Change(start, color, posX, posY);
                }
                else{
                    start = grid[posY][posX];
                    FillWithColor(posX, posY, size);
                }
            } 
        }
        else if (color == darkblue){
            if(grid[posY][posX].walkable == true){
                if(typeof finish != "undefined"){
                    finish = Change(finish, color, posX, posY);
                }
                else{
                    finish = grid[posY][posX];
                    FillWithColor(posX, posY, size);
                }
            }
        }
        else if (color == black){
            FillWithColor(posX, posY, size);
            grid[posY][posX].walkable = false;
        }
        else{
            grid[posY][posX].clear();
        }
    }
}

function Wall(event){ // при ведении зажатой кнопки мыши
    if(isMouseDown && (color == black || color == white)){
        let posX = Place_X(event.pageX);
        let posY = Place_Y(event.pageY);
        context.fillStyle = color;
        FillWithColor(posX, posY, size);
        if(color == black){
            grid[posY][posX].walkable = false;
        }
        else{
            grid[posY][posX].walkable = true;
        }
    }
}

                                                // Алгоритм А*
function ShowThePath(way){ 
    let i = 0;
    function FillColour(way){
        context.fillStyle = "#4dbeff"; 
        context.fillRect(way[i].y * size, way[i].x * size, size, size);
        context.strokeRect(way[i].y * size, way[i].x * size, size, size);
        i++;
        if(i == way.length - 1){
            clearInterval(timeId);
        }
    }
    let timeId = setInterval(FillColour, 50, way)
}
function Path(node){ 
    let way = [];
    let current = node;
    while(current.parent != null){
        way.push(current);
        current = current.parent;
    }
    way.reverse();
    ShowThePath(way);
}

function Heuristic(neigh, fin){ 
    let x = Math.abs(fin.x - neigh.x);
    let y = Math.abs(fin.y - neigh.y);
    return (x + y) * 10;
}

async function A_star(){
    let opened = [];
    let closed = [];
    let moves_x = [-1, 0, 1, 0];
    let moves_y = [0, -1, 0, 1];
    let current_Node;
    let current_Index;
    let neighbour_x;
    let neighbour_y;
    let neighbour;
    let isPathExist = false;
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

        if (current_Node.x == finish.x && current_Node.y == finish.y){
            Path(current_Node);
            isPathExist = true;
            break;
        }

        if(current_Node != start){
            context.fillStyle = "#8d3f88"; 
            FillWithColor(current_Node.y, current_Node.x, size);
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
                neighbour.h = Heuristic(neighbour, finish);
                neighbour.f = neighbour.g + neighbour.h;
                opened.push(neighbour);

                if(current_Node.x != finish.x && current_Node.y != finish.y){
                    context.fillStyle = "#d095cc"; 
                    FillWithColor(neighbour_y, neighbour_x, size);
                }
            }
            else if (opened.includes(neighbour) && current_Node.g + 1 < neighbour.g){
                neighbour.parent = current_Node;
                neighbour.g = current_Node.g + 1;
                neighbour.f = neighbour.g + neighbour.h;
            }
        }
        if(isPathExist == false){
            await delay(300);
        }
    }
    if(isPathExist == false){
        alert("Пути не существует");
    }
}
function delay(timeout) { 
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

function ChangeRectBorder(new_rectangle){
    if(typeof old_rectangle != 'undefined'){
        old_rectangle.style.border = '2px solid black';
        new_rectangle.style.border = '3px solid black';
        old_rectangle = new_rectangle;
    }
    else{
        old_rectangle = new_rectangle;
        old_rectangle.style.border = '3px solid black';
    }
}

let canvas = document.getElementById("map"); 
let context = canvas.getContext("2d");
let grid;
let size;
let number;
let start;
let finish;

let lightblue = "#99daff"; //"#92ddea";
let darkblue = "#0081cc";
let black = "#4c565f";
let white = "#FFFFFF";

let start_rectangle;
let finish_rectangle;
let addDeadEnd_rectangle;
let removeDeadEnd_rectangle;
let old_rectangle;

let color = null;
let isMouseDown;
let isPathExist = false;


grid = document.getElementById('generate').onclick = MakeAMap;

document.getElementById('rectangle to start').addEventListener('click',function(event){
    color = lightblue;
    start_rectangle = event.target;
    ChangeRectBorder(start_rectangle);
});
document.getElementById('rectangle to finish').addEventListener('click',function(event){
    color = darkblue;
    finish_rectangle = event.target;
    ChangeRectBorder(finish_rectangle);
});
document.getElementById('rectangle to AdddeadEnd').addEventListener('click',function(event){
    color = black;
    addDeadEnd_rectangle = event.target;
    ChangeRectBorder(addDeadEnd_rectangle);
});
document.getElementById('rectangle to RemoveeadEnd').addEventListener('click',function(event){
    color = white;
    removeDeadEnd_rectangle = event.target;
    ChangeRectBorder(removeDeadEnd_rectangle);
});

document.getElementById('map').addEventListener('click',Fill);

document.getElementById('map').addEventListener('mousedown',function(){
    isMouseDown = true;
});
document.getElementById('map').addEventListener('mouseup',function(){
    isMouseDown = false;
});
document.getElementById('map').addEventListener('mousemove',Wall);

document.getElementById('algoritm').addEventListener('click',A_star);




