"use strict";

waw.Item = waw.Unit.extend({
    itemType: "unknown",
    sprite: null,
    speed: 1,
    movement: null,
    direction: null,
    dx: 0,
    dy: 0,
    targetX: 160,
    targetY: 110,
    shadowYoffset: 0,
    spriteYoffset: 0,
    ctor: function () {
        this._super();
        console.info("Item ctor");

        this.setContentSize(8, 8);
        //this.speed = 1+Math.random()*2;
        //this.safePos = cc.p(0, 0);

        this.sprite = new cc.Sprite(s_Items, cc.rect(0,0,16,16));

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow);
        this.shadowSprite.setScale(0.5);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);


        //add debug text info under a mob
        this.label = new cc.LabelTTF("Item", "System", 9);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(0, -16);
        this.label.setVisible(showDebugInfo);

        this.scheduleUpdate();
    },
    update: function () {

        if(showDebugInfo && this.label) {
            var pos = this.getPosition();
//            this.label.setString(""+this.state + " "+ cc.pDistanceSQ(pPos, pos) );
            this.label.setString(this.itemType+"-"+pos.x.toFixed(2)+","+pos.y.toFixed(2) );
        }
        //console.info("item..up");
    },
    onTake: function () {
        //player takes item
    },
    onUse: function () {
        //player uses item
    },
    onTouch: function () {
        //player touchs item on the floor (do we need it?)
    },
    onDestroy: function () {
        //what if the item has beeb destroyed by some forCe
    }
})
;