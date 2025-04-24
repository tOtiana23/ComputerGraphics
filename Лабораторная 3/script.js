const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); //рисуем 2д рисуночки
let angle = 0;
let animationId = null;
let shape = [];
let drawing = false;


canvas.addEventListener("mousedown", (e) => { //функция будет выполнена, когда пользователь нажимает кнопочку мышки на холсте
    drawing = true; //ставим true для отслеживания состояния рисования
})


canvas.addEventListener("mousemove", (e) => { //функция срабатывает когда пользователь перемещает мышку над элементом
    if (!drawing) return; //если drawing false значит кнопка мыши не нажата, значит пользователь ниче не рисует, просто балуется
    const rect = canvas.getBoundingClientRect(); //получаем размер и положение элемента относительно окна браузера, 
    // возвращается инфа с инфой о границах элемента (ширина, высота, координаты)
    const x = e.clientX - rect.left - canvas.width / 2; //вычисляем координату x курсора мышки относительно центра холста. 
    // e.clientX - горизонтальная позиция курсора мыши относительно окна браузера, вычитаем rect.left чтоб получить позицию 
    // относительно левого края холста, а потом вычитаем половину ширины холста, чтоб центрировать координаты
    const y = e.clientY - rect.top - canvas.height / 2; //вычисляем координату y курсора мышки. всё аналогично x
    shape.push({x, y}); //записываем эти координаты в массивчик
    redrawCanvas(); //перерисовываем холст
})


canvas.addEventListener("mouseup", () => { //функция срабатывает когда пользователь отпускает кнопку мыши
    drawing = false; //стоп рисование
})


//перерисовываем холст
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //очищаем весь холст
    if (shape.length < 2) return; //проверяем есть ли хотя бы две точки в массиве, иначе смысла нет рисовать
    ctx.save(); //сохраняем текущее состояние контекста рисования
    ctx.translate(canvas.width / 2, canvas.height / 2); //перемещаем начало координат в центр холста, для удобного вращения
    ctx.beginPath(); //начинаем новый путь для рисования
    ctx.moveTo(shape[0].x, shape[0].y); //устанавливаем начальную точку пути в координаты первой точки в массиве, отсюда 
    // начинается рисование
    shape.forEach(point => ctx.lineTo(point.x, point.y)); //для каждой точки вызываем lineTo, который добавляет линию к 
    // текущему пути от последней установленной точки до текущей точки, в итоге будет создана линия, соединяющая все точки
    ctx.stroke(); //рисуем путь на холсте, используя текущие настройки стиля
    ctx.restore(); //восстанавливаем предыдущее состояние контекста, которое было сохранено ранее, чтоб избежать изменения 
    // состояния контекста после завершения рисования
}


function drawShape(rotAngle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //очищаем весь холст
    if (shape.length < 2) return; //проверяем есть ли хотя бы две точки в массиве, иначе смысла нет рисовать
    ctx.save(); //сохраняем текущее состояние контекста рисования
    ctx.translate(canvas.width / 2, canvas.height / 2); //перемещаем начало координат в центр холста, для удобного вращения
    ctx.beginPath(); //начинаем новый путь для рисования
    shape.forEach((point, index) => {
        // вычисление новых кординат с учетом поворота, используем формулы для вращения точки на плоскости
        const x = point.x * Math.cos(rotAngle) - point.y * Math.sin(rotAngle);
        const y = point.x * Math.sin(rotAngle) + point.y * Math.cos(rotAngle);
        if (index === 0) ctx.moveTo(x, y); //если это первая точка, то устанавливаем начальную позицию
        else ctx.lineTo(x, y); //для остальных проводим линии к этим тчокам
    });
    ctx.stroke();
    ctx.restore(); 
}


// разовый поворот
function rotateOnce() {
    let angleInput = parseFloat(document.getElementById("angle").value); //украли угол поворота
    angle += angleInput * Math.PI / 180; //обновляем значение, преобразуем значения в радианы, т.к. js работает с ними
    drawShape(angle); //отрисовываем по новой, с новым углом
}


//крутим вертим
function startRotation() {
    if (animationId) return; //проверяем, есть ли активная анимация
    function animate() {
        rotateOnce(); //много раз вызываем функцию разового поворота
        animationId = requestAnimationFrame(animate); //requestAnimationFrame планирует выполнение функции на следующем кадре анимации 
        // Частота отрисовки определяется браузером и привязана к частоте кадров экрана пользователя.
        // Обычно requestAnimationFrame вызывается примерно 60 раз в секунду (т.е. каждые ~16.67 мс).
        // Если у пользователя экран с высокой частотой обновления (например, 144 Гц), браузер может вызвать requestAnimationFrame 144 раза в секунду.
    }
    animate();
}


//стоп парад
function stopRotation() {
    cancelAnimationFrame(animationId); //отменяем запланированное выполнение функции анимации
    animationId = null;
}


//чистим моем
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //очищаем холст
    shape = []; //очищаем массив
}