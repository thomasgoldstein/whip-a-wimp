"use strict";

waw.pressFireAndGotoScene = function (self, newScene, preloadResoucres) {

    self.scheduleOnce(function () {
        var label = new cc.LabelTTF("PRESS FIRE", "System", 16);
        label.enableShadow(8, -6, 0.5, 8);
        label.setAnchorPoint(0.5, 0.5);
        self.addChild(label, 500);
        label.setPosition(320 / 2, 20);
        label.runAction(
            new cc.RepeatForever(
                new cc.Sequence(
                    new cc.DelayTime(0.2),
                    new cc.FadeOut(0.2),
                    new cc.FadeIn(0.3)
                )
            )
        );

        self.update = function () {
            if (waw.KEYS[cc.KEY.space]) {
                self.unscheduleUpdate();
                cc.audioEngine.playEffect(waw.sfx.skipButton);

                self.scheduleOnce(function() {
                    waw.KEYS[cc.KEY.space] = false;
                    var transition = cc.TransitionFade;
                    waw.currentScene = new newScene();  //keep current scene ref 4rooms scrolling
                    if (preloadResoucres)
                        cc.LoaderScene.preload(g_resources, function () {
                            cc.director.runScene(new transition(0.5, waw.currentScene));
                        }, self);
                    else
                        cc.director.runScene(new transition(0.5,waw.currentScene));
                }, 1);
            }
        };
        self.scheduleUpdate();

    }, 1);

};