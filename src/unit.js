"use strict";
waw.Unit = cc.Node.extend({
    _positionF: null,
    ctor: function() {
        this._super();
        this._positionF = cc._pConst(0, 0);
    },
    // Override setPosition to update _positionF
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
    collideRect: function(pos) {
        var s = this.getContentSize();

        if (pos === undefined)
        {
            pos = this.getPositionF();
        }

        return cc.rect(Math.round(pos.x - s.width / 2), Math.round(pos.y - s.height / 2), s.width, s.height);
    },
    doesCollide: function (_units) {
        if(!_units) throw "must be an array in the arg";
        for (var unit in _units) {
            if(!_units[unit] || _units[unit] == this)    //do not compare with self
                continue;

            //TODO this is Better check. but glitches when u enther right room with presset UP
//            if(cc.rectIntersectsRect(this.collideRect(), _units[unit].collideRect())){
                //console.log(this.collideRect(), _units[unit].collideRect());
//                return true;
//            }

            var rect = cc.rectIntersection(this.collideRect(), _units[unit].collideRect());
            if (rect.width > 0 && rect.height > 0) // Collision!
                return true;
        }
        return false;
    }
});

//we add it to prototype to use common sprites as our waw.unit to check their collisions
cc.Sprite.prototype.collideRect = function() {
    var s = this.getContentSize();
    var pos = this.getPosition();
    return cc.rect(pos.x - s.width / 2, pos.y - s.height / 2, s.width, s.height);
};