"use strict";

waw.Bullet= waw.Unit.extend({
    mobType: "unknown",
    sprite: null,
    speed: 1,
    dx: 1,
    dy: -1,
    targetX: 160,
    targetY: 110,
    shadowYoffset: 4,
    spriteYoffset: -4,
    safePos: null,  //TODO revise? why for
    HP: 1,
    killable: true, //no for SPIKES
//    state: "idle",
    stateSchedule: null,
    conditions: [],
    timeToThink: 0,
    sfx_hurt01: waw.sfx.pigHurt01,
    sfx_hurt02: waw.sfx.pigHurt02,
    sfx_death: waw.sfx.pigDeath,
    ctor: function () {
        this._super();
        //console.info("Bullet ctor");

        this.setContentSize(16, 16);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        //add debug text info under a mob
        this.label = new cc.LabelTTF("Bullet", "System", 9);
        this.addChild(this.label, 299);
        this.label.setPosition(0, -16);
        this.label.setVisible(showDebugInfo);

        this.state = "idle";
        this.calcDirection(0, 0);
    },
    //mark as an obstacle (some kinds of enemy)
    getTag: function(){
        return TAG_BULLET;
    },
    update: function () {
        var currentTime = new Date();
        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.conditions.indexOf("canAttack")>=0) {
            this.state = "attack";
            this.stateSchedule.reset();
        }
        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if(showDebugInfo && this.label) {
            this.label.setString(this.mobType+"-"+this.x.toFixed(1)+","+this.y.toFixed(1)+"\n "+this.state+" "+this.dx.toFixed(1)+","+this.dy.toFixed(1) );
        }
    },
    //clear from this unit 1. local room mobs 2. global room 3. local units - collision check
    cleanRefs: function () {
        this.debugCross.visible = false;
        for (var n = 0; n < waw.mobs.length; n++) {
            var m = waw.mobs[n];
            if (this === m) {
                waw.mobs[n] = null;
                waw.units[200 + n] = null;  //TODO do something with 200 offset
                waw.curRoom.mobs[n] = null;
                break;
            }
        }
    },
    getAnimationName: function() {
        return this.state+"_"+this.direction;
    },
    getAnimationNameHurt: function() {
        return "hurt_"+this.direction;
    },
    initFollowEnemy: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 6500 + Math.random() * 2500;
        this.targetX = waw.player.x;
        this.targetY = waw.player.y;
        this.dx = 0;
        this.dy = 0;
        this.calcDirection(this.targetX - this.x,this.targetY - this.y);
        this.sprite.playAnimation(this.getAnimationName());
        return true;
    }
});