import { getBodies, getLay, getPos } from "./physics.js";

export const camera = {
    x: 0,
    y: 0
};

const canvas = document.getElementById("sim-cv");
const ctx = canvas.getContext("2d");
const SCALE = 1e9;

function drawCoord(ctx, canvas, camera, SCALE, gridSize) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const left   = camera.x - cx * SCALE;
    const right  = camera.x + cx * SCALE;
    const top    = camera.y - cy * SCALE;
    const bottom = camera.y + cy * SCALE;

    const startX = Math.floor(left / gridSize) * gridSize;
    const startY = Math.floor(top / gridSize) * gridSize;

    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.font = "10px monospace";
    ctx.fillStyle = "#666";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    for (let x = startX; x <= right; x += gridSize) {
        const sx = cx + (x - camera.x) / SCALE;

        for (let y = startY; y <= bottom; y += gridSize) {
            const sy = cy + (y - camera.y) / SCALE;

            ctx.fillText(
                `(${x/SCALE}, ${y/SCALE})`,
                sx + 3,
                sy + 3
            );
        }
    }
}

function drawGrid(ctx, canvas, camera, SCALE, gridSize) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const left   = camera.x - cx * SCALE;
    const right  = camera.x + cx * SCALE;
    const top    = camera.y - cy * SCALE;
    const bottom = camera.y + cy * SCALE;

    const startX = Math.floor(left / gridSize) * gridSize;
    const startY = Math.floor(top / gridSize) * gridSize;

    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = startX; x <= right; x += gridSize) {
        const sx = cx + (x - camera.x) / SCALE;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, canvas.height);
    }

    // Horizontal lines
    for (let y = startY; y <= bottom; y += gridSize) {
        const sy = cy + (y - camera.y) / SCALE;
        ctx.moveTo(0, sy);
        ctx.lineTo(canvas.width, sy);
    }

    ctx.stroke();
}

export function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);

export function createRenderer(app, visuals, trails) {

    return function render() {
        const bodies = getBodies();
        const MAX_TRAIL = 250 * bodies.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        if (app.display.showGrid) drawGrid(ctx, canvas, camera, SCALE, 100e9);
        if (app.display.showCoord) drawCoord(ctx, canvas, camera, SCALE, 100e9);

        let i = 0;
        for (const rawbody of bodies) {
            const [x, y] = getPos(rawbody);
            const body = visuals[i] || {
                name: "Noname",
                radius: 3,
                color: "#000000",
            };

            trails.push({
                body: i,
                x,
                y,
                color: body.color,
            });

            i++;
        }

        while (trails.length > MAX_TRAIL) {
            trails.shift();
        }

        if (app.display.showTrail) {
            for (let i = 0; i < visuals.length; i++) {
                const points = trails.filter(t => t.body === i);

                for (let j = 1; j < points.length; j++) {
                    const a = points[j - 1];
                    const b = points[j];

                    const alpha = j / (points.length - 1); // 0 → 1

                    ctx.beginPath();
                    ctx.moveTo(
                        cx + (a.x - camera.x) / SCALE,
                        cy + (a.y - camera.y) / SCALE
                    );
                    ctx.lineTo(
                        cx + (b.x - camera.x) / SCALE,
                        cy + (b.y - camera.y) / SCALE
                    );

                    ctx.strokeStyle = points[j].color;
                    ctx.globalAlpha = alpha;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.globalAlpha = 1;
            }
        }

        i = 0;
        for (const rawbody of bodies) {
            const [x, y] = getPos(rawbody);
            const body = visuals[i] || {
                name: "Noname",
                radius: 3,
                color: "#000000",
            };

            const screenX = cx + (x - camera.x) / SCALE;
            const screenY = cy + (y - camera.y) / SCALE;

            ctx.beginPath();
            ctx.arc(screenX, screenY, body.radius, 0, Math.PI * 2);
            ctx.fillStyle = body.color;
            ctx.fill();

            if (app.display.showLabels) {
                ctx.font = "12px sans-serif";
                ctx.fillStyle = "black";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    body.name,
                    screenX + body.radius + 6,
                    screenY
                );
            }

            i++;
        }
    };
}


let dragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    camera.x -= dx * SCALE;
    camera.y -= dy * SCALE;

    lastX = e.clientX;
    lastY = e.clientY;
});

function stopDragging(e) {
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);
