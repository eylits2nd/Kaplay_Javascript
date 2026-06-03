import k from "./kaplayctx.js";

const inputState = {
  jump: false,
  duck: false,
};

export function initControls() {
  // Keyboard: Jump
  k.onKeyPress("space", () => {
    inputState.jump = true;
  });
  k.onKeyPress("w", () => {
    inputState.jump = true;
  });
  k.onKeyPress("up", () => {
    inputState.jump = true;
  });
  k.onKeyPress("arrowup", () => {
    inputState.jump = true;
  });

  // Keyboard: Air duck
  k.onKeyPress("s", () => {
    inputState.duck = true;
  });
  k.onKeyPress("down", () => {
    inputState.duck = true;
  });
  k.onKeyPress("arrowdown", () => {
    inputState.duck = true;
  });

  // Mouse: left click jump
  k.onMousePress(() => {
    inputState.jump = true;
  });

  // Mouse: right click duck
  window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  window.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
      inputState.duck = true;
    }
  });
}

export function consumeJump() {
  if (inputState.jump) {
    inputState.jump = false;
    return true;
  }
  return false;
}

export function consumeDuck() {
  if (inputState.duck) {
    inputState.duck = false;
    return true;
  }
  return false;
}
