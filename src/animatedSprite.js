"use strict";
waw.AnimatedSprite = cc.Sprite.extend({
    animationSequences: null,
    animationSequencesFlippedX: null,
    currentAnimationKey: null,
    ctor: function(spriteFilePath, animData) {
        var me = this;
        me._super();

        me.animationSequences = {};
        me.animationSequencesFlippedX = {};
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

            var anim = cc.Animation.create(frames, animData[key].delay);
            var action = cc.Animate.create(anim);
            var seq = !animData[key].mirrorX ? cc.CallFunc.create() : cc.CallFunc.create(this.mirrorAnimationX, this);
            me.animationSequences[key] = cc.Sequence.create(action, seq);
            me.animationSequencesFlippedX[key] = animData[key].flippedX === true;
        }

        me.init();
    },
    mirrorAnimationX: function() {
        this.setFlippedX(!this.isFlippedX());
    },
    playAnimation: function(animationKey) {
        if (this.currentAnimationKey === animationKey)
        {
            return;
        }

        this.currentAnimationKey = animationKey;
        this.stopAllActions();
		// TODO: Fix the visual glitch caused by the fact the sprite is redrawn for a split second
		// between the time we flip it and display the new animation sequence
        this.setFlippedX(this.animationSequencesFlippedX[this.currentAnimationKey]);
        this.runAction(cc.RepeatForever.create(this.animationSequences[this.currentAnimationKey]));
    }
});