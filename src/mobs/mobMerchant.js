"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobMerchant = waw.MobRandomWalker.extend({
    mobType: "Merchant",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 2,
    state: "idle",
    sfx_hurt01: waw.sfx.merchHurt01,
    sfx_hurt02: waw.sfx.merchHurt02,
    sfx_death: waw.sfx.merchDeath,
    
    ctor: function () {
        this._super();
        //console.info("MobMerchant ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "walk_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48),
                        cc.rect(1+34*2, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.3
            },
            "walk_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48),
                        cc.rect(1+34*2, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "walk_up_right":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 0+50*1, 32, 48),
                        cc.rect(1+34*1, 0+50*1, 32, 48),
                        cc.rect(1+34*2, 0+50*1, 32, 48),
                        cc.rect(1+34*1, 0+50*1, 32, 48)
                    ],
                delay: 0.3
            },
            "walk_up_left":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48),
                        cc.rect(1+34*2, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "attack_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48),
                        cc.rect(1+34*2, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.1
            },
            "attack_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48),
                        cc.rect(1+34*2, 1+50*0, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "attack_up_right":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48),
                        cc.rect(1+34*2, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48)
                    ],
                delay: 0.1
            },
            "attack_up_left":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48),
                        cc.rect(1+34*2, 1+50*1, 32, 48),
                        cc.rect(1+34*1, 1+50*1, 32, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "rolling_down":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1+50*0, 32, 48),
                        cc.rect(1+34*0, 1+50*0, 32, 48)
                    ],
                delay: 2,
                mirrorX: true
            },
            "rolling_up":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1+50*1, 32, 48),
                        cc.rect(1+34*0, 1+50*1, 32, 48)
                    ],
                delay: 2,
                mirrorX: true
            },
            "hurt_down_right":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*2, 32, 48),
                        cc.rect(1+34*0, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.15
            },
            "hurt_down_left":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*2, 32, 48),
                        cc.rect(1+34*0, 1+50*2, 32, 48),
                        cc.rect(1+34*1, 1+50*0, 32, 48)
                    ],
                delay: 0.15,
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

        animData["idle_up_left"] = animData["rolling_up"];
        animData["idle_up_right"] = animData["rolling_up"];
        animData["idle_down_left"] = animData["rolling_down"];
        animData["idle_down_right"] = animData["rolling_down"];

        animData["hurt_up_left"] = animData["hurt_down_left"];
        animData["hurt_up_right"] = animData["hurt_down_right"];


        this.sprite = new waw.AnimatedSprite(waw.gfx.merchant, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
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