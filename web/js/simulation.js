import { initUniverse, stepUniverse } from "./physics.js";
import { createRenderer } from "./render.js";

export function startSimulation(app) {
    let stopped = false;

    const visuals = app.simulation.bodies.map(({ name, color, radius }) => ({
        name,
        color,
        radius,
    }));

    initUniverse(app.simulation.bodies, app.simulation.params.eps);

    const render = createRenderer(app, visuals, []);

    function frame() {
        if (stopped) return;

        const now = performance.now() / 1000;

        if (!frame.lastTime) {
            frame.lastTime = now;
            frame.accumulator = 0; 
        }

        let delta = now - frame.lastTime;
        frame.lastTime = now;

        delta = Math.min(delta, 0.05);

        frame.accumulator += delta * app.display.timeScale;

        while (frame.accumulator >= app.simulation.params.dt) {
            stepUniverse(app.simulation.params.dt);
            frame.accumulator -= app.simulation.params.dt;
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
