"use strict";

waw.Item = waw.Unit.extend({
    itemType: "unknown",
    sprite: null,
    //speed: 1,
    //movement: null,
    //direction: null,
    //dx: 0,
    //dy: 0,
    //targetX: 160,
    //targetY: 110,
    shadowYoffset: 0,
    spriteYoffset: 0,
    ctor: function (itemT) {
        this._super();
        //console.info("Item ctor "+itemT);
        this.itemType = itemT;
        this.setContentSize(8, 8);
        switch (this.itemType) {
            case "key":
                this.sprite = new cc.Sprite(s_Items, cc.rect(0, 0, 16, 16));
                break;
            case "coin":
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 1, 0, 16, 16));
                break;
            case "gem":
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 2, 0, 16, 16));
                break;
            case "map":
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 3, 0, 16, 16));
                break;
            case "rope":
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 4, 0, 16, 16));
                break;
            case "cloth":
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 6, 0, 16, 16));
                break;
            default:
                this.sprite = new cc.Sprite(s_Items, cc.rect(17 * 7 , 0, 16, 16));
        }
        this.sprite.setPosition(0, this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite, 0, TAG_SPRITE);

        //create shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow12x6);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);

        //add debug text info under an item
        this.label = new cc.LabelTTF("Item", "System", 9);
        this.addChild(this.label, 299, TAG_LABELSPRITE);
        this.label.setPosition(0, -8);
        this.label.setVisible(showDebugInfo);

        this.scheduleUpdate();
    },
    cleanUp: function () {
        var i;
        this.unscheduleUpdate();
        cc.audioEngine.playEffect(sfx_Coin01);
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

        for (i = 0; i < waw.items.length; i++) { //remove from current items array
            if (waw.items[i] === this) {
                waw.items[i] = null;
                currentRoom.items[i] = null;
                break;
            }
        }
    },
    update: function () {
        //check conditions
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        if (waw.player.subState !== "invincible" && cc.pDistanceSQ(pPos, pos) < 200) {
            this.onTake();
            this.cleanUp();
        }
        if (showDebugInfo && this.label) {
//            this.label.setString(""+this.state + " "+ cc.pDistanceSQ(pPos, pos) );
            this.label.setString(this.itemType); //+":"+pos.x.toFixed(2)+","+pos.y.toFixed(2) );
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
                    waw.AddMiniMap(this.getParent(), currentRoom, true);
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
                }
                break;
            default:
                waw.addScore(1);    //WTF?
        }
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