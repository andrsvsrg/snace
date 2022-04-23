
 ////////////////////////////////////////// создание поля
const field = document.createElement('div');
document.body.prepend(field);
field.classList.add('field');

for (let i = 1; i < 101; i++) {
    const exele = document.createElement('div');
    field.append(exele);
    exele.classList.add('exele');
    //exele.innerHTML += `${i}`;
}

const exeleArr = document.querySelectorAll('.exele');
let x = 1,
    y = 10;

exeleArr.forEach(function(item, index) {
    if (x > 10) {
        x = 1;
        y--;
    }
    item.setAttribute('posX', x);
    item.setAttribute('posY', y);
    x++;
});

//---------------------  
function generateStartSnake() {   // генерирование случайной позиции для головы снека 
    let posX = Math.round(Math.random() * (10 - 3) + 3);
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY];
}

const coordinates = generateStartSnake(); // стартовые координаты головы снека в виде [x,y]



let snakeBody = [document.querySelector(`[posX = "${coordinates[0]}"][posY = "${coordinates[1]}"]`),   // snakeBody внутри лежат дивы змейки сначала голова а дальше тело
document.querySelector(`[posX = "${coordinates[0] - 1}"][posY = "${coordinates[1]}"]`), 
document.querySelector(`[posX = "${coordinates[0] - 2}"][posY = "${coordinates[1]}"]`)];




  

snakeBody.forEach(function(item) {    /// отрисовка изначальной змейки
    item.classList.add('bodySnake');
});
snakeBody[0].classList.add('headSnake');


//----------------------
    

function getDivFromPos([posX,posY]) {   // получение дива по координатам [x,y]
    return document.querySelector(`[posX = "${posX}"][posY = "${posY}"]`);
}
function getPosFromDiv(div) {  // получание координат с дива [x,y]
   return [Number(div.getAttribute('posX')), Number(div.getAttribute('posY'))];
}


function createMouse() {
    function generateMouse() {   // создание уникальных координат через рекурсию
        let posX = Math.round(Math.random() * (10 - 1) + 1);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
         
        let result = snakeBody.every((div) => {
            let strPos = getPosFromDiv(div).join(",");
            let newMouse = posX+","+posY;
            return strPos !== newMouse;
        });
        if(result) {
            return [posX, posY]; 
        } else {
            return generateMouse();
        }    
    }

    let mouse = getDivFromPos(generateMouse());   // получание дива мыши с рандомными координатами.
    mouse.classList.add('mouse'); // отрисовка мыши

}

let direction = "Right";

window.addEventListener("keydown", function(event) {    // смена направления движения змейки
    if(direction == "Right" || direction == "Left") {
        if(event.code == "ArrowUp" || event.code == "KeyW") {
            direction = "Up";
        } else if(event.code == "ArrowDown" || event.code == "KeyS") {
            direction = "Down";
        }
    }
    if(direction == "Down" || direction == "Up") {
        if(event.code == "ArrowLeft" || event.code == "KeyA") {
            direction = "Left";
        } else if(event.code == "ArrowRight" || event.code == "KeyD") {
            direction = "Right";
        }
    }
});
function generateNextHeadPos() {  // генерация следующей позиции для головы змеи в зависимости от направления
    let head = [Number(snakeBody[0].getAttribute('posX')), Number(snakeBody[0].getAttribute('posY'))];// просто массив с координатами головы [x,y] взятый с массива змейки
    if(direction == "Right") {
       return [head[0]+1,head[1]];
    }
    if(direction == "Left") {
        return [head[0]-1,head[1]];
    }
    if(direction == "Up") {
        return [head[0],head[1]+1];
    }
    if(direction == "Down") {
        return [head[0],head[1]-1];
    }
}

let span = document.querySelector("span");

function move() {
    
    let nextHeadPos = generateNextHeadPos(); // получаем след позицию головы [х,у] в зависимости от направления движения
    if(!getDivFromPos(nextHeadPos) || getDivFromPos(nextHeadPos).classList.contains("bodySnake")) {
        alert(`Game Over! Your points: ${span.textContent}`);
        clearInterval(interval);
    } else {
        snakeBody[0].classList.remove("headSnake");  //  удаляем класс с головы(без окраса)
        let nextElem = getDivFromPos(nextHeadPos);  // получаем див следующей клетки
         if(nextElem.classList.contains("mouse")) {
            nextElem.classList.remove("mouse");  // удаляем окрас клетки(мыши)
            snakeBody.unshift(nextElem); // добавляем в начало массива голову змеи
            snakeBody[0].classList.add("bodySnake"); // добавляем класс для тела змеи
            snakeBody[0].classList.add("headSnake"); // добавляем класс для головы змеи
            span.textContent = snakeBody.length -3;
            createMouse();
        } else {
            snakeBody.unshift(nextElem); // добавляем в начало массива голову змеи
            snakeBody[0].classList.add("bodySnake"); // добавляем класс для тела змеи
            snakeBody[0].classList.add("headSnake"); // добавляем класс для головы змеи
            snakeBody[snakeBody.length-1].classList.remove('bodySnake'); // удаляем клас с последнего елемента массива
            snakeBody.pop();    // удаляем сам елемент(див) с массива
        }

    }
    
}




createMouse();

 let interval = setInterval(move, 500);


