import k from "./kaplayctx.js";
import { makeSonic, makeRing, makeMotobug } from "./entities.js";
import { initControls, setInputEnabled } from "./controls.js";


// Load assets
k.loadSprite("chemical-bg", "sprites/chemical-bg.png");
k.loadSprite("platforms", "sprites/platforms.png");
k.loadSprite("sonic", "sprites/sonic.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
  },
});
k.loadSprite("ring", "sprites/ring.png", {
  sliceX: 16,
  SliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});
k.loadSprite("motobug", "sprites/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 30 },
  },
});
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");

//scenes
k.scene("main", () => {
  const mainManualObjects = [];
  const addMainManualObject = (comp) => {
    const obj = k.add(comp);
    mainManualObjects.push(obj);
    return obj;
  };

  const closeMainManual = () => {
    mainManualObjects.forEach((obj) => k.destroy(obj));
    mainManualObjects.length = 0;
  };

  const showMainManual = () => {
    if (mainManualObjects.length > 0) return;

    addMainManualObject([
      k.rect(1160, 520),
      k.pos(60, 90),
      k.anchor("topleft"),
      k.color(0, 0, 0),
      k.opacity(0.85),
    ]);

    addMainManualObject([
      k.text("Controls", { font: "mania", size: 56 }),
      k.pos(k.center().x, 150),
      k.anchor("center"),
    ]);

    addMainManualObject([
      k.text("Jump: Space, W, Up Arrow, Left Click", { font: "mania", size: 28 }),
      k.pos(k.center().x, 240),
      k.anchor("center"),
    ]);

    addMainManualObject([
      k.text("Air Duck: S, Down Arrow, Right Click", { font: "mania", size: 28 }),
      k.pos(k.center().x, 290),
      k.anchor("center"),
    ]);

    addMainManualObject([
      k.text("During the game, progress freezes while the manual is open.", { font: "mania", size: 24 }),
      k.pos(k.center().x, 340),
      k.anchor("center"),
    ]);

    const closeBtn = addMainManualObject([
      k.rect(180, 54),
      k.pos(k.center().x, 440),
      k.anchor("center"),
      k.color(180, 60, 60),
      k.area(),
    ]);

    addMainManualObject([
      k.text("Close", { font: "mania", size: 28 }),
      k.pos(k.center().x, 440),
      k.anchor("center"),
    ]);

    closeBtn.onClick(closeMainManual);
  };

  k.add([
    k.text("KAPLAY RUNNER", { font: "mania", size: 72 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 120),
  ]);

  k.add([
    k.text("Press Space or use Start button to begin", { font: "mania", size: 36 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 40),
  ]);

  k.add([
    k.text("Collect rings, bounce on enemies, and survive!", { font: "mania", size: 24 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 120),
  ]);

  const startButton = k.add([
    k.rect(260, 64),
    k.pos(k.center().x - 140, k.center().y + 240),
    k.anchor("center"),
    k.color(40, 120, 40),
    k.area(),
  ]);

  k.add([
    k.text("Start Game", { font: "mania", size: 28 }),
    k.anchor("center"),
    k.pos(k.center().x - 140, k.center().y + 240),
  ]);

  const manualButton = k.add([
    k.rect(260, 64),
    k.pos(k.center().x + 140, k.center().y + 240),
    k.anchor("center"),
    k.color(50, 50, 70),
    k.area(),
  ]);

  k.add([
    k.text("Show Controls", { font: "mania", size: 28 }),
    k.anchor("center"),
    k.pos(k.center().x + 140, k.center().y + 240),
  ]);

  startButton.onClick(() => k.go("game"));
  manualButton.onClick(showMainManual);
  k.onKeyPress("space", () => k.go("game"));
});

k.scene("game", () => {
  const bgPieceWidth = 1920 * 1.5; // width of the background sprite times the scale factor
  //   const bgPieces = [
  //     k.add([k.sprite("chemical-bg"),
  //      k.pos(0, 0),
  //      k.opacity(0.8),
  //      k.scale(1.5)]),
  //     k.add([
  //       k.sprite("chemical-bg"),
  //       k.pos(bgPieceWidth, 0),
  //       k.opacity(0.8),
  //       k.scale(1.5),
  //     ]),
  //   ];

  initControls();

  let gamePaused = false;
  const gameManualObjects = [];
  const addGameManualObject = (comp) => {
    const obj = k.add(comp);
    gameManualObjects.push(obj);
    return obj;
  };

  const hideGameManual = () => {
    gameManualObjects.forEach((obj) => k.destroy(obj));
    gameManualObjects.length = 0;
    if (sonic) {
      sonic.gravityScale = 1;
      sonic.isStatic = false;
    }
    gamePaused = false;
    setInputEnabled(true);
  };

  const showGameManual = () => {
    if (gameManualObjects.length > 0) return;
    gamePaused = true;
    setInputEnabled(false);
    if (sonic) {
      sonic.vel = k.vec2(0, 0);
      sonic.gravityScale = 0;
      sonic.isStatic = true;
    }

    addGameManualObject([
      k.rect(1160, 520),
      k.pos(60, 90),
      k.anchor("topleft"),
      k.color(0, 0, 0),
      k.opacity(0.85),
    ]);

    addGameManualObject([
      k.text("Controls", { font: "mania", size: 56 }),
      k.pos(k.center().x, 150),
      k.anchor("center"),
    ]);

    addGameManualObject([
      k.text("Jump: Space, W, Up Arrow, Left Click", { font: "mania", size: 28 }),
      k.pos(k.center().x, 240),
      k.anchor("center"),
    ]);

    addGameManualObject([
      k.text("Air Duck: S, Down Arrow, Right Click", { font: "mania", size: 28 }),
      k.pos(k.center().x, 290),
      k.anchor("center"),
    ]);

    addGameManualObject([
      k.text("The game freezes while this screen is open.", { font: "mania", size: 24 }),
      k.pos(k.center().x, 340),
      k.anchor("center"),
    ]);

    const closeBtn = addGameManualObject([
      k.rect(180, 54),
      k.pos(k.center().x, 440),
      k.anchor("center"),
      k.color(180, 60, 60),
      k.area(),
    ]);

    addGameManualObject([
      k.text("Close", { font: "mania", size: 28 }),
      k.pos(k.center().x, 440),
      k.anchor("center"),
    ]);

    closeBtn.onClick(hideGameManual);
  };

  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(1.5), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth, 0),
      k.scale(1.5),
      k.opacity(0.8),
    ]),
  ];

  k.setGravity(3100); // stronger gravity for more arcade feel
  let gameSpeed = 100; // initial game speed
  k.loop(1, () => {
    if (!gamePaused) {
      gameSpeed = Math.min(gameSpeed + 10, 400); // increase speed over time, max 400
    }
  });

  let score = 0;
  let scoreMultiplier = 0;
  const scoreText = k.add([
    k.text("Score: 0", { font: "mania", size: 48 }),
    k.pos(20, 20),
    k.z(2), // ensure score is on top
  ]);
  // Create platforms
  const platformsWidth = 2560;
  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(2)]),
    k.add([k.sprite("platforms"), k.pos(platformsWidth, 450), k.scale(2)]),
  ];

  const sonic = makeSonic(k.vec2(100, 550));
  sonic.setControls();
  sonic.setEvents();

  const tutorialButton = k.add([
    k.rect(170, 42),
    k.pos(1080, 24),
    k.anchor("topleft"),
    k.color(40, 40, 80),
    k.area(),
  ]);

  k.add([
    k.text("Controls", { font: "mania", size: 22 }),
    k.pos(1165, 45),
    k.anchor("center"),
  ]);

  tutorialButton.onClick(showGameManual);

  const ringCollectUI = sonic.add([
    k.text("", { font: "mania", size: 18 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(30, -10),
  ]);

  let distanceSinceLastSpawn = 0;

  k.onUpdate(() => {
    if (gamePaused) return;
    distanceSinceLastSpawn += gameSpeed * k.dt();
  });

  const spawnMotobug = () => {
    const motobug = makeMotobug(k.vec2(1280, 595));

    motobug.onUpdate(() => {
      if (gamePaused) return;
      motobug.move(-gameSpeed * 1.2, 0);
    });

    motobug.onExitScreen(() => {
      k.destroy(motobug);
    });
  };

  const spawnLoop = () => {
    if (gamePaused) {
      k.wait(0.1, spawnLoop);
      return;
    }

    const baseSpacing = Math.max(300, 600 - gameSpeed);

    const randomOffset = k.rand(-150, 150);

    const spacing = Math.max(250, baseSpacing + randomOffset);

    if (distanceSinceLastSpawn >= spacing) {
      spawnMotobug();
      distanceSinceLastSpawn = 0;

      if (k.rand(0, 1) > 0.8) {
        for (let i = 0; i < 2; i++) {
          k.wait(i * 0.25, spawnMotobug);
        }
      }

      if (k.rand(0, 1) > 0.9) {
        distanceSinceLastSpawn -= 200;
      }
    }

    k.wait(0.1, spawnLoop);
  };

  spawnLoop();

  const spawnRing = () => {
    if (gamePaused) {
      k.wait(0.1, spawnRing);
      return;
    }

    const heights = [610, 560, 500, 440];

    const y = k.choose(heights); // ✅ pick height

    const ring = makeRing(k.vec2(1280, y)); // ✅ create actual ring

    ring.onUpdate(() => {
      if (gamePaused) return;
      ring.move(-gameSpeed, 0);
    });

    ring.onExitScreen(() => {
      k.destroy(ring);
    });

    const waitTime = k.rand(0.5, 2);
    k.wait(waitTime, spawnRing);
  };

  spawnRing(); // start spawning rings
  sonic.onCollide("ring", (r) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(r);

    score++;
    scoreText.text = `Score: ${score}`;

    ringCollectUI.text = "+1";
    k.wait(1, () => (ringCollectUI.text = ""));
  });

  // static body for ground collision
  k.add([
    k.rect(2000, 300),
    k.opacity(0),
    k.pos(0, 641), // position it at the bottom of the screen
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  sonic.onCollide("motobug", (e) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(e);
      sonic.play("jump");
      sonic.jump(1400);
      scoreMultiplier += 1;
      score += 10 * scoreMultiplier;
      scoreText.text = `SCORE : ${score}`;

      if (scoreMultiplier === 1)
        ringCollectUI.text = `+${10 * scoreMultiplier}`;
      if (scoreMultiplier > 1) ringCollectUI.text = `x${scoreMultiplier}`;
      k.wait(1, () => {
        ringCollectUI.text = "";
      });
      return;
    }
    k.play("hurt", { volume: 0.5 });
    k.setData("current-score", score);
    k.go("gameover");
  });
  sonic.onGround(() => {
    scoreMultiplier = 0;
  });

  k.onUpdate(() => {
    if (gamePaused) return;
    //console.log(sonic.isGrounded());
    // Background

    bgPieces.forEach((bg) => {
      bg.move(-gameSpeed * 0.2, 0);

      if (bg.pos.x <= -bgPieceWidth) {
        bg.pos.x += bgPieceWidth * 2;
      }
    });

    // Platforms
    platforms.forEach((plat) => {
      plat.move(-gameSpeed, 0);

      if (plat.pos.x <= -platformsWidth) {
        plat.pos.x += platformsWidth * 2;
      }
    });
  });
}); // ✅ CLOSE the "game" scene

k.scene("gameover", () => {
  let bestScore = k.getData("best-score") || 0;
  const currentScore = k.getData("current-score") || 0;

  if (currentScore && bestScore < currentScore) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
  }

  k.add([
    k.text("GAME OVER", { font: "mania", size: 64 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 300),
  ]);

  k.add([
    k.text(`BEST SCORE: ${bestScore}`, {
      font: "mania",
      size: 32,
    }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y - 200),
  ]);
  k.add([
    k.text(`CURRENT SCORE : ${currentScore}`, {
      font: "mania",
      size: 32,
    }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y - 200),
  ]);
  k.wait(1, () => {
    k.add([
      k.text("Press Space to Play Again", {
        font: "mania",
        size: 32,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 170),
    ]);

    k.add([
      k.text("Press M or Click to Return to Menu", {
        font: "mania",
        size: 24,
      }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 230),
    ]);
  });
  k.onKeyPress("space", () => k.go("game"));
  k.onKeyPress("m", () => k.go("main"));
  k.onMousePress(() => k.go("main"));
});

// Start the game
k.go("main");
