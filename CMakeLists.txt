cmake_minimum_required(VERSION 3.20)

project(Simulation LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(EMSCRIPTEN)

    add_executable(sim_wasm
        wasm/exports.cpp
    )
    target_include_directories(sim_wasm PUBLIC ${CMAKE_SOURCE_DIR}/sim)

    target_link_options(sim_wasm PRIVATE

        "-O3"

        "-sEXPORTED_FUNCTIONS=['_universe_init','_universe_destroy','_universe_exists','_universe_step','_universe_bodies','_universe_body_count','_bodies_alloc','_bodies_free','_sizeof_vec2','_sizeof_body','_body_offset_pos','_body_offset_vel','_body_offset_mass','_body_offset_immutable','_vec2_offset_x','_vec2_offset_y']"

        "-sWASM=1"

        "-sALLOW_MEMORY_GROWTH=1"

        "-sENVIRONMENT=web"
    )

    set_target_properties(sim_wasm PROPERTIES
        SUFFIX ".js"
    )

    # Copy frontend files
    add_custom_target(copyasset ALL

        COMMAND ${CMAKE_COMMAND} -E copy_directory
            ${CMAKE_SOURCE_DIR}/web/.
            ${CMAKE_CURRENT_BINARY_DIR}
    )

endif()
