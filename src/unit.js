"use strict";
waw.Unit = cc.Node.extend({
    //_positionF: {x:0,y:0},
    shadowSprite: null,
    label: null,
    debugCross: null,
    ctor: function() {
        this._super();
        //this._positionF = cc.p(0, 0);
        //this.setPosition(0,0);

        this.debugCross = new cc.Sprite(s_DebugCross);
        //this.debugCross.setPosition(0, 0);
        this.addChild(this.debugCross,25);
        this.debugCross.setVisible(showDebugInfo);
    },
    // Override setPosition to update _positionF
  /*
    setPosition: function (newPosOrxValue, yValue) {
        if (arguments.length === 2) {
            this._positionF._x = newPosOrxValue;
            this._positionF._y = yValue;
        } else if (arguments.length === 1) {
            this._positionF._x = newPosOrxValue.x;
            this._positionF._y = newPosOrxValue.y;
        }
        this._position._x = Math.round(this._positionF.x);
        this._position._y = Math.round(this._positionF.y);
        this.setNodeDirty();
    },
    // Override setPositionX to update _positionF
    setPositionX: function (x) {
        this._positionF._x = x;
        this._position._x = Math.round(this._positionF.x);
        this.setNodeDirty();
    },
    // Override setPositionY to update _positionF
    setPositionY: function (y) {
        this._positionF._y = y;
        this._position._y = Math.round(this._positionF.y);
        this.setNodeDirty();
    },
    // Gets the unit position with float X/Y values
    getPositionF: function() {
        return this._positionF;
    },
*/
    toSafeXCoord: function (x) {
        return (x<50 ? 50 : (x>270 ? 270 : x));
    },
    toSafeYCoord: function (y) {
        return (y<50 ? 50 : (y>180 ? 180 : y));
    },
    collideRect: function(pos) {
        var s = this.getContentSize();

        //if (pos === undefined)
        if (!pos)
            pos = this.getPosition();
            //pos = this.getPositionF();

        return cc.rect(Math.round(pos.x - s.width / 2), Math.round(pos.y - s.height / 2), s.width, s.height);
//        return cc.rect(pos.x - s.width / 2, pos.y - s.height / 2, s.width, s.height);
    },
    doesCollide: function (_units) {
        if(!_units) throw "must be an array in the arg";
        for (var unit in _units) {
            if(!_units[unit] || _units[unit] === this)    //do not compare with self
                continue;

            //TODO this is Better check. but glitches when u enther right room with presset UP
            if(cc.rectIntersectsRect(this.collideRect(), _units[unit].collideRect())){
                //console.log(this.collideRect(), _units[unit].collideRect());
                return true;
            }

/*
            var rect = cc.rectIntersection(this.collideRect(), _units[unit].collideRect());
            if (rect.width > 0 && rect.height > 0) // Collision!
                return true;
*/
        }
        return false;
    }
});

//TODO do we really need it?
//we add it to prototype to use common sprites as our waw.unit to check their collisions
cc.Sprite.prototype.collideRect = function() {
    //var s = this.getContentSize();
    //var pos = this.getPosition();
    return cc.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};