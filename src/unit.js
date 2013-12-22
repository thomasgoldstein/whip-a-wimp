"use strict";
waw.Unit = cc.Node.extend({
    _positionF: null,
    ctor: function() {
        this._super();
        
        this._positionF = this._position;
        
        // Make it so _position always returns a point with rounded (integer) values.
        // This way, the getPosition, getPositionX and getPositionY functions return a point with integer values.
        // This is necessary to avoid sprite blur (since Cocos2D HTML5 2.1.6).
        Object.defineProperty(this, '_position', {
            get: function() { return cc.p(Math.round(this._positionF.x), Math.round(this._positionF.y)); }
        });
    },
    // Override setPosition to update _positionF
    setPosition: function (newPosOrxValue, yValue) {
        if (arguments.length === 2) {
            this._positionF.x = newPosOrxValue;
            this._positionF.y = yValue;
        } else if (arguments.length === 1) {
            this._positionF.x = newPosOrxValue.x;
            this._positionF.y = newPosOrxValue.y;
        }
        this.setNodeDirty();
    },
    // Override setPositionX to update _positionF
    setPositionX: function (x) {
        this._positionF.x = x;
        this.setNodeDirty();
    },
    // Override setPositionY to update _positionF
    setPositionY: function (y) {
        this._positionF.y = y;
        this.setNodeDirty();
    },
    // Gets the unit position with float X/Y values
    getPositionF: function() {
        return cc.p(this._positionF.x, this._positionF.y);
    },
    collideRect: function(pos) {
        var s = this.getContentSize();

        if (pos === undefined)
        {
            pos = this.getPositionF();
        }

        return cc.rect(pos.x - s.width / 2, pos.y - s.height / 2, s.width, s.height);
    }
});

//we add it to prototype to use common sprites as our waw.unit to check their collisions
cc.Sprite.prototype.collideRect = function() {
    var s = this.getContentSize();
    var pos = this.getPosition();
    return cc.rect(pos.x - s.width / 2, pos.y - s.height / 2, s.width, s.height);
}