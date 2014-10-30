"use strict";
waw.AnimatedSprite = cc.Sprite.extend({
    animations: null,
    currentAnimationKey: null,
    ctor: function(spriteFilePath, animData) {
        var me = this;
        me._super();

        me.animations = {};
        var allFrames = {};

        var texture = cc.textureCache.addImage(spriteFilePath);

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

            var flipXFunc = animData[key].flippedX ?
                function() { me.setFlippedX(true); } :
                function() { me.setFlippedX(false); };
            var flipAction = cc.CallFunc.create(flipXFunc, me);

            var animations = [];
            var anim = new cc.Animation(frames, animData[key].delay);
            var animAction = new cc.Animate(anim);
            animations.push(animAction);

            if (animData[key].mirrorX) {
                var mirrorAction = cc.CallFunc.create(function() { me.setFlippedX(!me.isFlippedX()); }, me);
                animations.push(mirrorAction);
            }

            var repeatAction = animations.length === 1 ? animations[0] : cc.Sequence.create(animations);
            //var repeat = cc.RepeatForever.create(repeatAction); // Does not work, seems to be a Cocos bug (tested with 2.2.2)
            var repeat = new cc.Repeat(repeatAction, 9000000);   //Number.MAX_VALUE doesn't work

            me.animations[key] = new cc.Spawn(flipAction, repeat);
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
        this.runAction(this.animations[this.currentAnimationKey]);
    },
    onEnter: function () {
        this._super();
        this.stopAllActions();
        this.runAction(this.animations[this.currentAnimationKey]);
    }
});