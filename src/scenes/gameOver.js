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
            waw.currentScene = new waw.TitleScene();
            cc.director.runScene(new transition(1,waw.currentScene));
        }, 3);
    }
});

waw.GameOverLayer = cc.Layer.extend({
    init: function () {
        this._super();
        console.info("init layer GO");
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();

        var label = new cc.LabelTTF("GAME OVER", "System", 32);
        label.setAnchorPoint(0.5, 0.5);
        this.addChild(label, 299 + 5);
        label.setPosition(320/2, 240/2);
    }
});