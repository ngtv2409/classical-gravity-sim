# Classical N-bodies gravity simulation (no collision)

https://ngtv2409.github.io/classical-gravity-sim

This is a static simulation with UI, session memory,
import/export configuration and rich display options ( not yet :) )

Because I am suck at frontend, especially the native web canvas API,
AI tools were used to assist the UI creating process (not extensively).

## A few details:

- Uses Web Assembly for computation hot loop
- Uses Plummer softening to prevent infinite force
- Uses Implicit Euler integtator (will be configurable in the future)
