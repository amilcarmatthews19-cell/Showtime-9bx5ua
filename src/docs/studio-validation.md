# Showtime validation checklist

## Devices
- Android Chrome at 360 × 800: bottom sheet snaps correctly; Create, Inspector and Settings remain reachable; Export stays in the header.
- Desktop 1024 × 768 and high-DPI 1920 × 1080: docked panes fit without horizontal scroll; canvas uses available center space.
- Touch: one finger pans, two fingers orbit and pinch zoom. Mouse: right-drag orbits, left-drag pans, wheel zooms.
- W/E/R select Move/Rotate/Scale; Space restores orbit interaction; Home resets camera; O toggles all articulated parts; L switches light.

## Generation and references
- Test all five procedural object families with low/high complexity, roundness and detail.
- Draw a scale box and set its width in meters. Procedural width is Z, height Y, depth X.
- Validate JSON notes: reject negative, nonnumeric or >100 m dimensions; retain previous dimensions when notes contain unrelated metadata.
- Verify failed generation releases busy state and leaves the previous version intact.
- Hunyuan helper supports single-image geometry. Text generation, multiview, text-driven refinement and sophisticated reconstruction need your own configured SHOWTIME_GENERATOR CLI.
- Fused geometry cannot become independently articulated parts by naming alone. Accurate pivots require separated meshes or calibrated Blender construction.

## Import and export
- Import GLB and glTF with BIN/textures, including Draco/Meshopt samples. Draco decoder downloads require network access.
- Imported named pivot groups should not create duplicate controls for their child panels.
- Browser model budgets: 80 MB transfer, optionally 1.5M vertices; external glTF resource URLs blocked.
- Reimport exported GLB/glTF and compare materials, hierarchy, skeletons and existing animation clips.
- OBJ ZIP includes OBJ, MTL and available color textures; PBR conversion is approximate.
- STL is geometry only and uses unitless meter-valued coordinates. For millimeter slicers apply ×1000; watertightness is not automatically certified.
- FBX requires installed Blender and a configured local/MCP export bridge; it is not a browser-native fake export.
- Verify selected-part export, reset-to-closed and current-pose export. Skinned subtrees may require whole-skeleton export.
- PNG alpha hides showroom floor/pedestal; JPG is opaque. Capture budgets cap images at 4096 px and 8M pixels.

## Persistence, sharing and safety
- Reload the browser and open imported assets from IndexedDB; thumbnails and the last 20 versions persist locally.
- Reference images remain in-session unless included in a JSON export. Export portable files before clearing browser storage.
- Open a share link in another browser: read-only snapshot, saved camera and theme. Links are self-contained and limited to 180K encoded characters; large models need file sharing.
- Check first-launch tour and persistent Help replay. Daily curved-chair badge persists on the device.
- Reduced-motion mode disables confetti. Slow Android rendering lowers DPR; background tabs stop rendering.
- Frame rate and temperature are not guaranteed: browsers cannot access device thermal sensors.
- Health checks report actual bridge responses. Request failures must not silently substitute procedural geometry.
- On HTTPS use HTTPS/WSS or a secure tunnel. Plain HTTP/WS works only from a locally served HTTP studio.
- Set explicit CORS_ORIGINS and keep the unauthenticated bridge on a trusted private LAN. Do not publish it directly.

These are manual acceptance checks, not a record of device or GPU tests already executed.
