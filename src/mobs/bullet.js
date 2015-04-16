"use strict";

waw.Bullet= waw.Unit.extend({
    mobType: "unknown",
    sprite: null,
    shadowYoffset: 4,
    spriteYoffset: -4,

    sfx_hurt01: waw.sfx.pigHurt01,
    sfx_hurt02: waw.sfx.pigHurt02,
    sfx_death: waw.sfx.pigDeath,

    oldx: 0,
    oldy: 0,

    ctor: function () {
        this._super();
        //console.info("Bullet ctor");
        this.scheduleUpdate();
    },
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
            //this.shadowSprite.x = this.x;
            //this.shadowSprite.y = this.y-28;
            //this.shadowSprite.rotation = angle - 90;
        }
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        if (waw.player.subState !== "invincible" && cc.pDistanceSQ(pPos, pos) < 250) {
            waw.player.onGetDamage(this);
        }
    }
});