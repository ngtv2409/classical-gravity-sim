#include "simulation.hpp"

#include <cstddef>
#include <cstdint>
#include <vector>
#include <emscripten.h>

using namespace sim;

namespace {
    Universe* g_universe = nullptr;
}

extern "C" {

EMSCRIPTEN_KEEPALIVE
void universe_init(const Body* bodies,
                   uint32_t count,
                   double eps)
{
    delete g_universe;

    UniverseParam params;
    params.eps = eps;

    g_universe = new Universe(
        std::vector<Body>(bodies, bodies + count),
        std::move(params));
}

EMSCRIPTEN_KEEPALIVE
void universe_destroy()
{
    delete g_universe;
    g_universe = nullptr;
}

EMSCRIPTEN_KEEPALIVE
int universe_exists()
{
    return g_universe != nullptr;
}

EMSCRIPTEN_KEEPALIVE
void universe_step(double dt)
{
    if (g_universe)
        g_universe->step(dt);
}

EMSCRIPTEN_KEEPALIVE
const Body* universe_bodies()
{
    return g_universe ? g_universe->get_bodies_addr() : nullptr;
}

EMSCRIPTEN_KEEPALIVE
uint32_t universe_body_count()
{
    if (!g_universe)
        return 0;

    return g_universe->get_bodies_count();
}

EMSCRIPTEN_KEEPALIVE
Body* bodies_alloc(uint32_t count)
{
    return new Body[count];
}

EMSCRIPTEN_KEEPALIVE
void bodies_free(Body* ptr)
{
    delete[] ptr;
}

EMSCRIPTEN_KEEPALIVE
uint32_t sizeof_vec2()
{
    return sizeof(Vec2);
}

EMSCRIPTEN_KEEPALIVE
uint32_t sizeof_body()
{
    return sizeof(Body);
}

EMSCRIPTEN_KEEPALIVE
uint32_t body_offset_pos()
{
    return offsetof(Body, pos);
}

EMSCRIPTEN_KEEPALIVE
uint32_t body_offset_vel()
{
    return offsetof(Body, vel);
}

EMSCRIPTEN_KEEPALIVE
uint32_t body_offset_mass()
{
    return offsetof(Body, mass);
}

EMSCRIPTEN_KEEPALIVE
uint32_t body_offset_immutable()
{
    return offsetof(Body, immutable);
}

EMSCRIPTEN_KEEPALIVE
uint32_t vec2_offset_x()
{
    return offsetof(Vec2, x);
}

EMSCRIPTEN_KEEPALIVE
uint32_t vec2_offset_y()
{
    return offsetof(Vec2, y);
}

} // extern "C"
