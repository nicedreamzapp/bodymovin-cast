# People (realbody.js): licence and source

Every file in this folder is built only from CC0 assets. CC0 1.0 Universal means no rights reserved: free for any use, commercial included, no attribution required.

## Source

- **MPFB 2.0.18** (MakeHuman Plugin For Blender), official repository: https://github.com/makehumancommunity/mpfb2 (tag `v2.0.18`, commit d0a32e5).
  - Its `LICENSE.md` section C says the bundled assets are released under CC0 1.0 Universal: the base mesh and proxies, targets and modifiers, textures, clothes (MHCLO), rigs, poses and expressions, and mesh data. The full text is in `LICENSE.ASSETS.md`.
  - The same file, section D: "no output from MPFB contains any trace of program logic", so exports are the user's data, with no limitation.
  - The program code is GPLv3. None of it is shipped here; it only ran inside Blender to build the meshes.
- **MakeHuman system assets pack (CC0)**: http://files.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip
  - The pack's listing (https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html) marks every asset CC0 (author makehuman_system, source asset repo). That covers the items used here:
    - skin `young_caucasian_male`
    - eyes `low-poly` (brown)
    - eyebrows `eyebrow001`
    - hair `short02`
    - clothes `male_casualsuit06` (white t-shirt and jeans), `male_casualsuit05` (jacket and jeans, the snow kit)
    - shoes `shoes05`
- **Skeleton**: MPFB's built-in `game_engine` rig, 53 bones (Unreal-style names: pelvis, spine_01..03, clavicle, upperarm, lowerarm, hand, fingers, thigh, calf, foot, ball), with its bundled weights.

## Files

| file | what | triangles | textures | size |
|---|---|---|---|---|
| man_glass.glb | the whole body, no clothes, no textures (his see-through glass body) | LOD0 11,000, LOD1 3,900 | none | 0.15 MB |
| man.glb | clothed (coach and opponents): body with the parts under the clothes removed, t-shirt and jeans, trainers, hair, eyes, brows | LOD0 12,162, LOD1 3,532 | 1024 px | 1.8 MB |
| man_sport.glb / man_sport_t0.glb | sports kit: the same t-shirt, the jeans cut to shorts above the knee, white socks (a material on the lower leg), trainers; the body kept under the shorts and trimmed where fully covered (`export.py sport`) | LOD0 11,210, LOD1 3,234 | 1024 / 512 px | 2.5 / 0.9 MB |
| man_snow.glb / man_snow_t0.glb | snow kit: `male_casualsuit05` (CC0) worn as a snow jacket and snow pants (plain colours), dark gloves (a material on the hands), dark boots, a helmet (own dome geometry on the head bone) (`build_human.py male male_casualsuit05`, `export.py snow`) | LOD0 12,034, LOD1 4,475 | 1024 / 512 px | 1.86 / 0.76 MB |
| man_t0.glb | the same as man.glb, for tier 0 | LOD0 12,162, LOD1 3,532 | 512 px | 0.7 MB |

All three files use EXT_meshopt_compression (three.js `MeshoptDecoder`, vendored at `three/addons/libs/meshopt_decoder.module.js`). The skeleton is the same in all of them.

## Rebuilding

The build runs with Blender 4.2 on the command line, using an isolated user directory so it never touches Blender's own settings.

1. Install MPFB from the zip of `src/mpfb` with `blender -c extension install-file -r user_default`. Copy the CC0 pack's `data/*` into the extension's user data folder.
2. Run the build scripts:
   - `build_human.py male`: macro gender 1, age 0.5, muscle 0.62, weight 0.5, height 0.62, proportions 0.6; the skin, the rig and the clothes above.
   - `export.py clothed|glass`: applies the shape keys, bakes the clothes masks (clothed only), decimates (collapse, X-symmetric) to the budgets, triangulates and exports a GLB.
3. Pack the GLBs with `pack.mjs` (gltf-transform): opaque textures to JPEG and alpha textures to PNG at 1024 or 512 px, then meshopt.

The scripts live in `~/rb-work/scripts` and `~/rb-work/node` on the build machine. Copies are in `bodymovin/tests/realbody/build/`.
