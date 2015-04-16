"use strict";

waw.BulletDove = waw.Bullet.extend({
    mobType: "dove",
    sprite: null,
    shadowYoffset: 4,
    spriteYoffset: -4,

    sfx_hurt01: waw.sfx.pigHurt01,
    sfx_hurt02: waw.sfx.pigHurt02,
    sfx_death: waw.sfx.pigDeath,

    ctor: function () {
        this._super();
        //console.info("Dove ctor");
        var s = waw.SpriteRect(24,16);
        var animData =
        {
            "fly": {
                frameRects: [
                    s(0, 0), s(1, 0), s(2, 0), s(1, 0)
                ],
                delay: 0.12
            }
        };
        this.sprite = new waw.AnimatedSprite(waw.gfx.dove, animData);
        this.addChild(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.playAnimation("fly");
        this.sprite.y = 48;
        this.scheduleUpdate();
    }
});