import k from "./kaplayctx";
import { initControls, consumeJump, consumeDuck } from "./controls.js";

export function makeSonic(position) {
  return k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(3),
    k.area(),
    k.anchor("center"),
    k.pos(position),
    k.body({ jumpForce: 1700 }),

    {
      setControls() {
        this.onUpdate(() => {
          const grounded = this.isGrounded();

          if (consumeJump() && grounded) {
           // console.log("JUMP ✅");
            this.play("jump");
            this.jump(1400);
            return;
          }

          if (consumeDuck() && !grounded) {
            //console.log("AIR DUCK ✅");
            this.play("jump");
            this.applyImpulse(k.vec2(0, 1200));
          }
        });
      },

      setEvents() {
        this.onGround(() => {
          this.play("run");
        });
      },
    },
  ]);
}

export function makeRing(position) {
    return k.add([
        k.sprite("ring",{anim:"spin"}),
        k.area(),
        k.scale(3),
        k.anchor("center"),
        k.pos(position),
        k.offscreen(),
        "ring",
    ]);
}

export function makeMotobug(position) {
    return k.add([
        k.sprite("motobug"),{ anim:"run" },
        k.area({shape: new k.Rect(k.vec2(-5, 0), 32, 32)}),
        k.scale(3),
        k.anchor("center"), 
        k.pos(position),
        k.offscreen(),
        "motobug",
    ]);
}

// export function makeSonic(position) {
//   return k.add([
//     k.sprite("sonic", { anim: "run" }),
//     k.scale(3),
//     k.area(),
//     k.pos(position),
//     k.body({ jumpForce: 1700 }),

//     {
//       grounded: false, // ✅ track grounded state manually

//       setControls() {
//         k.onButtonPress("jump", () => {
//           console.log("jump pressed, grounded:",this.isGrounded());

//           if (this.isGrounded()) {
//             console.log("JUMP TRIGGERED ✅");

//             this.play("jump");
//             this.jump();
//             k.play("jump", { volume: 0.5 });
//           }
//         });
//       },

//       setEvents() {
//         this.onGround(() => {
//           this.grounded = true;
//           this.play("run");
//         });

//         this.onUpdate(() => {
//           // If not touching ground this frame → airborne
//           if (!this.isGrounded()) {
//             this.grounded = false;
//           }
//         });
//       },
//     },
//   ]);
// }
