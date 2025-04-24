const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
let trianglePoints = [];
let polygonPoints = [];
let isDrawingPolygon = true;

canvas1.addEventListener("click", (e) => {
    if (trianglePoints.length < 3) {
        const rect = canvas1.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        trianglePoints.push({ x, y });
        drawPoint(ctx1, x, y);
    }
    if (trianglePoints.length === 3) {
        drawTriangle(trianglePoints);
        fillTriangle(trianglePoints);
        trianglePoints = [];
    }
});

canvas2.addEventListener("click", (e) => {
    const rect = canvas2.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    polygonPoints.push({ x, y });
    drawPoint(ctx2, x, y);
});

canvas2.addEventListener("dblclick", () => {
    if (polygonPoints.length > 2) {
        drawPolygon(polygonPoints);
        fillPolygon(polygonPoints);
        polygonPoints = [];
    }
});

document.getElementById("fillPolygon").addEventListener("click", () => {
    if (polygonPoints.length > 2) {
        drawPolygon(polygonPoints);
        fillPolygon(polygonPoints);
        polygonPoints = [];
    }
});

function drawPoint(ctx, x, y) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawTriangle(pts) {
    drawLine(ctx1, pts[0], pts[1]);
    drawLine(ctx1, pts[1], pts[2]);
    drawLine(ctx1, pts[2], pts[0]);
}

function drawPolygon(pts) {
    for (let i = 0; i < pts.length; i++) {
        drawLine(ctx2, pts[i], pts[(i + 1) % pts.length]);
    }
}

function drawLine(ctx, p1, p2) {
    let x0 = Math.round(p1.x), y0 = Math.round(p1.y);
    let x1 = Math.round(p2.x), y1 = Math.round(p2.y);
    let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
        ctx.fillRect(x0, y0, 1, 1);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}

function fillTriangle(pts) {
    pts.sort((a, b) => a.y - b.y);
    let [A, B, C] = pts;
    let interpolate = (y1, y2, x1, x2, y) => x1 + (y - y1) * (x2 - x1) / (y2 - y1);
    for (let y = A.y; y <= C.y; y++) {
        let xLeft = y < B.y ? interpolate(A.y, B.y, A.x, B.x, y) : interpolate(B.y, C.y, B.x, C.x, y);
        let xRight = interpolate(A.y, C.y, A.x, C.x, y);
        if (xLeft > xRight) [xLeft, xRight] = [xRight, xLeft];
        for (let x = Math.round(xLeft); x <= Math.round(xRight); x++) {
            ctx1.fillRect(x, y, 1, 1);
        }
    }
}

function fillPolygon(pts) {
    let minY = Math.min(...pts.map(p => p.y));
    let maxY = Math.max(...pts.map(p => p.y));
    for (let y = minY; y <= maxY; y++) {
        let intersections = [];
        for (let i = 0; i < pts.length; i++) {
            let p1 = pts[i], p2 = pts[(i + 1) % pts.length];
            if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
                let x = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
                intersections.push(x);
            }
        }
        intersections.sort((a, b) => a - b);
        for (let i = 0; i < intersections.length; i += 2) {
            for (let x = Math.round(intersections[i]); x <= Math.round(intersections[i + 1]); x++) {
                ctx2.fillRect(x, y, 1, 1);
            }
        }
    }
}