"use strict";
waw.AnimatedSprite = cc.Sprite.extend({
    animationSequences: null,
    currentAnimationKey: null,
    ctor: function(spriteFilePath, animData, speed) {
        var me = this;
        me._super();

        me.animationSequences = {};
        var allFrames = {};

        var texture = cc.TextureCache.getInstance().addImage(spriteFilePath);

        for (var key in animData) {
            var frames = [];

            animData[key].frameRects.forEach(function(rect) {
                var frameKey = rect.x + "_" + rect.y + "_" + rect.width + "_" + rect.height;

                if (!(frameKey in allFrames))
                {
                    // Frame not loaded yet, load it now
                    // TODO: Consider using cc.SpriteFrameCache. Will be useful for units that share the same sprite.
                    allFrames[frameKey] = cc.SpriteFrame.createWithTexture(texture, rect);
                }

                frames.push(allFrames[frameKey]);
            });

            var anim = cc.Animation.create(frames, speed);
            var action = cc.Animate.create(anim);
            me.animationSequences[key] = cc.Sequence.create(action, cc.CallFunc.create());
        }

        me.init();
    },
    playAnimation: function(animationKey) {
        if (this.currentAnimationKey === animationKey)
        {
            return;
        }

        this.currentAnimationKey = animationKey;
        this.stopAllActions();
        this.runAction(cc.RepeatForever.create(this.animationSequences[this.currentAnimationKey]));
    }
});