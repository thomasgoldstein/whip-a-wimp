/**
 * Created by bmv on 19.12.2014.
 */
"use strict";

waw.GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.GameOverLayer();
        layer.init();
        this.addChild(layer);

        this.scheduleOnce(function () {
            var transition = cc.TransitionFade;
            rooms.initLevel();
            //cc.director.runScene(new transition(1, new waw.MainScene()));  //1st arg = in seconds duration of t
            waw.currentScene = new waw.MainScene();
            cc.director.runScene(new transition(1,waw.currentScene));
        }, 3);
    }
});

waw.GameOverLayer = cc.Layer.extend({
    init: function () {
        this._super();
        console.info("init layer GO");

        var label = new cc.LabelTTF("GAME OVER", "System", 32);
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