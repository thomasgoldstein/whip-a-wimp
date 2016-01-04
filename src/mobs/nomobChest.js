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
    lockSprite: null,
    locked: true,
    itemType: "unknown",
    cleanItemIndex: 0,

    ctor: function (locked, itemT, n) {
        this._super();
        //console.info("Chest ctor");
        this.locked = locked;
        this.itemType = itemT;
        this.cleanItemIndex = n;
        this.setContentSize(32, 16);

        this.sprite = new cc.Sprite(waw.gfx.chest, new cc.rect(0, 5, 32, 24));
        this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);

        this.topSprite = new cc.Sprite(waw.gfx.chest, new cc.rect(33, 0, 32, 15));
        this.topSprite.setAnchorPoint(0, 0);
        this.topSprite.setPosition(0, 24-10);
        this.sprite.addChild(this.topSprite, 1);
        this.addChild(this.sprite);

        //add lock
        if(this.locked) {
            var s = waw.SpriteRect(16,16); //for lock sprite
            this.lockSprite = new cc.Sprite(waw.gfx.items, s(8, 0)); //lock
            this.lockSprite.setAnchorPoint(0.5, 0.5);
            this.sprite.addChild(this.lockSprite, 2, TAG_SPRITE_TEMP);
            this.lockSprite.setPosition(15, 8);
            waw.makeSpriteJump(this.lockSprite);
        }
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
        this.shadowSprite.scaleY = 0.5;
    },
    //clear from this unit 1. local room mobs 2. global room 3. local units - collision check
    cleanRefs: function () {
        for (var n = 0; n < waw.units.length; n++) {
            var m = waw.units[n];
            if (this === m) {
                waw.units[n].debugCross.visible = false;
                waw.units[n] = null;
                //TODO instantly remove from room spawn?
                break;
            }
        }
    },
    onOpen: function (killer) {
        if (this.locked) {
            if (waw.keys > 0) {
                this.locked = false;
                waw.keys--;
                waw.items[this.cleanItemIndex].locked = waw.curRoom.items[this.cleanItemIndex].locked = false;
                waw.makeSpriteJump(this);
                this.sprite.getChildByTag(TAG_SPRITE_TEMP).runAction(new cc.Spawn( //animate the lock
                    new cc.MoveBy(0.3, 0, -8),
                    new cc.FadeOut(0.3)
                ));
            }
            return;
        }
        if (this.subState === "open")
            return;
        this.unscheduleAllCallbacks();
        this.subState = "open";
        this.setTag(0);
        waw.items[this.cleanItemIndex].inChest = waw.curRoom.items[this.cleanItemIndex].inChest = false;

        if (Math.random() < 0.5) {
            this.scheduleOnce(function () {
                cc.audioEngine.playEffect(this.sfx_hurt01);
                this.topSprite.runAction(new cc.MoveTo(0.2, 0, 24));
            }, 0.6);
            this.scheduleOnce(function () {
                this.topSprite.setLocalZOrder(-1);
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
            cc.audioEngine.playEffect(waw.sfx.coin01);
            //waw.spawnItem(this.itemType, this.cleanItemIndex);
            waw.spawnItem(this.itemType, this.x, this.y, this.cleanItemIndex, this.getParent());
        }, 1);
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
