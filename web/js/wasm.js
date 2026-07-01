import Module from "../sim_wasm.js";

let instance;

export async function getModule() {
  if (!instance) {
    instance = await Module();
  }
  return instance;
}
