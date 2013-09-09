"use strict";
waw.movingBlock = waw.Block.extend({
    ctor: function() {
        this._super();

        var sprite = cc.Sprite.create(s_Block);
        this.setContentSize(new cc.Size(32, 32));
		this.addChild(sprite);
    }
});