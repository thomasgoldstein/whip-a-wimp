"use strict";

waw.gotoNextLevel = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.gotoNextLevelLayer();
        layer.init();
        this.addChild(layer);

        this.scheduleOnce(function () {
            var transition = cc.TransitionFade;

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

        var label = new cc.LabelTTF(waw.theme.name+" "+(waw.theme.levelN+1), "System", 32);
        label.setAnchorPoint(0.5, 0.5);
        this.addChild(label, 299 + 5);
        label.setPosition(320/2, 240/2);
    },
    onEnter: function () {
        this._super();
        console.info("onEnter GO");
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        console.info("onEnterTransitionDidFinish GO");
        //load + calc new levels
        waw.theme.gotoNextLevel();
        rooms.initLevel();
    },
    onExitTransitionDidStart: function () {
        this._super();
        console.info("onExitTransitionDidStart GO");

        this.addChild(waw.player,10);
        //waw.player.direction = "right";
        waw.player.sprite.playAnimation("walk_right");
        waw.player.sprite2.playAnimation("walk_right");

        //waw.player.scaleTo(1.5, 1.5);
        waw.player.setPosition(-50,50);
        waw.player.runAction(
            new cc.Sequence(
                new cc.MoveTo(2, 160, 50)
                //new cc.JumpTo(2, 330, 200, 5)
                //new cc.RemoveSelf()
            )
        );
    }
});