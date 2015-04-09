"use strict";

waw.Item = waw.Unit.extend({
    itemType: "unknown",
    sprite: null,
    shadowYoffset: 0,
    spriteYoffset: 0,
    cleanItemIndex: 0,
    ctor: function (itemT, n) {
        this._super();
        //console.info("Item ctor "+itemT);
        this.itemType = itemT;
        this.cleanItemIndex = n;
        this.setContentSize(8, 8);
        var s = waw.SpriteRect(16,16);
        switch (this.itemType) {
            case "key":
                this.sprite = new cc.Sprite(waw.gfx.items, s(0, 0));
                break;
            case "coin":
                this.sprite = new cc.Sprite(waw.gfx.items, s(1, 0));
                break;
            case "gem":
                this.sprite = new cc.Sprite(waw.gfx.items, s(2, 0));
                break;
            case "map":
                this.sprite = new cc.Sprite(waw.gfx.items, s(3, 0));
                break;
            case "rope":
                this.sprite = new cc.Sprite(waw.gfx.items, s(4, 0));
                break;
            case "cloth":
                this.sprite = new cc.Sprite(waw.gfx.items, s(5, 0));
                this.spriteYoffset = -1;
                break;
            case "invincibility":
                this.sprite = new cc.Sprite(waw.gfx.items, s(6, 0));
                break;
            case "boots":
                this.sprite = new cc.Sprite(waw.gfx.items, s(9, 0));
                break;
            default:    //unknown
                this.sprite = new cc.Sprite(waw.gfx.items, s(7, 0));
        }
        this.sprite.setPosition(0, this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite, 0, TAG_SPRITE);
        waw.makeSpriteJump(this.sprite);
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow12x6);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
        this.scheduleUpdate();
    },
    cleanUp: function () {
        this.unscheduleUpdate();
        this.debugCross.visible = false;
        if(Math.random()<0.2)
            cc.audioEngine.playEffect(waw.sfx.good01);
        else if(Math.random()<0.5)
            cc.audioEngine.playEffect(waw.sfx.good02);
        else
            cc.audioEngine.playEffect(waw.sfx.good03);
        this.setZOrder(300); //make item over player
        this.getParent().removeChild(this.sprite);   //remove item sprite
        this.sprite.runAction(new cc.Sequence(
            new cc.Spawn(
                new cc.FadeOut(0.3),
                new cc.MoveBy(0.3, 0, 24),
                new cc.ScaleTo(0.3, 0.5)
            ),
            new cc.RemoveSelf()
        ));
        this.shadowSprite.runAction(new cc.Sequence(
            new cc.Spawn(
                new cc.FadeOut(0.2),
                new cc.ScaleTo(0.2, 0.1)
            ),
            new cc.RemoveSelf()
        ));
        waw.items[this.cleanItemIndex] = waw.curRoom.items[this.cleanItemIndex] = null;
    },
    update: function () {
        //check conditions
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        if (waw.player.subState !== "invincible" && cc.pDistanceSQ(pPos, pos) < 200) {
            this.onTake();
        }
    },
    onTake: function () {
        //player takes item
        switch (this.itemType) {
            case "key":
                waw.keys += 1;
                waw.addScore(10);
                break;
            case "gem":
                waw.gems += 1;
                waw.addScore(50);
                break;
            case "coin":
                waw.coins += 1;
                waw.addScore(100);
                break;
            case "map":
                if(rooms.foundMap === false)
                    waw.AddMiniMap(this.getParent(), waw.curRoom, true);
                rooms.foundMap = true;
                waw.addScore(150);
                break;
            case "rope":
                waw.whip.addLink();
                waw.addScore(50);
                break;
            case "cloth":
                if(waw.player.HP === 1) {
                    waw.player.HP = 2;
                    waw.player.sprite2.visible = true;
                    waw.addScore(50);
                } else
                    return;
                break;
            case "invincibility":
                if (waw.player.subState === "") {
                    waw.player.setSubState("invincible", 5000);
                    waw.addScore(50);
                    var s = waw.SpriteRect(16,16);
                    var sprite = new cc.Sprite(waw.gfx.items, s(6, 0));
                    waw.player.addChild(sprite, -20, TAG_SPRITE_TEMP);
                    sprite.setScale(2);
                    sprite.setPosition(0, 0);
                    sprite.runAction(
                        new cc.Sequence(
                            new cc.RotateBy(4.5, 360*3),
                            new cc.FadeOut(0.5),
                            new cc.RemoveSelf()
                        )
                    );
                } else
                    return;
                break;
            case "boots":
                if(waw.player.speed < 12) {
                    waw.player.speed++;
                    waw.addScore(50);
                    //waw.player.sprite.setColor(new cc.Color(255,133,133,255));
/*                    waw.player.sprite.runAction(
                        new cc.Sequence(
                            new cc.ScaleTo(0.5, 0.6, 1.4),
                            new cc.ScaleTo(0.5, 1,1)
                        )
                    );*/
                } else
                    return;
                break;
            default:
                waw.addScore(1);    //WTF?
        }
        this.cleanUp();
    },
    onUse: function () {
        //player uses item
    },
    onTouch: function () {
        //player touches item on the floor (do we need it?)
    },
    onDestroy: function () {
        //what if the item has been destroyed by some forCe
    }
});