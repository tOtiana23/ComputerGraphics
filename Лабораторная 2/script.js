const gridSize = 50;
const grid = document.getElementById("grid");


function createGrid() {
    grid.innerHTML = ""; //очистка
    for (let i = 0; i < gridSize * gridSize; i++){
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        grid.appendChild(pixel);
    }
}


function setPixel(x, y) {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        const index = y * gridSize + x; //переводим координаты в номер элемента в массиве
        grid.children[index].classList.add("filled"); //закрашиваем пиксель
    }
}


// достаточно нарисовать 1/8 окружности, а остальные точки отражать
function drawCircle() {
    createGrid();
    let R = parseInt(document.getElementById("radius").value); //украли значение радиуса
    let xc = Math.floor(gridSize / 2); //вычисляем центр окружности в сетке
    let yc = Math.floor(gridSize / 2);

    let x = 0, y = R;
    let d = 3 - 2 * R;
    let u = 6, v = 10 - 4 * R;

    while (x <= y) { //туда сюда там сям их
        setPixel(xc + x, yc + y);
        setPixel(xc - x, yc + y);
        setPixel(xc + x, yc - y);
        setPixel(xc - x, yc - y);
        setPixel(xc + y, yc + x);
        setPixel(xc - y, yc + x);
        setPixel(xc + y, yc - x);
        setPixel(xc - y, yc - x);

        if (d > 0) {
            d += v;
            v += 8; 
        }
        else {
            d += u;
            v += 4;
        }
        u += 4;
        x++;
        if (d > 0) y --; 
    }
}

// эллипс симметричен относительно обеих осей, поэтому достаточно рисовать только 1/4 эллипса, а остальные точки отражать
function drawEllipse() {
    createGrid(); 
    let a = parseInt(document.getElementById("a").value);
    let b = parseInt(document.getElementById("b").value);
    let xc = Math.floor(gridSize / 2);
    let yc = Math.floor(gridSize / 2);

    let x = 0, y = b;
    let a2 = a * a, b2 = b * b;
    let d = b2 - a2 * b + 0.25 * a2; //функция принятия решений, помогает определить, нужно ли изменять y
    let dx = 2 * b2 * x; //изменение ошибки при движении по x
    let dy = 2 * a2 * y; //изменение ошибки при движении по y

    // первая зона, горизонтальное движение
    while (dx < dy) {
        setPixel(xc + x, yc + y);
        setPixel(xc - x, yc + y);
        setPixel(xc + x, yc - y);
        setPixel(xc - x, yc - y);

        if (d < 0) { //если точка внутри эллипса, то двигаемся вправо
            d += dx + b2;
        }
        else { //если точка выше эллипса, то двигаемся по диагонали
            y--;
            dy -= 2 * a2;
            d += dx - dy + b2;
        }
        x++;
        dx += 2 * b2;
    }

    // вторая зона, вертикальное движение
    d = b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2; //новая функция принятия решений
    while (y >= 0) {
        setPixel(xc + x, yc + y);
        setPixel(xc - x, yc + y);
        setPixel(xc + x, yc - y);
        setPixel(xc - x, yc - y);

        if (d > 0) { //точка вне эллипса - двигаемся вниз
            d -= dy + a2;
        }
        else { //точка внутри эллипса - двигаемся по диагонали
            x++;
            dx += 2 * b2;
            d += dx - dy + a2;
        }
        y--;
        dy -= 2 * a2;
    }
}


createGrid(); 