import { startSimulation } from "./simulation.js";

function createBodyRow(inputbuffer, body, index) {
    const div = document.createElement("div");
    div.className = "body-row";

    div.innerHTML = `
        <div class="field">
            <label>Name</label>
            <input class="name" value="${body.name}">
        </div>

        <div class="field">
            <label>X</label>
            <input class="x" type="text" value="${body.x}">
        </div>

        <div class="field">
            <label>Y</label>
            <input class="y" type="text" value="${body.y}">
        </div>

        <div class="field">
            <label>VX</label>
            <input class="vx" type="text" value="${body.vx}">
        </div>

        <div class="field">
            <label>VY</label>
            <input class="vy" type="text" value="${body.vy}">
        </div>

        <div class="field">
            <label>Mass</label>
            <input class="mass" type="text" value="${body.mass}">
        </div>

        <div class="field">
            <label>Radius</label>
            <input class="radius" type="text" value="${body.radius}">
        </div>

        <div class="field">
            <label>Color</label>
            <input class="color" type="color" value="${body.color}">
        </div>

        <div class="field remove-field">
            <label>&nbsp;</label>
            <button class="remove">Delete</button>
        </div>
    `;

    function tryParseFloat(value) {
        const n = Number(value.trim());

        if (!Number.isFinite(n)) {
            return null;
        }
        return n;
    }
    div.querySelector(".name").oninput = e => inputbuffer[index].name = e.target.value;
    div.querySelector(".x").oninput = e => inputbuffer[index].x = tryParseFloat(e.target.value);
    div.querySelector(".y").oninput = e => inputbuffer[index].y = tryParseFloat(e.target.value);
    div.querySelector(".vx").oninput = e => inputbuffer[index].vx = tryParseFloat(e.target.value);
    div.querySelector(".vy").oninput = e => inputbuffer[index].vy = tryParseFloat(e.target.value);
    div.querySelector(".mass").oninput = e => inputbuffer[index].mass = tryParseFloat(e.target.value);
    div.querySelector(".radius").oninput = e => inputbuffer[index].radius = tryParseFloat(e.target.value);
    div.querySelector(".color").oninput = e => inputbuffer[index].color = e.target.value;

    div.querySelector(".remove").onclick = () => {
        inputbuffer.splice(index, 1);
        renderEditor(inputbuffer);
    };

    return div;
}

function findInvalidBodies(buffer) {
    const invalidIndices = buffer
        .map((obj, idx) =>
            Object.values(obj).some(v => v == null) ? idx : -1
        )
        .filter(idx => idx !== -1);

    return invalidIndices;
}

function renderEditor(inputbuffer) {
    const container = document.getElementById("body-panel");
    container.innerHTML = "";

    inputbuffer.forEach((body, i) => {
        const row = createBodyRow(inputbuffer, body, i);
        container.appendChild(row);
    });
}

export function setup_control_panel(app) {
    renderEditor(app.editor.bodies);
    document.getElementById("sim-start").addEventListener("click", () => {
        let invalids = findInvalidBodies(app.editor.bodies);
        if (invalids.length != 0) {
            if (invalids.length !== 0) {
                alert("Incorrect input for {" + invalids + "}");
                return;
            }
        }
        app.sim?.stop();
        app.simulation = structuredClone(app.editor);
        app.sim = startSimulation(app);
    });

    document.getElementById("sim-body-add").addEventListener("click", () => {
        app.editor.bodies.push({
            name: "New Body",
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            mass: 1e20,
            color: "#ffffff",
            radius: 5,
            immutable: false
        });

        renderEditor(app.editor.bodies);
    });

    const inpshowlab = document.getElementById("cfg-show-lab");
    inpshowlab.addEventListener("input", () => {
        app.display.showLabels = inpshowlab.checked;
    });
    const inptimescale = document.getElementById("cfg-timescale");
    inptimescale.addEventListener("input", () => {
        app.display.timeScale = inptimescale.value;
    });
    let noticed = false;
    const inpdt = document.getElementById("cfg-dt");
    inpdt.addEventListener("input", () => {
        if (!noticed) {
            alert("Warning: changing dt too low can crash the browser.");
            noticed = true;
        }
        app.editor.params.dt = inpdt.value;
    });
    const inpeps = document.getElementById("cfg-eps");
    inpeps.addEventListener("input", () => {
        app.editor.params.eps = inpeps.value;
    });
}
