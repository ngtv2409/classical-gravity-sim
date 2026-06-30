const canvas = document.getElementById("sim-cv");
const ctx = canvas.getContext("2d");
const DT = 3600;
const TIME_SCALE = 24*60*60*30;

let current_sim;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const AU = 1.496e11;
const SCALE = 1e9;

const initialBodies = [
    {
        name: "Sun A",
        x: -AU / 2,
        y: 0,
        vx: 0,
        vy: 14900,
        mass: 1.989e30,
        immutable: false,
        color: "gold",
        radius: 12
    },
    {
        name: "Sun B",
        x: AU / 2,
        y: 0,
        vx: 0,
        vy: -14900,
        mass: 1.989e30,
        immutable: false,
        color: "orange",
        radius: 12
    },
    {
        name: "Sun C",
        x: AU,
        y: AU,
        vx: 0,
        vy: 0,
        mass: 1.989e19,
        immutable: false,
        color: "blue",
        radius: 6
    }
];
let current_bodies = initialBodies;

let Layout;

// reset
function initUniverse(bodies, eps = 0.01) {
    const ptr = Module._bodies_alloc(bodies.length);

    bodies.forEach((body, i) => {
        const base = ptr + i * Layout.bodySize;

        HEAPF64[(base + Layout.posOffset + Layout.xOffset) >> 3] = body.x;
        HEAPF64[(base + Layout.posOffset + Layout.yOffset) >> 3] = body.y;

        HEAPF64[(base + Layout.velOffset + Layout.xOffset) >> 3] = body.vx;
        HEAPF64[(base + Layout.velOffset + Layout.yOffset) >> 3] = body.vy;

        HEAPF64[(base + Layout.massOffset) >> 3] = body.mass;

        HEAPU8[base + Layout.immutableOffset] = body.immutable ? 1 : 0;
    });

    Module._universe_init(ptr, bodies.length, eps);
    Module._bodies_free(ptr);
}

function stepUniverse(dt) {
    Module._universe_step(dt);
}

function getBodies() {
    return {
        ptr: Module._universe_bodies(),
        count: Module._universe_body_count()
    };
}

function createRenderer(visuals) {
    return function render() {
        const { ptr, count } = getBodies();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < count; i++) {
            const base = ptr + i * Layout.bodySize;

            const x = HEAPF64[(base + Layout.posOffset + Layout.xOffset) >> 3];
            const y = HEAPF64[(base + Layout.posOffset + Layout.yOffset) >> 3];

            const body = visuals[i] || {
                radius: 3,
                color: "white"
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
            ctx.font = "12px sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(
                body.name,
                screenX + body.radius + 6,
                screenY);
        }
    };
}

function startSimulation(bodies) {
    let stopped = false;

    const visuals = bodies.map(({ name, color, radius }) => ({
        name,
        color,
        radius
    }));

    initUniverse(bodies);

    const render = createRenderer(visuals);

    function frame() {
        if (stopped) return;

        const now = performance.now() / 1000;

        // Initialize both lastTime AND accumulator on the first frame
        if (!frame.lastTime) {
            frame.lastTime = now;
            frame.accumulator = 0; 
        }

        let delta = now - frame.lastTime;
        frame.lastTime = now;

        delta = Math.min(delta, 0.05);

        frame.accumulator += delta * TIME_SCALE;

        while (frame.accumulator >= DT) {
            stepUniverse(DT);
            frame.accumulator -= DT;
        }

        render();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    return {
        stop() {
            stopped = true;
        }
    };
}

Module.onRuntimeInitialized = () => {
    Layout = {
        bodySize: Module._sizeof_body(),
        posOffset: Module._body_offset_pos(),
        velOffset: Module._body_offset_vel(),
        massOffset: Module._body_offset_mass(),
        immutableOffset: Module._body_offset_immutable(),
        xOffset: Module._vec2_offset_x(),
        yOffset: Module._vec2_offset_y()
    };
    const startbt = document.getElementById("sim-start");
    const inputarea = document.getElementById("sim-input");
    inputarea.value = JSON.stringify(initialBodies, null, 2);

    current_sim = startSimulation(current_bodies);
    startbt.addEventListener("click", () => {
        try {
            const newBodies = JSON.parse(inputarea.value);
            current_sim.stop();
            current_bodies = newBodies;
            current_sim = startSimulation(current_bodies);
        } catch (e) {
            alert("Invalid JSON format: " + e);
            console.error("Parsing error:", e);
        }
    });
};
