"use strict";
//states: idle walk attack
//conditions canAttack canWalk feelObstacle seePlayer seeItem

waw.MobKiwi = waw.MobRandomBouncer.extend({
    mobType: "Kiwi",
    shadowYoffset: 0,
    spriteYoffset: -12,
    HP: 1,
    state: "idle",

    ctor: function () {
        this._super();
        //console.info("MobKiwi ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 0.5+Math.random()*1;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "idle_up":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 1*50+1, 48, 48)
                    ],
                delay: 0.1
            },
            "idle_down":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 0*50+1, 48, 48)
                    ],
                delay: 0.1
            },
            "idle_left":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "idle_right":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1
            },
            "walk_up":
            {
                frameRects:
                    [
                        cc.rect(1*50+1, 1*50+1, 48, 48),
                        cc.rect(2*50+1, 1*50+1, 48, 48),
                        cc.rect(1*50+1, 1*50+1, 48, 48),
                        cc.rect(0*50+1, 1*50+1, 48, 48)
                    ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_down":
            {
                frameRects:
                    [
                        cc.rect(1*50+1, 0*50+1, 48, 48),
                        cc.rect(2*50+1, 0*50+1, 48, 48),
                        cc.rect(1*50+1, 0*50+1, 48, 48),
                        cc.rect(0*50+1, 0*50+1, 48, 48)
                    ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_left":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 3*50+1, 48, 48),
                        cc.rect(1*50+1, 3*50+1, 48, 48),
                        cc.rect(0*50+1, 3*50+1, 48, 48),
                        cc.rect(0*50+1, 2*50+1, 48, 48),
                        cc.rect(1*50+1, 2*50+1, 48, 48),
                        cc.rect(2*50+1, 2*50+1, 48, 48),
                        cc.rect(1*50+1, 2*50+1, 48, 48),
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "walk_right":
            {
                frameRects:
                    [
                        cc.rect(1*50+1, 2*50+1, 48, 48),
                        cc.rect(2*50+1, 2*50+1, 48, 48),
                        cc.rect(1*50+1, 2*50+1, 48, 48),
                        cc.rect(0*50+1, 2*50+1, 48, 48),
                        cc.rect(0*50+1, 3*50+1, 48, 48),
                        cc.rect(1*50+1, 3*50+1, 48, 48),
                        cc.rect(0*50+1, 3*50+1, 48, 48),
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1
            },
            "hurt_left":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "hurt_right":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1
            }
        };
        animData["follow_up"] = animData["walk_up"];
        animData["follow_right"] = animData["walk_right"];
        animData["follow_down"] = animData["walk_down"];
        animData["follow_left"] = animData["walk_left"];
        animData["bounce_up"] = animData["walk_up"];
        animData["bounce_right"] = animData["walk_right"];
        animData["bounce_down"] = animData["walk_down"];
        animData["bounce_left"] = animData["walk_left"];

        animData["attack_up"] = animData["walk_up"];
        animData["attack_right"] = animData["walk_right"];
        animData["attack_down"] = animData["walk_down"];
        animData["attack_left"] = animData["walk_left"];

        animData["hurt_up"] = animData["hurt_left"];
        animData["hurt_down"] = animData["hurt_right"];

        this.sprite = new waw.AnimatedSprite(s_Kiwi, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow32x16);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    calcDirection: function (dx, dy) {
        if (dx < 0)
            this.direction = "left";
        else if (dx > 0)
            this.direction = "right";
        else if (dy > 0)
            this.direction = "up";
        else if (dy < 0)
            this.direction = "down";
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