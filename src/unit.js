"use strict";
waw.Unit = cc.Node.extend({
    ctor: function() {
        this._super();
    },
    collideRect : function(pos) {
        var s = this.getContentSize();

        if (pos === undefined)
        {
            pos = this.getPosition();
        }

        return cc.rect(pos.x - s.width / 2, pos.y - s.height / 2, s.width, s.height);
    }
});