"use strict";
//states: idle

waw.MobSpikes = waw.Enemy.extend({
    mobType: "Spikes",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 100,
    state: "idle",

    ctor: function () {
        this._super();
        //console.info("MobSpikes ctor");

        this.setContentSize(32, 28);
        this.speed = 0;

        var animData =
        {
            "idle": {
                frameRects: [
                    cc.rect(1+34*0, 1, 32, 32),
                    cc.rect(1+34*1, 1, 32, 32),
                    cc.rect(1+34*2, 1, 32, 32),
                    cc.rect(1+34*1, 1, 32, 32)
                ],
                delay: 0.3+Math.random()*0.2
            }
        };

        this.sprite = new waw.AnimatedSprite(s_Spikes, animData);
        this.calcDirection(0, 0);
        this.sprite.playAnimation(this.state);

        this.sprite.setPosition(0, this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
        this.shadowSprite.visible = false;  //no shadow
    },
    update: function () {

        this.conditions = this.getConditions();

        if (this.state !== "attack" && this.conditions.indexOf("canAttack") >= 0) {
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

        if (showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1) + "," + this.y.toFixed(1) + " DX:" + this.dx.toFixed(1) + ", DY" + this.dy.toFixed(1) +
            "\n" + this.mobType + " " + this.state + " " + this.subState + " " + this.direction);
        }
    },
    calcDirection: function (dx, dy) {
        this.direction = "idle";
    },
    initIdle: function () {
        this.setZOrder(250 - this.y - 27);
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
        this.timeToThink = currentTime.getTime() + 1000 + Math.random() * 50;
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
        //var pPos = waw.player.getPosition();
        //var pos = this.getPosition();
        //if (cc.pDistanceSQ(pPos, pos) < 500) {
        //    conditions.push("canAttack");
        //}
        var playerBiggerRect = cc.rect(waw.player.x-16, waw.player.y- 8, waw.player.width + 16, waw.player.height + 16);
        //if(cc.rectIntersectsRect(playerBiggerRect, this.collideRect())){
        if(cc.rectIntersectsRect(waw.player.collideRect(), this.collideRect())){
            conditions.push("canAttack");
        }
    },
    pickAISchedule: function () {
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
        this.stateSchedule.reset();
    },
    onGetDamage : function (killer) {
    }
})
;