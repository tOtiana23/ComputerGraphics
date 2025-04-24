const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = [];
let linePoints = [];
let quadrangle = false;

document.getElementById("clear").addEventListener("click", clearCanvas);

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    if (!quadrangle) {
        points.push({ x, y });
        drawPoint(ctx, x, y);
        if (points.length === 4) {
            drawPolygon(ctx, points);
            quadrangle = true;
        }
    } else {
        linePoints.push({ x, y });
        drawPoint(ctx, x, y);
        
        if (linePoints.length === 2) {
            const clippedLine = clipLineWithPolygon(linePoints[0], linePoints[1], points); //вычисляем отрезок внутри многоугольника
            if (clippedLine) { //если такой есть, то рисуем его
                drawLine(ctx, clippedLine.start, clippedLine.end);
            }
            linePoints = [];
        }
    }
});

function drawPoint(ctx, x, y) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawPolygon(ctx, pts) {
    for (let i = 0; i < pts.length; i++) {
        drawLine(ctx, pts[i], pts[(i + 1) % pts.length]);
    }
}

function drawLine(ctx, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    linePoints = [];
    quadrangle = false;
}

// Функция для проверки, находится ли точка внутри многоугольника
// Алгоритм четности луча, выпускаем горизонтальный луч вправо от point, если он пересекает нечетное кол-во границ - точка внутри, иначе снаружи
function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { //идем по вершинам многоульника
        const xi = polygon[i].x, yi = polygon[i].y; //получаем координаты текущей и предыдущей вершины
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) && //проверяем, пересекает ли горизонтальный луч, проведенный из точки point, ребро между текущей и предыдущей вершинами
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Обрезка линии по многоугольнику
// Проверяем, лежат ли точки start и end внутри многоугольника
// Проверяем пересечение отрезка с каждой стороной многоугольника
// Если есть хотя бы две точки пересечения, возвращаем их как новую обрезанную линию
function clipLineWithPolygon(start, end, polygon) {
    const clippedPoints = [];

    // Проверяем каждую из двух точек на принадлежность к многоугольнику
    if (isPointInPolygon(start, polygon)) clippedPoints.push(start);
    if (isPointInPolygon(end, polygon)) clippedPoints.push(end);

    // Проверяем пересечение с каждой стороной многоугольника
    for (let i = 0; i < polygon.length; i++) {
        const nextIndex = (i + 1) % polygon.length;
        const intersection = getLineIntersection(start, end, polygon[i], polygon[nextIndex]);
        if (intersection) clippedPoints.push(intersection);
    }

    // Если есть хотя бы две точки в clippedPoints, возвращаем их
    if (clippedPoints.length >= 2) {
        return {
            start: clippedPoints[0],
            end: clippedPoints[1]
        };
    }
    
    return null; // Если нет пересечений
}

// Функция для нахождения пересечения двух отрезков
// Использует формулу параметрического пересечения отрезков
function getLineIntersection(p1, p2, p3, p4) {
    const s1_x = p2.x - p1.x;
    const s1_y = p2.y - p1.y;
    const s2_x = p4.x - p3.x;
    const s2_y = p4.y - p3.y;
    const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);

    // Если s и t находятся в пределах [0; 1], то отрезки пересекаются
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return {
            x: p1.x + (t * s1_x),
            y: p1.y + (t * s1_y)
        };
    }

    return null; // Нет пересечения
}
