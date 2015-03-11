"use strict";
waw.Unit = cc.Node.extend({
    shadowSprite: null,
    label: null,
    debugCross: null,
    direction: "down",
    state: "idle",
    subState: "",
    subStateCountDown: 0,
    ctor: function() {
        this._super();
        if(this.width <= 0 )    //default size for a unit
            this.setContentSize(16,16);
        this.debugCross = new cc.Sprite(waw.gfx.hitBoxGridBlue, cc.rect(0, 0, this.width, this.height));
        this.debugCross.setAnchorPoint(0.5, 0);
        this.addChild(this.debugCross, 25, TAG_HITBOXSPRITE);
        this.debugCross.setVisible(showDebugInfo);
    },
    toSafeXCoord: function (x) {
        return (x<50 ? 50 : (x>270 ? 270 : x));
    },
    toSafeYCoord: function (y) {
        return (y<50 ? 50 : (y>180 ? 180 : y));
    },
    removeTempSprites: function() {
        this.removeChildByTag(TAG_SPRITE_TEMP, true);
    },
    setSubState: function(subState, subStateCountDown) {
        var currentTime = new Date();
        this.subState = subState;
        this.subStateCountDown = currentTime.getTime() + (subStateCountDown || 1000);
    },
    collideRect: function(pos) {
        if (!pos)
            pos = this.getPosition();
        return cc.rect(pos.x - this.width / 2, pos.y , this.width, this.height);
    },
    doesCollide: function (_units) {
        //if(!_units) throw "must be an array in the arg";
        for (var unit in _units) {
            if(!unit || !_units[unit] || _units[unit] === this)    //do not compare with self
            //if(!unit || unit === this)    //do not compare with self
                continue;
            //TODO this is Better check. but glitches when u enter right room with pressed UP
            if(cc.rectIntersectsRect(this.collideRect(), _units[unit].collideRect())){
                return true;
            }
        }
        return false;
    }
});