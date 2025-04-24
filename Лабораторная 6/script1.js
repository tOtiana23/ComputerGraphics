const canvas1 = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

let polygonPoints1 = [];
let polygonPoints2 = [];
let polygonClosed1 = false;
let polygonClosed2 = false;

// Обработчик клика для рисования точек и заливки
canvas1.addEventListener("click", (e) => handleCanvasClick(e, canvas1, ctx1, polygonPoints1, () => polygonClosed1, (val) => polygonClosed1 = val, floodFill));
canvas2.addEventListener("click", (e) => handleCanvasClick(e, canvas2, ctx2, polygonPoints2, () => polygonClosed2, (val) => polygonClosed2 = val, floodFill8));

canvas1.addEventListener("dblclick", () => closePolygon(ctx1, polygonPoints1, () => polygonClosed1, (val) => polygonClosed1 = val));
canvas2.addEventListener("dblclick", () => closePolygon(ctx2, polygonPoints2, () => polygonClosed2, (val) => polygonClosed2 = val));

document.getElementById("clear").addEventListener("click", clearCanvas);

function handleCanvasClick(e, canvas, ctx, points, isClosed, setClosed, fillFunction) {
    const rect = canvas.getBoundingClientRect();
    let x = Math.floor(e.clientX - rect.left);
    let y = Math.floor(e.clientY - rect.top);

    if (!isClosed()) {
        points.push({ x, y });
        drawPoint(ctx, x, y);
    } else {
        if (isInsidePolygon({ x, y }, points)) {
            fillFunction(x, y, ctx, [255, 182, 193, 255]);
        }
    }
}

function closePolygon(ctx, points, isClosed, setClosed) {
    if (points.length > 2) {
        drawPolygon(ctx, points);
        setClosed(true);
    }
}

function clearCanvas() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    polygonPoints1 = [];
    polygonPoints2 = [];
    polygonClosed1 = false;
    polygonClosed2 = false;
}

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

function isInsidePolygon(point, polygon) {
    let { x, y } = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        let intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function floodFill(x, y, ctx, fillColor) {
    let imageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);
    let pixels = imageData.data;
    let width = canvas1.width;

    function getPixel(x, y) {
        let index = (y * width + x) * 4;
        return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
    }

    function setPixel(x, y, color) {
        let index = (y * width + x) * 4;
        pixels[index] = color[0];
        pixels[index + 1] = color[1];
        pixels[index + 2] = color[2];
        pixels[index + 3] = color[3];
    }

    let targetColor = getPixel(x, y);
    if (targetColor.toString() === fillColor.toString()) return;

    let stack = [{ x, y }];
    while (stack.length > 0) {
        let { x, y } = stack.pop();
        if (x < 0 || y < 0 || x >= canvas1.width || y >= canvas1.height) continue;
        if (getPixel(x, y).toString() !== targetColor.toString()) continue;

        setPixel(x, y, fillColor);

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
    }

    ctx.putImageData(imageData, 0, 0);
}

function floodFill8(x, y, ctx, fillColor) {
    let imageData = ctx.getImageData(0, 0, canvas2.width, canvas2.height);
    let pixels = imageData.data;
    let width = canvas2.width;

    function getPixel(x, y) {
        let index = (y * width + x) * 4;
        return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
    }

    function setPixel(x, y, color) {
        let index = (y * width + x) * 4;
        pixels[index] = color[0];
        pixels[index + 1] = color[1];
        pixels[index + 2] = color[2];
        pixels[index + 3] = color[3];
    }

    let targetColor = getPixel(x, y);
    if (targetColor.toString() === fillColor.toString()) return;

    let stack = [{ x, y }];
    while (stack.length > 0) {
        let { x, y } = stack.pop();
        if (x < 0 || y < 0 || x >= canvas2.width || y >= canvas2.height) continue;
        if (getPixel(x, y).toString() !== targetColor.toString()) continue;

        setPixel(x, y, fillColor);

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
        stack.push({ x: x + 1, y: y + 1 });
        stack.push({ x: x - 1, y: y + 1 });
        stack.push({ x: x + 1, y: y - 1 });
        stack.push({ x: x - 1, y: y - 1 });
    }

    ctx.putImageData(imageData, 0, 0);
}
