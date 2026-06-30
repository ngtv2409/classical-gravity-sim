function createBodyRow(body, index) {
    const div = document.createElement("div");
    div.className = "body-row";

    div.innerHTML = `
        <div class="field">
            <label>Name</label>
            <input class="name" value="${body.name}">
        </div>

        <div class="field">
            <label>X</label>
            <input class="x" type="number" value="${body.x}">
        </div>

        <div class="field">
            <label>Y</label>
            <input class="y" type="number" value="${body.y}">
        </div>

        <div class="field">
            <label>VX</label>
            <input class="vx" type="number" value="${body.vx}">
        </div>

        <div class="field">
            <label>VY</label>
            <input class="vy" type="number" value="${body.vy}">
        </div>

        <div class="field">
            <label>Mass</label>
            <input class="mass" type="number" value="${body.mass}">
        </div>

        <div class="field">
            <label>Radius</label>
            <input class="radius" type="number" value="${body.radius}">
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

    div.querySelector(".name").oninput = e => inputbuffer[index].name = e.target.value;
    div.querySelector(".x").oninput = e => inputbuffer[index].x = +e.target.value;
    div.querySelector(".y").oninput = e => inputbuffer[index].y = +e.target.value;
    div.querySelector(".vx").oninput = e => inputbuffer[index].vx = +e.target.value;
    div.querySelector(".vy").oninput = e => inputbuffer[index].vy = +e.target.value;
    div.querySelector(".mass").oninput = e => inputbuffer[index].mass = +e.target.value;
    div.querySelector(".radius").oninput = e => inputbuffer[index].radius = +e.target.value;
    div.querySelector(".color").oninput = e => inputbuffer[index].color = e.target.value;

    div.querySelector(".remove").onclick = () => {
        inputbuffer.splice(index, 1);
        renderEditor();
    };

    return div;
}

let inputbuffer = structuredClone(initialBodies);
function renderEditor() {
    const container = document.getElementById("body-panel");
    container.innerHTML = "";

    inputbuffer.forEach((body, i) => {
        const row = createBodyRow(body, i);
        container.appendChild(row);
    });
}

document.getElementById("sim-body-add").addEventListener("click", () => {
    inputbuffer.push({
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

    renderEditor();
});

