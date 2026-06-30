#pragma once

#include <cmath>
#include <cstddef>
#include <vector>

namespace sim {
constexpr double G = 6.6743e-11;
struct Vec2 {
  double x, y;
  Vec2() : x(0), y(0) {
  }
  Vec2(double _x, double _y) : x(_x), y(_y) {
  }
  Vec2 operator+(const Vec2 &other) const {
    return {x + other.x, y + other.y};
  }
  Vec2 &operator+=(const Vec2 &other) {
    x += other.x;
    y += other.y;
    return *this;
  }
  Vec2 &operator-=(const Vec2 &other) {
    x -= other.x;
    y -= other.y;
    return *this;
  }
  Vec2 operator-(const Vec2 &other) const {
    return {x - other.x, y - other.y};
  }
  Vec2 operator*(const double other) const {
    return {x * other, y * other};
  }
  Vec2 operator/(const double other) const {
    return {x / other, y / other};
  }
  friend Vec2 operator*(double s, const Vec2 &v) {
    return {s * v.x, s * v.y};
  }
  double mag2() const {
      return x*x + y*y;
  }
  double magnitude() const {
    return std::sqrt(this->mag2());
  }
};
struct Body {
  Vec2 pos;
  Vec2 vel;
  double mass;
  bool immutable;

  Vec2 gforce_due_to(const Body &other) const {
    Vec2 dispvec = other.pos - pos;
    double disp = dispvec.magnitude();
    return dispvec * ((G * mass * other.mass) / (disp * disp * disp));
  }
  /* with plummer softening */
  Vec2 gforce_due_to_eps(const Body &other, double eps) const {
    Vec2 dispvec = other.pos - pos;

    double softened = dispvec.mag2() + eps * eps;
    double invr3 = 1.0 / (std::sqrt(softened) * softened);

    return dispvec * (G * mass * other.mass * invr3);
  }
};

struct UniverseParam {
  double eps = 0.01;
};
class Universe {
private:
  std::vector<Body> bodies;
  UniverseParam parameters;

public:
  Universe(const std::vector<Body> &bodies, const UniverseParam &parameters)
      : bodies(bodies), parameters(parameters) {
  }
  Universe(std::vector<Body> &&bodies, UniverseParam &&parameters)
      : bodies(std::move(bodies)), parameters(parameters) {
  }

  Body *get_bodies_addr() {
    return bodies.data();
  }
  auto get_bodies_count() const {
    return bodies.size();
  }

  /* return a vector of forces to apply to corresponding indices */
  std::vector<Vec2> get_forces() const {
    std::vector<Vec2> forces(bodies.size());
    for (std::size_t i = 0; i < bodies.size(); ++i) {
      const auto &body = bodies[i];
      for (std::size_t j = i + 1; j < bodies.size(); ++j) {
        const auto &other = bodies[j];
        Vec2 force_12 = body.gforce_due_to_eps(other, parameters.eps);
        // set current
        forces[i] += force_12;
        forces[j] -= force_12;
      }
    }
    return forces;
  }

  /* Update velocity and position based on forces */
  void step(double dt) {
    std::vector<Vec2> forces = get_forces();
    // semi implicit euler integrator
    for (std::size_t i = 0; i < bodies.size(); ++i) {
      auto &body = bodies[i];
      auto force = forces[i];
      if (body.immutable) continue;
      body.vel += (force / body.mass) * dt;
      body.pos += body.vel * dt;
    }
  }
};
}; // namespace sim
