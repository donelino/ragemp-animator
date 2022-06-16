/**
 * Module: Animator
 * Author: Don_Elino
 */

class AnimatorClass {

	animations = require("./data.json").animations;
	files = require("fs");

	constructor() {
		console.log("Animator module was loaded!");
	}


	onAnimatorEvent = function(player, anim) {
		let animInfo = anim.split(' ');
        player.setOwnVariable("PLAYED_ANIMATION_GROUP", animInfo[0]);
        player.setOwnVariable("PLAYED_ANIMATION_NAME", animInfo[1]);
        player.stopAnimation();
        player.playAnimation(animInfo[0], animInfo[1], 1, 1);
	}

	onAnimationCommand = function(player, action, action2) {
		if (player.getOwnVariable("ANIMATOR_OPEN") == null) {
			player.setOwnVariable("ANIMATOR_OPEN", false);
		}
		
		let animatorOpen = player.getOwnVariable("ANIMATOR_OPEN");

		if (action == null)
        {
            if (!animatorOpen)
            {
                let animIndex = 0;
                let temp = [];
                this.animations.forEach(anim => {
					temp.push(anim);
                    animIndex++;

                    if (animIndex == 500)
                    {
                        player.call("AddAnimatorAnims", [JSON.stringify(temp)]);
                        animIndex = 0;
                        temp = [];
                    }
                });
                player.call("AddAnimatorAnims", [JSON.stringify(temp)]);

                player.setOwnVariable("ANIMATOR_OPEN", true);
            	player.call("StartClientAnimator", []);

                player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FFFFFF}Animator is now !{#00FF00}ON. !{#FFFFFF}Type !{#00FF00}/animator help !{#FFFFFF}for more options.`);
            }
            else
            {
                player.setOwnVariable("ANIMATOR_OPEN", null);
                player.call("StopClientAnimator", []);
                player.stopAnimation();
                player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FFFFFF}Animator is now !{#FF0000}OFF.`);
            }
        } else {
            if (animatorOpen)
            {
                if (action == "save") this.saveAnimatorData(player, action2);
                if (action == "skip") this.skipAnimatorData(player, action2);
                if (action == "help")
                {
                	player.outputChatBox(`=================================!{#AFAFAF}[ANIMATOR]================================`);
                	player.outputChatBox(`Use !{#FFFF00}LEFT !{#FFFFFF}and !{#FFFF00}RIGHT !{#FFFFFF}arrow keys to cycle through animations.`);
                	player.outputChatBox(`Use !{#FFFF00}UP !{#FFFFFF}and !{#FFFF00}DOWN !{#FFFFFF}arrow keys to cycle animations by one hundred instances.`);
                	player.outputChatBox(`You may also skip to a specific animation ID, just use !{#FFFF00}/animator skip [number].`);
                    player.outputChatBox(`If you wish to save your animations into .txt file, use !{#FFFF00}/animator save [savename].`);
                    player.outputChatBox(`!{#FFFFFF}Please remember that some animations are not meant to be used by peds, or`);
                    player.outputChatBox(`are meant to be used in specific circumstances, therefore !{#FF0000}may not work!`);
                }
                if(action == "stop")
                {
                	player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FFFFFF}Animation have been stopped.`);
                    player.stopAnimation();
                }
            } 
            else
            {
                player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FF0000}You have to launch the animator first! !{#FFFF00}/animator.`);
            }
        }
	}

	saveAnimatorData = function(player, name) {
		let anim_group = player.getOwnVariable("PLAYED_ANIMATION_GROUP");
        let anim_name = player.getOwnVariable("PLAYED_ANIMATION_NAME");
        files.appendFile("animations.txt", `${name}:          ${anim_group} ${anim_name}\r\n`, (err) => {
	        if (err) {
	            player.notify("~r~Error sending animation ~b~" + name + "!");
	        } else {
	            player.notify("Saved animation as ~b~" + name + "!");
	        }
	    });
        player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FF0000}Animation saved! Name: !{#00FF00}${name} !{#FFFFFF}Anim: !{#FFFF00}${anim_group} !{#00FF00}${anim_name}`);
	}

	skipAnimatorData = function(player, animationID) {
		let id = parseInt(animationID);
        if (id >= this.animations.length || id < 0)
        {
        	player.outputChatBox(`!{#AFAFAF}[ANIMATOR]: !{#FF0000}ID has to be between 0 and ${this.animations.length} !`);
            return;
        }
        player.call("SkipAnimatorData", [id]);
	}

}

Animator = new AnimatorClass();

mp.events.add("ANIMATOR_EVENT", (player, args) => Animator.onAnimatorEvent(player, args));
mp.events.addCommand("animator", (player, action = null, action2 = "Anim") => Animator.onAnimationCommand(player, action, action2));