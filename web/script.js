Module.onRuntimeInitialized = () => {
    Layout = {
        bodySize: Module._sizeof_body(),
        posOffset: Module._body_offset_pos(),
        velOffset: Module._body_offset_vel(),
        massOffset: Module._body_offset_mass(),
        immutableOffset: Module._body_offset_immutable(),
        xOffset: Module._vec2_offset_x(),
        yOffset: Module._vec2_offset_y()
    };
    const startbt = document.getElementById("sim-start");

    renderEditor();
    current_sim = startSimulation(current_bodies, currentSimParam.eps);
    startbt.addEventListener("click", () => {
        current_sim?.stop();
        currentSimParam = structuredClone(inputSimParam);
        current_bodies = structuredClone(inputbuffer);
        current_sim = startSimulation(current_bodies, currentSimParam.eps);
    });
};
