"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobBat = waw.MobRandomWalker.extend({
    mobType: "Bat",
    shadowYoffset: 4,
    spriteYoffset: 24,
    HP: 1,
    state: "idle",
    sfx_hurt01: sfx_MerchHurt01,
    sfx_hurt02: sfx_MerchHurt02,
    sfx_death: sfx_Ouch03,

    ctor: function () {
        this._super();

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 3+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "idle":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1, 32, 24)
                    ],
                delay: 5+Math.random()*2
            },
            "walk":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24),
                        cc.rect(1+34*3, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24)
                    ],
                delay: 0.07
            },
            "hurt":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24)
                    ],
                delay: 0.1
            }
        };
        animData["follow"] = animData["walk"];
        animData["attack"] = animData["hurt"];

        this.sprite = new waw.AnimatedSprite(s_Bat, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow12x6);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    getAnimationName: function() {
        return this.state;
    },
    getAnimationNameHurt: function() {
        return "hurt";
    },
    getVisualConditions: function (conditions) {
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        if (cc.pDistanceSQ(pPos, pos) < 1000) {
            conditions.push("seeEnemy");
            if (cc.pDistanceSQ(pPos, pos) < 300) {
                conditions.push("canAttack");
            }

        }
    },
    update: function () {
        var currentTime = new Date();

        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.conditions.indexOf("canAttack")>=0) {
            console.log("mob attacks player 0b");
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