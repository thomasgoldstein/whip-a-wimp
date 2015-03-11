"use strict";
//states: idle 

waw.NoMobChest = waw.Unit.extend({
    mobType: "Chest",
    shadowYoffset: -4,
    spriteYoffset: -4,
    //HP: 2,
    //state: "idle",
    sfx_hurt01: waw.sfx.punch01,
    sfx_hurt02: waw.sfx.punch01,
    sfx_death: waw.sfx.candelabre01,
    topSprite: null,

    ctor: function () {
        this._super();
        //console.info("Chest ctor");
        this.setContentSize(32, 16);

        this.sprite = new cc.Sprite(waw.gfx.chest, new cc.rect(0, 5, 32, 24));
        this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);

        this.topSprite = new cc.Sprite(waw.gfx.chest, new cc.rect(33, 0, 32, 15));
        this.topSprite.setAnchorPoint(0, 0);
        this.topSprite.setPosition(0, 24-10);
        this.sprite.addChild(this.topSprite, 1);
        this.addChild(this.sprite);

        this.debugCross.setAnchorPoint(0.5, 0);

        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    //clear from this unit 1. local room mobs 2. global room 3. local units - collision check
    cleanRefs: function () {
        for (var n = 0; n < waw.units.length; n++) {
            var m = waw.units[n];
            if (this === m) {
                waw.units[n] = null;
                //TODO instantly remove from room spawn?
                break;
            }
        }
    },
    onOpen : function (killer) {
        if (this.subState === "open")
            return;
        if (this.subState === "open")
            return;
        this.unscheduleAllCallbacks();
        this.subState = "open";

        if (Math.random() < 0.5) {
            this.scheduleOnce(function () {
                cc.audioEngine.playEffect(this.sfx_hurt01);
                this.topSprite.runAction(new cc.MoveTo(0.2, 0, 24));
            }, 0.6);
            this.scheduleOnce(function () {
                this.topSprite.setZOrder(-1);
                cc.audioEngine.playEffect(this.sfx_hurt02);
                this.topSprite.runAction(new cc.MoveTo(0.2, -2 + Math.random() * 4, 3));
            }, 0.8);
        } else {
            this.scheduleOnce(function () {
                cc.audioEngine.playEffect(this.sfx_death);
                this.topSprite.runAction(new cc.MoveTo(0.2, -2 + Math.random() * 4, -3));
                this.topSprite.runAction(new cc.RotateBy(0.4, -5 + Math.random() * 10));
            }, 0.6);
        }
        this.scheduleOnce(function () {
            this.cleanRefs();   //TODO should remove it from room spawn instantly to prevent cheating

            this.scheduleOnce(function () {
                this.sprite.runAction(new cc.FadeOut(1));
                this.topSprite.runAction(new cc.FadeOut(0.8));
                this.shadowSprite.runAction(new cc.FadeOut(0.7));
            }, 0.6);
            //TODO turn it into sequence
        }, 3);
    }
});
