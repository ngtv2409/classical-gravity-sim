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
