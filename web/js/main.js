import createModule from "../sim_wasm.js";
import { initPhysics } from "./physics.js";
import { startSimulation } from "./simulation.js";
import { resizeCanvas } from "./render.js";
import { app } from "./state.js";

export const Module = await createModule();

console.log("hi");
initPhysics(Module);
resizeCanvas();
app.sim = startSimulation(app);
