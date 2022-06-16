let CurrentAnimation = 0;
let Animations = [];
let AnimatorLaunched = false;
const player = mp.players.local;

mp.events.add({
    "StartClientAnimator": () => {
        if (!AnimatorLaunched) {
            AnimatorLaunched = true;
        }
    },
    "AddAnimatorAnims": (anims) => {
        Animations = Animations.concat(JSON.parse(anims));
    },
    "StopClientAnimator": () => {
        Animations = [];
        AnimatorLaunched = false;
    },
    "SkipAnimatorData": (skippedTo) => {
        if (skippedTo >= Animations.Count || skippedTo < 0) return;
        CurrentAnimation = skippedTo;
        mp.events.callRemote("ANIMATOR_EVENT", Animations[CurrentAnimation]);
    },
});

mp.events.add("render", function () {
    if (AnimatorLaunched && Animations.length > 0) {
        const AnimationInfo = Animations[CurrentAnimation];
        const Animation = AnimationInfo.split(' ');
        mp.game.graphics.drawText("Animation: ~n~" + "~g~[ " + CurrentAnimation + " ] ~y~" + Animation[0].toString() + " ~b~" + Animation[1].toString(), [0.5, 0.78], {
            font: 4,
            color: [255, 255, 255, 185],
            scale: [0.5, 0.5],
            outline: true
        });
    }
});

// RIGHT
mp.keys.bind(39, false, function () {
    if (!AnimatorLaunched) return;
    if (CurrentAnimation < Animations.length - 1) {
        CurrentAnimation++;
        PlayAnim();
    }
});

// LEFT
mp.keys.bind(37, false, function () {
    if (!AnimatorLaunched) return;
    if (CurrentAnimation > 0) {
        CurrentAnimation--;
        PlayAnim();
    }
});

// UP
mp.keys.bind(38, false, function () {
    if (!AnimatorLaunched) return;
    if (CurrentAnimation + 100 < Animations.length - 1) {
        CurrentAnimation += 100;
        PlayAnim();
    }
});

// DOWN
mp.keys.bind(40, false, function () {
    if (!AnimatorLaunched) return;
    if (CurrentAnimation - 100 > 0) {
        CurrentAnimation -= 100;
        PlayAnim();
    }
});

function PlayAnim() {
    mp.events.callRemote("ANIMATOR_EVENT", Animations[CurrentAnimation]);
}