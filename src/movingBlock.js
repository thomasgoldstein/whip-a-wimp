"use strict";
waw.MovingBlock = waw.Block.extend({
    ctor: function() {
        this._super();

        var sprite = cc.Sprite.create(s_Block);
        this.setContentSize(new cc.Size(32, 32));
		this.addChild(sprite);
	//

        var blinks = cc.Blink.create(60, 20);
//        var makeBeAttack = cc.CallFunc.create(this, function (t) {
//            t.canBeAttack = true;
//            t.setVisible(true);
//            t.removeChild(ghostSprite,true);
//        });
//        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));
        this.runAction(cc.RotateBy.create(2.5, 90));



    }
});