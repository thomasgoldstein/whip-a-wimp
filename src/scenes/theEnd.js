"use strict";

waw.TheEndScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.TheEndLayer();
        layer.init();
        this.addChild(layer);

        //init score / items / level
        //waw.theme.gotoNextTheme();

        this.scheduleOnce(function(){
            var transition = cc.TransitionFade;

            waw.currentScene = new waw.TitleScene();

            cc.LoaderScene.preload(g_resources, function () {
                cc.director.runScene(new transition(0.5, waw.currentScene));
            }, this);

            //cc.director.runScene(new transition(0.5, new waw.MainScene()));  //1st arg = in seconds duration of t
        }, 5);
    }
});

waw.TheEndLayer = cc.Layer.extend({
    init: function () {
        this._super();
        console.info("init layer TheEnd");

        var s = waw.SpriteRect(32,48);
        var animData =
        {
            "walk_right": {
                frameRects: [
                    s(0,5), s(1,5), s(0,5), s(0,2), s(0,6), s(1,6), s(0,6), s(0,2)
                ],
                delay: 0.1
            }
        };

        //var bgLayer = new cc.LayerGradient(cc.color(45,34,0,0), cc.color(0,90,80,0), cc.p(0.5,-1));
        //this.addChild(bgLayer);

        var bgLayer  = new cc.LayerColor(cc.color(239,191,255,255), 320, 240);
        this.addChild(bgLayer, -100);

        var gameTitleWhip = new cc.Sprite(waw.gfx.title, cc.rect(0,0,124,44));
        gameTitleWhip.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleWhip, 299 + 6);
        gameTitleWhip.setPosition(320/2, 240);
        gameTitleWhip.opacity = 32;

        var gameTitleA = new cc.Sprite(waw.gfx.title, cc.rect(41,45,42,24));
        gameTitleA.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleA, 299 + 5);
        gameTitleA.setPosition(320/2, 240);
        gameTitleA.opacity = 32;

        var gameTitleWimp = new cc.Sprite(waw.gfx.title, cc.rect(0,70,124,46));
        gameTitleWimp.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleWimp, 299 + 4);
        gameTitleWimp.setPosition(320/2, 240);
        gameTitleWimp.opacity = 32;

        var parallax0 = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,0, 640, 48));
        parallax0.setAnchorPoint(0, 0);
        parallax0.setPosition(-60, 73);
        this.addChild(parallax0, -10);

        var parallax1 = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,0, 640, 48));
        parallax1.setAnchorPoint(0, 0);
        parallax1.setPosition(0, 48);
        this.addChild(parallax1, -9);

        var parallax2 = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,49, 640, 48));
        parallax2.setAnchorPoint(0, 0);
        parallax2.setPosition(0, 24);
        this.addChild(parallax2, -8);

        var parallax3 = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,98, 640, 48));
        parallax3.setAnchorPoint(0, 0);
        parallax3.setPosition(0, 0);
        this.addChild(parallax3, -7);

        var label = new cc.LabelTTF("The End", "System", 64);
        label.enableShadow(8, -6, 0.5, 8);
        label.setAnchorPoint(0.5, 0.5);
        this.addChild(label, 299 + 10);
        label.setPosition(320/2, 240/2);

        gameTitleWhip.runAction(
            new cc.Sequence(
                new cc.DelayTime(1),
                new cc.EaseElasticOut(
                    new cc.MoveTo(1, 320 / 2, 140),
                    0.33),
                new cc.RepeatForever(
                    new cc.Sequence(
                        new cc.MoveBy(0.2, 0, 4),
                        new cc.MoveBy(0.2, 0, -4)
                    )
                )
            )
        );
        gameTitleA.runAction(
            new cc.Sequence(
                new cc.DelayTime(1.25),
                new cc.EaseElasticOut(
                    new cc.MoveTo(1, 320 / 2, 120),
                    0.32)
            )
        );
        gameTitleWimp.runAction(
            new cc.Sequence(
                new cc.DelayTime(1.5),
                new cc.EaseElasticOut(
                    new cc.MoveTo(1, 320 / 2, 80),
                    0.33),
                new cc.RepeatForever(
                    new cc.Sequence(
                        new cc.MoveBy(0.2, 0, -3),
                        new cc.MoveBy(0.2, -20, 3)
                    )
                )
            )
        );

        parallax0.runAction(new cc.MoveBy(5, -20, -24));
        parallax1.runAction(new cc.MoveBy(5, -60, -16));
        parallax2.runAction(new cc.MoveBy(5, -100, -8));
        parallax3.runAction(new cc.MoveBy(5, -120, 0));

        var sprite = new waw.AnimatedSprite(waw.gfx.jesus, animData);
        sprite.setAnchorPoint(0.5, 0);
        sprite.setPosition(80, 20);
        this.addChild(sprite);
        sprite.playAnimation("walk_right");

        var shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        shadowSprite.setAnchorPoint(0.5 , 0.5);
        sprite.addChild(shadowSprite, -10);
        shadowSprite.setPosition(16, 0);

        //sprite.runAction(new cc.MoveTo(5, 260, 50));
        //sprite.runAction(new cc.ScaleTo(5, 0.5, 0.5));
    },
    onEnter: function () {
        this._super();
        //console.info("onEnter GO");
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        //console.info("onEnterTransitionDidFinish Title");
    },
    onExitTransitionDidStart: function () {
        this._super();
        //console.info("onExitTransitionDidStart Title");
    }
});