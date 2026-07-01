const AU = 1.496e11;
export const defaultDisplay = {
    showLabels: true,
    timeScale: 24*60*60*30,
    showGrid: true,
    showCoord: false,
    showTrail: true
};
export const defaultSimulation = {
  "bodies": [
    {
      "name": "Body 1",
      "x": 145109934000,
      "y": -36382782000,
      "vx": 13883.8,
      "vy": 12875.2,
      "mass": 1.989e30,
      "immutable": false,
      "color": "#FF5555",
      "radius": 10
    },
    {
      "name": "Body 2",
      "x": -145109934000,
      "y": 36382782000,
      "vx": 13883.8,
      "vy": 12875.2,
      "mass": 1.989e30,
      "immutable": false,
      "color": "#55AAFF",
      "radius": 10
    },
    {
      "name": "Body 3",
      "x": 0,
      "y": 0,
      "vx": -27767.6,
      "vy": -25750.4,
      "mass": 1.989e30,
      "immutable": false,
      "color": "#55FF55",
      "radius": 10
    }
  ],
  "params": {
    "eps": 0.1,
    "dt": 300
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
