"use strict";

waw.TitleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        cc.audioEngine.setMusicVolume(0.2);
        //cc.audioEngine.playMusic(waw.bgm.title, true);

        var layer = new waw.TitleLayer();
        layer.init();
        this.addChild(layer);

        waw.theme.gotoNextTheme();

        waw.pressFireAndGotoScene(this, waw.MenuScene, false);
    }
});

waw.TitleLayer = cc.Layer.extend({
    init: function () {
        this._super();
        console.info("init layer Title");

        var s = waw.SpriteRect(32,48);
        var animData =
        {
            "walk_right": {
                frameRects: [
                    s(0,5), s(1,5), s(0,5), s(0,2), s(0,6), s(1,6), s(0,6), s(0,2)
                ],
                delay: 0.1
            },
            "idle_down": {
                frameRects: [
                    s(0,0), s(1,0), s(2,0), s(1,0)
                ],
                delay: 0.2
            },
            "punch_down": {
                frameRects: [
                    s(0,7), s(1,7), s(2,7), s(2,7), s(2,7), s(2,7), s(2,7), s(0,0)
                ],
                delay: 0.1
            }
        };

        //var bgLayer = new cc.LayerGradient(cc.color(45,34,0,0), cc.color(0,90,80,0), cc.p(0.5,-1));
        var bgLayer = new cc.LayerGradient(cc.color.RED, new cc.Color(255,0,0,0), cc.p(0, -1),
                                                      [{p:0, color: cc.color.RED},
                                                      {p:.5, color: new cc.Color(0,0,0,0)},
                                                     {p:1, color: cc.color.RED}]);
        //where p = A value between 0.0 and 1.0 that represents the position between start and end in a gradient
        this.addChild(bgLayer, 1);

        //part 1

        var fameLogo = new cc.Sprite(waw.gfx.fameLogo);
        fameLogo.setAnchorPoint(0.5, 1);
        fameLogo.opacity = 0;
        //fameLogo.scale = 1;
        this.addChild(fameLogo, 299 + 4);
        fameLogo.setPosition(320/2, 240-10);
        fameLogo.runAction(
            new cc.Sequence(
                new cc.FadeIn(7),
                new cc.DelayTime(3),
                new cc.MoveBy(2, 0, 10)
            )
        );

        var labelStaff = new cc.LabelTTF("(c)2016 D&S", "System", 14);
        labelStaff.setAnchorPoint(1, 0);
        this.addChild(labelStaff, 500);
        labelStaff.setPosition(316, 1);
        labelStaff.opacity = 0;
        labelStaff.runAction(
            new cc.Sequence(
                new cc.DelayTime(2),
                new cc.FadeIn(3)
            )
        );

        var sprite = new waw.AnimatedSprite(waw.gfx.jesus, animData);
        sprite.setAnchorPoint(0.5, 0);
        sprite.setPosition(-30, 30);
        this.addChild(sprite, 10);
        sprite.playAnimation("walk_right");

        var shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        shadowSprite.setAnchorPoint(0.5 , 0.5);
        sprite.addChild(shadowSprite, -10);
        shadowSprite.setPosition(16, 0);

        sprite.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.MoveTo(5, 160, 30),
                    new cc.DelayTime(0.2),
                    new cc.CallFunc(function () {
                        sprite.playAnimation("idle_down")
                    }, this),
                    new cc.DelayTime(5),
                    new cc.CallFunc(function () {
                        sprite.playAnimation("walk_right");
                        sprite.skewX = 2;
                    }, this),
                    new cc.MoveTo(2, 350, 30),
                    new cc.DelayTime(2),
                    new cc.CallFunc(function () {
                        sprite.x = -20;
                        sprite.skewX = 0;
                    }, this),
                    new cc.CallFunc(function () {
                        cc.director.runScene(new cc.TransitionFade(0.5,new waw.MenuScene()));
                    }, this)
                )
            )
        );
    }
});