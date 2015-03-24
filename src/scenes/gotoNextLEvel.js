"use strict";

waw.gotoNextLevel = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.gotoNextLevelLayer();
        layer.init();
        this.addChild(layer);

        this.scheduleOnce(function () {
            var transition = cc.TransitionFade;
            rooms.initLevel();
            waw.currentScene = new waw.MainScene();
            cc.director.runScene(new transition(1,waw.currentScene));
        }, 3);
    }
});

waw.gotoNextLevelLayer = cc.Layer.extend({
    init: function () {
        this._super();

        waw.theme.gotoNextLevel();

        var label = new cc.LabelTTF(waw.theme.name+"\nNEXT LEVEL "+waw.theme.levelN, "System", 32);
        label.setAnchorPoint(0.5, 0.5);
        this.addChild(label, 299 + 5);
        label.setPosition(320/2, 240/2);

        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();

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
    }
});