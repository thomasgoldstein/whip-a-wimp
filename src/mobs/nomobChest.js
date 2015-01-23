"use strict";
//states: idle 

waw.NoMobChest = waw.Enemy.extend({
    mobType: "Chest",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 5,
    state: "idle",

    ctor: function () {
        this._super();
        //console.info("Chest ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 0;
        this.direction = "down";

        
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "idle_down":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 0*50+1, 48, 48)
                    ],
                delay: 0.1
            },
            "hurt_down":
            {
                frameRects:
                    [
                        cc.rect(0*50+1, 2*50+1, 48, 48)
                    ],
                delay: 0.1
            }
        };

        animData["attack_down"] = animData["hurt_down"];

        this.sprite = new cc.Sprite(s_Chest, new cc.rect(0, 0, 32, 24));
        this.calcDirection(0,0);
        //this.sprite.playAnimation(this.state+"_"+this.direction);

        this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow32x16);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);

        //this.setZOrder(250 - this.y);
    },
    calcDirection: function (dx, dy) {
            this.direction = "down";
    },
    update: function () {
        var currentTime = new Date();

        this.conditions = this.getConditions();

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if(showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1)+","+this.y.toFixed(1)+" DX:"+this.dx.toFixed(1)+", DY"+this.dy.toFixed(1)+
            "\n"+this.mobType+" "+this.state+" "+this.subState+" "+this.direction );
        }
    },
    initIdle: function () {
        var currentTime = new Date();

        this.timeToThink = currentTime.getTime() + 100 + Math.random() * 500;
        this.targetX = this.targetY = 0;
        var x, y;

        //this.sprite.playAnimation(this.state+"_"+this.direction);
        return true;
    },
    onIdle: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
    },
    pickAISchedule: function () {
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
        this.stateSchedule.reset();
    },
    initHurt: function () {
        var currentTime = new Date();
        //stop
        this.timeToThink = currentTime.getTime() + 350 + Math.random() * 50;

        //this.sprite.playAnimation("hurt_"+this.direction);
        return true;
    },
    onHurt: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
    },

    onDeath : function (killer) {
        if (this.subState === "dead")
            return;
        this.unscheduleAllCallbacks();
        this.subState = "dead";
        this.sprite.opacity = 255;
        this.shadowSprite.opacity = 255;

        //this.sprite.playAnimation("hurt_" + this.direction);
        this.scheduleOnce(function () {
            cc.audioEngine.playEffect(this.sfx_dead);
            this.sprite.setAnchorPoint(0.5, 1);
            this.sprite.rotation = 180;
            this.sprite.runAction(new cc.FadeOut(1));
            this.sprite.runAction(new cc.ScaleTo(1, 0.7));
            this.shadowSprite.runAction(new cc.FadeOut(0.7));
            this.shadowSprite.runAction(new cc.ScaleTo(0.7, 0.5));
        }, 0.6);

        if (killer) {
            //mob.sprite.visible = false;
            //console.log("Mob "+mob.mobType+"'s touch");
        }

        //clear from this 1. local room foes 2. global room 3. local units - collision check
        for (var n = 0; n < waw.foes.length; n++) {
            var m = waw.foes[n];
            if (this === m) {
                waw.foes[n] = null;
                waw.units[200 + n] = null;
                currentRoom.mobs[n] = null;
                break;
            }
        }
    }


});
