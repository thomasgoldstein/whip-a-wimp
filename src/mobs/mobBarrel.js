"use strict";
//states: idle

waw.MobBarrel = waw.Enemy.extend({
    mobType: "Barrel",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 100,
    killable: false,
    state: "idle",

    ctor: function () {
        this._super();
        //console.info("MobBarrel ctor");

        this.setContentSize(32, 32);
        this.speed = 2+Math.random()*2;;

        var animData =
        {
            "idle_horizontal": {
                frameRects: [
                    cc.rect(1+35*0, 1+50*1, 32, 48)
                ],
                delay: 1+Math.random()*0.5
            },
            "idle_vertical": {
                frameRects: [
                    cc.rect(1+35*0, 1+50*0, 32, 48)
                ],
                delay: 1+Math.random()*0.5
            },
            "bounce_horizontal": {
                frameRects: [
                    cc.rect(1+35*1, 1+50*1, 32, 48),
                    cc.rect(1+35*0, 1+50*1, 32, 48),
                    cc.rect(1+35*1, 1+50*1, 32, 48),
                    cc.rect(1+35*2, 1+50*1, 32, 48)
                ],
                delay: 0.3+Math.random()*0.2
            },
            "bounce_vertical": {
                frameRects: [
                    cc.rect(1+35*1, 1+50*0, 32, 48),
                    cc.rect(1+35*0, 1+50*0, 32, 48),
                    cc.rect(1+35*1, 1+50*0, 32, 48),
                    cc.rect(1+35*2, 1+50*0, 32, 48)
                ],
                delay: 0.3+Math.random()*0.2
            }
        };
        animData["idle_horizontal"] = animData["bounce_horizontal"];

        this.sprite = new waw.AnimatedSprite(waw.gfx.barrel, animData);
        this.calcDirection(0, 0);
        this.sprite.playAnimation(this.state+"_"+this.direction);

        this.sprite.setPosition(0, this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
        this.shadowSprite.visible = false;  //no shadow
    },
    getTag: function(){
        if( this.state !== "idle")
            return TAG_ENEMY;
        return 0;
    },
    update: function () {

        this.conditions = this.getConditions();

        if (this.state !== "attack" && this.conditions.indexOf("canAttack") >= 0) {
            if(this.dx != 0 && this.dy != 0) {
                //console.log("mob Barrel attacks player0");
                this.state = "attack";
                this.stateSchedule = this.SCHEDULE_ATTACK;
                this.stateSchedule.reset();

                waw.player.onGetDamage(this);
            }
        }

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if (showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1) + "," + this.y.toFixed(1) + " DX:" + this.dx.toFixed(1) + ", DY" + this.dy.toFixed(1) +
            "\n" + this.mobType + " " + this.state + " " + this.subState + " " + this.direction);
        }
    },
    calcDirection: function (dx, dy) {
        if(dx != 0 && dy === 0)
            this.direction = "horizontal";
        else
            this.direction = "vertical";
    },
    pickAISchedule: function () {
        switch (this.state) {
            case "idle":
                if (Math.random() < 0.7) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else if (Math.random() < 0.3) {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
                }
                break;
            case "attack":
            case "follow":
            case "bounce":
                if (Math.random() < 0.3) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
                }
                break;
        }
    },
    initBounce: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 5500 + Math.random() * 5500;
        if(Math.random() < 0.5) {
            //horizontal
            this.dy = 0;
            if (Math.random() < 0.5)
                this.dx = this.speed;
            else
                this.dx = -this.speed;
        } else {
            //vertical
            this.dx = 0;
            if (Math.random() < 0.5)
                this.dy = this.speed;
            else
                this.dy = -this.speed;
        }
        this.calcDirection(this.dx, this.dy);
        this.sprite.playAnimation(this.state + "_" + this.direction);
        return true;
    },
    initIdle: function () {
        this.setLocalZOrder(250 - this.y - 32);
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
    initAttack: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 2500 + Math.random() * 50;
        return true;
    },
    onAttack: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
    },
    getVisualConditions: function (conditions) {
        //var playerBiggerRect = cc.rect(waw.player.x-16, waw.player.y- 8, waw.player.width + 16, waw.player.height + 16);
        if(cc.rectIntersectsRect(waw.player.collideRect(), this.collideRect())){
            conditions.push("canAttack");
        }
    },
/*    pickAISchedule: function () {
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
        this.stateSchedule.reset();
    },*/
    onGetDamage : function (killer) {
        var currentTime = new Date();
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
        this.timeToThink = currentTime.getTime() + 1500 + Math.random() * 1500;
    }
})
;