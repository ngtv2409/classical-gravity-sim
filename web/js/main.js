import createModule from "../sim_wasm.js";
import { initPhysics } from "./physics.js";
import { startSimulation } from "./simulation.js";
import { resizeCanvas } from "./render.js";
import { app } from "./state.js";
import { setup_control_panel } from "./control-panel.js";

const Module = await createModule();

try {
    let save = localStorage.getItem("appsave");
    console.log("Save: " + save);
    if (save) {
        let savestate = JSON.parse(save);
        Object.assign(app, structuredClone(savestate));
    }
} catch (e) {
    console.log("Load error: " + e);
    alert("Invalid save. Using default");
}

initPhysics(Module);
resizeCanvas();
app.sim = startSimulation(app);
setup_control_panel(app);
