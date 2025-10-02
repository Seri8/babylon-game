window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera", -Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene
    );
    camera.attachControl(canvas, true);

    // Light
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Ground
    BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

    // Player (sphere)
    const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
    player.position.y = 0.5;

    // Target (rotating box)
    const target = BABYLON.MeshBuilder.CreateBox("target", { size: 1.2 }, scene);
    target.position.set(2, 0.6, 2);

    // Movement
    const inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyDownTrigger, evt => inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown"
    ));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger, evt => inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown"
    ));

    scene.onBeforeRenderObservable.add(() => {
      const speed = 0.1;
      if (inputMap["ArrowUp"]) player.position.z -= speed;
      if (inputMap["ArrowDown"]) player.position.z += speed;
      if (inputMap["ArrowLeft"]) player.position.x -= speed;
      if (inputMap["ArrowRight"]) player.position.x += speed;

      // Rotate target
      target.rotation.y += 0.02;

      // Simple collision check
      if (player.intersectsMesh(target, false)) {
        target.material = new BABYLON.StandardMaterial("hitMat", scene);
        target.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      }
    });

    return scene;
  };

  const scene = createScene();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
});
