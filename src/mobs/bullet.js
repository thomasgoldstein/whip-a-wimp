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

    oldx: 0,
    oldy: 0,

    ctor: function () {
        this._super();
        //console.info("Bullet ctor");

        var s = waw.SpriteRect(24,16);

        var animData =
        {
            "fly":
            {
                frameRects:
                    [
                        s(0,0),s(1,0),s(2,0),s(1,0)
                    ],
                delay: 0.12
            }
        };
        this.sprite = new waw.AnimatedSprite(waw.gfx.dove, animData);
        this.addChild(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0);
        this.sprite.playAnimation("fly");

        this.setContentSize(16, 16);
        this.scheduleUpdate();
    },
    //mark as an obstacle (some kinds of enemy)
    getTag: function(){
        return TAG_BULLET;
    },
    update: function () {
        if (this.oldx !== this.x || this.oldy !== this.y) {
            var angle = Math.atan2(-this.y + this.oldy, this.x - this.oldx) * 180 / Math.PI;
            //float angle = atan2(-newpos.y + oldpos.y, newpos.x - oldpos.x) * 180 / M_PI;
            //console.log(angle);
            this.sprite.rotation = angle - 90;
            this.oldx = this.x;
            this.oldy = this.y;
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