const AU = 1.496e11;
export const defaultDisplay = {
    showLabels: true,
    timeScale: 24*60*60*30
};
export const defaultSimulation = {
    bodies: [
        {
            name: "Sun A",
            x: -AU / 2,
            y: 0,
            vx: 0,
            vy: 14900,
            mass: 1.989e30,
            immutable: false,
            color: "#000000",
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
            color: "#000000",
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
            color: "#000000",
            radius: 6
        }
    ],
    params: {
        eps: 0.1,
        dt: 3600
    }
};

export const app = {
    simulation: structuredClone(defaultSimulation),
    editor: structuredClone(defaultSimulation),
    display: structuredClone(defaultDisplay),
    sim: null
};

export function to_default(app) {
    app.simulation = structuredClone(defaultSimulation);
    app.editor = structuredClone(defaultSimulation);
    app.display = structuredClone(defaultDisplay);
    app.sim = null;
}

export function isSimulation(obj) {
  return (
    obj &&
    Array.isArray(obj.bodies) &&
    obj.bodies.every(body =>
      typeof body.name === "string" &&
      typeof body.x === "number" &&
      typeof body.y === "number" &&
      typeof body.vx === "number" &&
      typeof body.vy === "number" &&
      typeof body.mass === "number" &&
      typeof body.immutable === "boolean" &&
      typeof body.color === "string" &&
      typeof body.radius === "number"
    ) &&
    obj.params &&
    typeof obj.params.eps === "number" &&
    typeof obj.params.dt === "number"
  );
}
