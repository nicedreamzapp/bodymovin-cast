# Wolf Strike: pictures, models and motion

All original to Body Movin' or open-licensed. No art, sprite, name or sound from the 1987 arcade game is used.

- Motion capture: every soldier, medic, kid and hostage moves with real captured human motion from the CMU Graphics Lab
  Motion Capture Database (http://mocap.cs.cmu.edu), free to use: "The data used in this project was obtained from
  mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217." Takes used: 09_01 (run), 02_01 (walk),
  139_19 (wounded walk), 136_09 (crouched walk), 80_03 and 79_96 (aiming and shooting a gun), 139_09 (ducking),
  90_16 and 90_18 (falls), 13_26 (waving). Converted to joint positions by bodymovin/tests/wolfstrike/mocap_build.py into
  bodymovin/wolfstrike/mocap.json.
- People: the realbody.js MakeHuman / MPFB bodies (CC0, see assets/people/LICENSE.md), dressed per role in code.
- Sky, lighting and backdrop photos (CC0, Poly Haven, polyhaven.com): dikhololo_sunset, lush_dirt_path, resting_place_2,
  pump_station, kloofendal_28d_misty, derelict_airfield_01 (assets/hdri, assets/backdrops).
- Scanned textures (CC0, Poly Haven): forest_leaves_02, forest_ground_04, brown_mud_leaves_01, coast_sand_01, dry_ground_01,
  gravel_road, asphalt_02, bark_brown_02, bamboo_wall, corrugated_iron_02, concrete_wall_006, box_profile_metal_sheet,
  lichen_rock, leafy_grass, sparse_grass, withered_grass (the grass cover under the blades), green_metal_rust (vehicle paint)
  (assets/textures), plus the kit's existing hessian_230, weathered_planks, metal_plate, blue_metal_plate.
- Scanned models (CC0, Poly Haven), decimated and meshopt-compressed with gltfpack into assets/wolfstrike/models:
  island_tree_01/02/03, shrub_02/04, pachira_aquatica_01, fern_02, grass_medium_01/02, boulder_01, rock_moss_set_01,
  dead_tree_trunk, tree_stump_01, concrete_road_barrier, wooden_military_crate, old_military_crate, ammo_box, barrel_03,
  metal_jerrycan_green, old_tyre, propane_tank.
- Vehicles (wolfstrike/vehicles.js): no realistic free CC0/CC-BY model of a military cargo truck, wheeled armoured car,
  river patrol boat or gunship was available to download without an account (Poly Haven has none; Kenney and Quaternius
  are stylised), so each is modelled in code in the scanned materials above, on the scanned old_tyre.
- Your arms: the same CC0 MakeHuman soldier body (assets/people), in jacket and gloves, posed on the gun every frame.
- Built in code: buildings, radio mast, watchtowers, fence, transport plane, rifles, the submachine gun, pickups, smoke,
  dust, fire and the grass clumps.
- Sounds: assets/sfx/wolfstrike/CREDITS.md.
