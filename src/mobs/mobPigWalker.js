"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobPigWalker = waw.MobRandomWalker.extend({
    mobType: "PigWalker",
    shadowYoffset: 4,
    spriteYoffset: -4,
    HP: 3,
    state: "idle",
    ctor: function () {
        this._super();
        //console.info("MobPigWalker ctor");
        this.setContentSize(16, 16);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "walk_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48)
                    ],
                delay: 0.2
            },
            "walk_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48)
                    ],
                delay: 0.2,
                flippedX: true
            },
            "walk_up_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48)
                    ],
                delay: 0.2
            },
            "walk_up_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48)
                    ],
                delay: 0.2,
                flippedX: true
            },
            "idle_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48)
                    ],
                delay: 0.5
            },
            "idle_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48),
                        cc.rect(1+50*1, 1, 48, 48)
                    ],
                delay: 0.5,
                flippedX: true
            },
            "idle_up_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48)
                    ],
                delay: 0.5
            },
            "idle_up_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48),
                        cc.rect(1+50*1, 1+50*1, 48, 48)
                    ],
                delay: 0.5,
                flippedX: true
            },
            "attack_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48)
                    ],
                delay: 0.1
            },
            "attack_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1, 48, 48),
                        cc.rect(1+50*2, 1, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "attack_up_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48)
                    ],
                delay: 0.1
            },
            "attack_up_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*1, 48, 48),
                        cc.rect(1+50*2, 1+50*1, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "hurt_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*0, 48, 48),
                        cc.rect(1+50*0, 1+50*2, 48, 48),
                        cc.rect(1+50*1, 1+50*2, 48, 48),
                        cc.rect(1+50*1, 1+50*2, 48, 48)
                    ],
                delay: 0.1
            },
            "hurt_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+50*0, 1+50*0, 48, 48),
                        cc.rect(1+50*0, 1+50*2, 48, 48),
                        cc.rect(1+50*1, 1+50*2, 48, 48),
                        cc.rect(1+50*1, 1+50*2, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            }
        };
        animData["follow_up_left"] = animData["walk_up_left"];
        animData["follow_up_right"] = animData["walk_up_right"];
        animData["follow_down_left"] = animData["walk_down_left"];
        animData["follow_down_right"] = animData["walk_down_right"];
        animData["bounce_up_left"] = animData["walk_up_left"];
        animData["bounce_up_right"] = animData["walk_up_right"];
        animData["bounce_down_left"] = animData["walk_down_left"];
        animData["bounce_down_right"] = animData["walk_down_right"];

        animData["hurt_up_left"] = animData["hurt_down_left"];
        animData["hurt_up_right"] = animData["hurt_down_right"];

        this.sprite = new waw.AnimatedSprite(s_Pig, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.state+"_"+this.direction);

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow32x16);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    update: function () {
        var currentTime = new Date();
        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.conditions.indexOf("canAttack")>=0) {
            console.log("mob attacks player0");
            this.state = "attack";
            this.stateSchedule = this.SCHEDULE_ATTACK;
            this.stateSchedule.reset();

            waw.player.onGetDamage(this);
        }

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if(showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1)+","+this.y.toFixed(1)+" DX:"+this.dx.toFixed(1)+", DY"+this.dy.toFixed(1)+
            "\n"+this.mobType+" "+this.state+" "+this.subState+" "+this.direction );
        }
    }
})
;