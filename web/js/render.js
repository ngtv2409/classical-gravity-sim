import { getBodies, getLay, getPos } from "./physics.js";

const canvas = document.getElementById("sim-cv");
const ctx = canvas.getContext("2d");
const SCALE = 1e9;

export function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);

export function createRenderer(app, visuals) {
    return function render() {
        const bodies = getBodies();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        let i = 0;
        for (const rawbody of bodies) {
            const [x, y] = getPos(rawbody);

            const body = visuals[i] || {
                radius: 3,
                color: "#000000"
            };
            const screenX = cx + x / SCALE;
            const screenY = cy + y / SCALE;

            ctx.beginPath();
            ctx.arc(
                screenX,
                screenY,
                body.radius,
                0,
                Math.PI * 2
            );
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
                    screenY);
            }
            i = i + 1;
        }
    };
}
