"use strict";

waw.gotoNextLevel = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.gotoNextLevelLayer();
        layer.init();
        this.addChild(layer);

        this.scheduleOnce(function () {
            var transition = cc.TransitionFade;

            //load + calc new levels
            waw.theme.gotoNextLevel();
            rooms.initLevel();

            waw.currentScene = new waw.MainScene();
            cc.director.runScene(new transition(3,waw.currentScene));
        }, 2);
    }
});

waw.gotoNextLevelLayer = cc.Layer.extend({
    init: function () {
        this._super();

        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();

        var label = new cc.LabelTTF(waw.theme.name+" L"+(waw.theme.levelN+1), "System", 32);
        label.setAnchorPoint(0.5, 0.5);
        this.addChild(label, 299 + 5);
        label.setPosition(320/2, 240/2);

        var label2 = new cc.LabelTTF(waw.theme.name+" L"+(waw.theme.levelN+2), "System", 32);
        label2.setAnchorPoint(0.5, 0.5);
        this.addChild(label2, 299 + 5);
        label2.setPosition(320+160, 240/2);

        label.runAction(
            new cc.Sequence(
                new cc.DelayTime(0.8),
                new cc.MoveTo(2, -160, 240 / 2),
                new cc.RemoveSelf()
            )
        );
        label.rotation = -5;
        /*label2.runAction(
            new cc.RepeatForever(
                new cc.Sequence(
                    new cc.FadeIn(0.1),
                    new cc.FadeOut(0.1)
                ))
        );*/
        label2.runAction(
            new cc.Sequence(
                new cc.DelayTime(1),
                new cc.MoveTo(2, 320 / 2, 240 / 2)
                //new cc.RemoveSelf()
            )
        );

    },
    onEnter: function () {
        this._super();
        console.info("onEnter GO");
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        console.info("onEnterTransitionDidFinish GO");
    },
    onExitTransitionDidStart: function () {
        this._super();
        console.info("onExitTransitionDidStart GO");

        waw.whip.visible = false;
        this.addChild(waw.player,10);
        //waw.player.direction = "right";
        waw.player.sprite.playAnimation("walk_right");
        waw.player.sprite2.playAnimation("walk_right");

        //waw.player.scaleTo(1.5, 1.5);
        waw.player.setPosition(-16,50);
        waw.player.runAction(
            new cc.Sequence(
                new cc.MoveTo(2, 160, 50)
                //new cc.JumpTo(2, 330, 200, 5)
                //new cc.RemoveSelf()
            )
        );
    }
});