const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let angleX = 0, angleY = 0, angleZ = 0;
let animationId = null;

let cube = [
    {x: -50, y: -50, z: -50}, {x: 50, y: -50, z: -50},
    {x: 50, y: 50, z: -50}, {x: -50, y: 50, z: -50},
    {x: -50, y: -50, z: 50}, {x: 50, y: -50, z: 50},
    {x: 50, y: 50, z: 50}, {x: -50, y: 50, z: 50}
];


function rotateXMatrix(p, angle) {
    let cosA = Math.cos(angle), sinA = Math.sin(angle);
    return {x: p.x, y: p.y * cosA - p.z * sinA, z: p.y * sinA + p.z * cosA};
}


function rotateYMatrix(p, angle) {
    let cosA = Math.cos(angle), sinA = Math.sin(angle);
    return {x: p.x * cosA + p.z * sinA, y: p.y, z: -p.x * sinA + p.z * cosA};

}


function rotateZMatrix(p, angle) {
    let cosA = Math.cos(angle), sinA = Math.sin(angle);
    return {x: p.x * cosA - p.y * sinA, y: p.x * sinA + p.y * cosA, z: p.z};
}


function rotateCube(){
    let newCube = cube.map(p=>{
        let np = {...p}; //копируем свойства x, y, x в новый объект
        if (document.getElementById("rotateX").checked) np = rotateXMatrix(np, angleX);
        if (document.getElementById("rotateY").checked) np = rotateYMatrix(np, angleY);
        if (document.getElementById("rotateZ").checked) np = rotateZMatrix(np, angleZ);
        return np;
    });

    drawCube(newCube);
    if (document.getElementById("rotateX").checked) angleX += 0.03; //пример 1.7 градуса
    if (document.getElementById("rotateY").checked) angleY += 0.03;
    if (document.getElementById("rotateZ").checked) angleZ += 0.03;

    animationId = requestAnimationFrame(rotateCube);
}

function drawCube(points) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);

    let edges = [ //список ребер
        [0,1], [1,2], [2,3], [3,0],
        [4,5], [5,6], [6,7], [7,4],
        [0,4], [1,5], [2,6], [3,7]
    ];

    //рисуем линии между точками
    ctx.beginPath(); //начинаем рисовать
    edges.forEach(([i, j]) => { //проходимся по всем ребрам, соединяем вершинки
        ctx.moveTo(points[i].x, points[i].y); //перемещаемся к первой точке
        ctx.lineTo(points[j].x, points[j].y); //рисуем линию до второй точки
    });
    ctx.stroke(); //отрисовывем все линии
    ctx.restore(); //восстанавливаем состояние canvas
}


//Обработчик событий для галочек. Если все сняты, то останавливаем вращение, если стоит хоть одна, то запускаем вращение
document.querySelectorAll("input[type=checkbox").forEach(cb =>{
    cb.addEventListener("change", () => {
        if (!document.getElementById("rotateX").checked &&
            !document.getElementById("rotateY").checked &&
            !document.getElementById("rotateZ").checked) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!animationId) {
            rotateCube();
        }
    })
});

drawCube(cube);