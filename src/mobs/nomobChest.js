"use strict";
//states: idle 

waw.NoMobChest = waw.Enemy.extend({
    mobType: "Chest",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 2,
    state: "idle",
    sfx_hurt: sfx_Punch01,
    sfx_dead: sfx_Candelabre01,
    topSprite: null,

    ctor: function () {
        this._super();
        //console.info("Chest ctor");

        this.setContentSize(16, 16);



        this.sprite = new cc.Sprite(s_Chest, new cc.rect(0, 5, 32, 24));
        this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);

        this.topSprite = new cc.Sprite(s_Chest, new cc.rect(33, 0, 32, 15));
        this.topSprite.setAnchorPoint(0, 0);
        this.topSprite.setPosition(0, 24-10);
        this.sprite.addChild(this.topSprite, 1);

        this.addChild(this.sprite);

        this.debugCross.setAnchorPoint(0.5, 0);

        this.shadowSprite = new cc.Sprite(s_Shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
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
        this.timeToThink = currentTime.getTime() + 350 + Math.random() * 50;
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

        if(Math.random()<0.5){
        this.scheduleOnce(function () {
            cc.audioEngine.playEffect(this.sfx_dead);
            this.topSprite.runAction(new cc.MoveTo(0.2, 0, 24));
        }, 0.6);
        this.scheduleOnce(function () {
            this.topSprite.setZOrder(-1);
            cc.audioEngine.playEffect(this.sfx_hurt);
            this.topSprite.runAction(new cc.MoveTo(0.2, -2+Math.random()*4, 3));
        }, 0.8);
        } else {
            this.scheduleOnce(function () {
                cc.audioEngine.playEffect(this.sfx_dead);
                this.topSprite.runAction(new cc.MoveTo(0.2, -2+Math.random()*4, -3));
                this.topSprite.runAction(new cc.RotateBy(0.4, -5+Math.random()*10));
            }, 0.6);
        }

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
