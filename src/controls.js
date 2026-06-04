import k from "./kaplayctx.js";

const inputState = {
  jump: false,
  duck: false,
};
let inputEnabled = true;

export function initControls() {
  // Keyboard: Jump
  k.onKeyPress("space", () => {
    if (!inputEnabled) return;
    inputState.jump = true;
  });
  k.onKeyPress("w", () => {
    if (!inputEnabled) return;
    inputState.jump = true;
  });
  k.onKeyPress("up", () => {
    if (!inputEnabled) return;
    inputState.jump = true;
  });
  k.onKeyPress("arrowup", () => {
    if (!inputEnabled) return;
    inputState.jump = true;
  });

  // Keyboard: Air duck
  k.onKeyPress("s", () => {
    if (!inputEnabled) return;
    inputState.duck = true;
  });
  k.onKeyPress("down", () => {
    if (!inputEnabled) return;
    inputState.duck = true;
  });
  k.onKeyPress("arrowdown", () => {
    if (!inputEnabled) return;
    inputState.duck = true;
  });

  // Mouse: left click jump
  k.onMousePress(() => {
    if (!inputEnabled) return;
    inputState.jump = true;
  });

  // Mouse: right click duck
  window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  window.addEventListener("mousedown", (event) => {
    if (!inputEnabled) return;
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

export function setInputEnabled(enabled) {
  inputEnabled = enabled;
  if (!enabled) {
    inputState.jump = false;
    inputState.duck = false;
  }
}
