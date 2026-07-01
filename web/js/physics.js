let Module
let Layout;

export function initPhysics(mod) {
    Module = mod;
    Layout = Object.freeze({
        bodySize: Module._sizeof_body(),
        posOffset: Module._body_offset_pos(),
        velOffset: Module._body_offset_vel(),
        massOffset: Module._body_offset_mass(),
        immutableOffset: Module._body_offset_immutable(),
        xOffset: Module._vec2_offset_x(),
        yOffset: Module._vec2_offset_y()
    });
}

export function getLay() {
    return Layout;
}

export function initUniverse(bodies, eps = 0.01) {
    const ptr = Module._bodies_alloc(bodies.length);

    bodies.forEach((body, i) => {
        const base = ptr + i * Layout.bodySize;

        Module.HEAPF64[(base + Layout.posOffset + Layout.xOffset) >> 3] = body.x;
        Module.HEAPF64[(base + Layout.posOffset + Layout.yOffset) >> 3] = body.y;

        Module.HEAPF64[(base + Layout.velOffset + Layout.xOffset) >> 3] = body.vx;
        Module.HEAPF64[(base + Layout.velOffset + Layout.yOffset) >> 3] = body.vy;

        Module.HEAPF64[(base + Layout.massOffset) >> 3] = body.mass;

        Module.HEAPU8[base + Layout.immutableOffset] = body.immutable ? 1 : 0;
    });

    Module._universe_init(ptr, bodies.length, eps);
    Module._bodies_free(ptr);
}

export function stepUniverse(dt) {
    Module._universe_step(dt);
}

export function getBodies() {
    const ptr = Module._universe_bodies();
    const count = Module._universe_body_count();
    return Array.from(
        { length: count },
        (_, k) => ptr + k * Layout.bodySize
    );
}

export function getPos(base) {
    const x = Module.HEAPF64[(base + Layout.posOffset + Layout.xOffset) >> 3];
    const y = Module.HEAPF64[(base + Layout.posOffset + Layout.yOffset) >> 3];
    return [x, y];
}
