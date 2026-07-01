import { startSimulation } from "./simulation.js";
import { to_default, isSimulation } from "./state.js";

function downloadString(content, filename, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function createBodyRow(app, body, index) {
    let inputbuffer = app.editor.bodies;
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
        renderEditor(app);
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

function renderEditor(app) {
    const container = document.getElementById("body-panel");
    container.innerHTML = "";

    app.editor.bodies.forEach((body, i) => {
        const row = createBodyRow(app, body, i);
        container.appendChild(row);
    });

    // editor render when changes, save here
    localStorage.setItem("appsave", JSON.stringify(app));
}

export function setup_control_panel(app) {
    renderEditor(app);
    function sim() {
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
        localStorage.setItem("appsave", JSON.stringify(app));
    }
    document.getElementById("sim-start").addEventListener("click", () => {
        sim()
    });
    document.getElementById("sim-reset").addEventListener("click", () => {
        const confirmed = confirm("This will reset everything to the default state");
        if (confirmed) {
            to_default(app);
            sim();
        }
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

        renderEditor(app);
    });

    const inpshowlab = document.getElementById("cfg-show-lab");
    const inpshowgrid = document.getElementById("cfg-show-grid");
    const inpshowcoord = document.getElementById("cfg-show-coord");
    const inptimescale = document.getElementById("cfg-timescale");
    const inpdt = document.getElementById("cfg-dt");
    const inpeps = document.getElementById("cfg-eps");

    inpshowlab.checked = app.display.showLabels;
    inpshowgrid.checked = app.display.showGrid;
    inpshowcoord.checked = app.display.showCoord;
    inptimescale.value = app.display.timeScale;
    inpdt.value = app.editor.params.dt;
    inpeps.value = app.editor.params.eps;

    inpshowlab.addEventListener("input", () => {
        app.display.showLabels = inpshowlab.checked;
        localStorage.setItem("appsave", JSON.stringify(app));
    });
    inpshowgrid.addEventListener("input", () => {
        app.display.showGrid = inpshowgrid.checked;
        localStorage.setItem("appsave", JSON.stringify(app));
    });
    inpshowcoord.addEventListener("input", () => {
        app.display.showCoord = inpshowcoord.checked;
        localStorage.setItem("appsave", JSON.stringify(app));
    });
    inptimescale.addEventListener("input", () => {
        app.display.timeScale = inptimescale.value;
        localStorage.setItem("appsave", JSON.stringify(app));
    });
    let noticed = false;
    inpdt.addEventListener("input", () => {
        if (!noticed) {
            alert("Warning: changing dt too low can crash the browser.");
            noticed = true;
        }
        app.editor.params.dt = inpdt.value;
        localStorage.setItem("appsave", JSON.stringify(app));
    });
    inpeps.addEventListener("input", () => {
        app.editor.params.eps = inpeps.value;
        localStorage.setItem("appsave", JSON.stringify(app));
    });

    const modal = document.getElementById("modal");

    document.getElementById("sim-import").onclick = () => {
        modal.style.display = "flex";
    };

    document.getElementById("modal-import-close").onclick = () => {
        modal.style.display = "none";
    };
    document.getElementById("modal-import-x").onclick = () => {
        modal.style.display = "none";
    };

    function importSimJson(value) {
        console.log("JSON import: "+value);
        if (!value) { return; }
        let obj;
        try {
            obj = JSON.parse(value);
            if (!isSimulation(obj)) { return; }
            app.editor = obj;
            renderEditor(app);
        } catch (e) {
            alert("Parse error: " + e);
        }
    }
    document.getElementById("modal-import-ok").onclick = () => {
        const value = document.getElementById("json-text").value;
        importSimJson(value);
        modal.style.display = "none";
    };
    
    const fileinput = document.getElementById("import-filejson");
    document.getElementById("modal-import-json").onclick = () => {
        fileinput.click();
    }
    fileinput.addEventListener("change", async () => {
        const file = fileinput.files[0];
        if (!file) return;
        const text = await file.text();
        importSimJson(text);
        modal.style.display = "none";
    });

    document.getElementById("sim-export").onclick = () => {
        const json = JSON.stringify(app.simulation);
        const export_name = (prompt("Export name: ")??"data") + ".json";
        downloadString(
          json,
          export_name,
          "application/json"
        );
    }
}
