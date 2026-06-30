let stop = false;

Module.onRuntimeInitialized = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const bodySize = Module._sizeof_body();
    const posOffset = Module._body_offset_pos();
    const velOffset = Module._body_offset_vel();
    const massOffset = Module._body_offset_mass();
    const immutOffset = Module._body_offset_immutable();
    const xOffset = Module._vec2_offset_x();
    const yOffset = Module._vec2_offset_y();

    const SCALE = 1e9;

const AU = 149.6e9;

const initialBodies = [
    {
        name: "Sun A",
        x: -AU/2,
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
        x: AU/2,
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
    },
];

    const renderData = initialBodies.map(b => ({ color: b.color, radius: b.radius }));

    function initUniverse(bodiesArray, eps = 0.01) {
        const count = bodiesArray.length;
        const ptr = Module._bodies_alloc(count);

        bodiesArray.forEach((b, i) => {
            const base = ptr + i * bodySize;
            
            HEAPF64[(base + posOffset + xOffset) >> 3] = b.x;
            HEAPF64[(base + posOffset + yOffset) >> 3] = b.y;
            
            HEAPF64[(base + velOffset + xOffset) >> 3] = b.vx;
            HEAPF64[(base + velOffset + yOffset) >> 3] = b.vy;
            
            HEAPF64[(base + massOffset) >> 3] = b.mass;
            
            HEAPU8[base + immutOffset] = b.immutable ? 1 : 0; 
        });

        Module._universe_init(ptr, count, eps);
        Module._bodies_free(ptr);
    }

    function draw() {
        if (stop) {
            return;
        }
        Module._universe_step(24 * 60 * 60);

        const ptr = Module._universe_bodies();
        const bodiesCount = Module._universe_body_count();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const baseX = canvas.width / 2;
        const baseY = canvas.height / 2;

        for (let i = 0; i < bodiesCount; ++i) {
            const base = ptr + i * bodySize;

            const x = HEAPF64[(base + posOffset + xOffset) >> 3];
            const y = HEAPF64[(base + posOffset + yOffset) >> 3];

            const screenX = baseX + x / SCALE;
            const screenY = baseY + y / SCALE; 

            const visuals = renderData[i] || { radius: 3, color: "white" };

            ctx.beginPath();
            ctx.arc(screenX, screenY, visuals.radius, 0, Math.PI * 2);
            ctx.fillStyle = visuals.color;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    initUniverse(initialBodies);
    draw();
};
