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

        var s = waw.SpriteRect(24,16);

        var animData =
        {
            "fly":
            {
                frameRects:
                    [
                        s(0,0),s(1,0),s(0,0),s(2,0)
                    ],
                delay: 0.09
            }
        };
        this.sprite = new waw.AnimatedSprite(waw.gfx.dove, animData);
        this.addChild(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0);
        this.sprite.playAnimation("fly");

        this.setContentSize(16, 16);
        this.speed = 1+Math.random()*2;


    },
    //mark as an obstacle (some kinds of enemy)
    getTag: function(){
        return TAG_BULLET;
    },
    update: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        var oldPos = this.getPosition(),
            x = oldPos.x,
            y = oldPos.y;
        var fps = cc.director.getAnimationInterval();
        var speed = this.speed * fps * 10;

        //go horizontally and walk around vertically
        if (this.targetX < x-1)
            x -= speed;
        else if (this.targetX > x+1)
            x += speed;
        this.x = x;

        if (this.targetY < y-1)
            y -= speed;
        else if (this.targetY > y+1)
            y += speed;
        this.y = y;

        //check if bullet is out of the room
        if(this.x < -24 || this.x > 320+24 ||
            this.y < -48 || this.y > 240
        ) {
            //TODO on exit
            //it dies on exit the room
            this.unscheduleAllCallbacks();
            this.cleanRefs();
            return false;
        }

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