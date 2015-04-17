"use strict";

waw.TheEndScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        cc.audioEngine.setMusicVolume(0.2);
        cc.audioEngine.playMusic(waw.bgm.title, true);

        var layer = new waw.TheEndLayer();
        layer.init();
        this.addChild(layer);

        waw.pressFireAndGotoScene(this, waw.TitleScene, true);
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

        var labelStaff = new cc.LabelTTF("STAFF\nDIRECTORS: DON MIGUEL & STIFU\nMAIN CODER: DON MIGUEL\nASSISTANT CODER: STIFU\nGRAPHICS: STIFU\nMUSIC: MIDWIFE & YKAI", "System", 14);
        labelStaff.enableShadow(4, -3, 0.5, 4);
        labelStaff.setAnchorPoint(0.5, 1);
        this.addChild(labelStaff, 500);
        labelStaff.setPosition(320 / 2, 240-6);
        labelStaff.opacity = 0;
        labelStaff.runAction(
                new cc.Sequence(
                    new cc.DelayTime(2),
                    new cc.FadeIn(3)
                )
        );


        var bgLayer  = new cc.LayerColor(cc.color(33,49,160,255), 320, 240);
        this.addChild(bgLayer, -100);

        var gameTitleWhip = new cc.Sprite(waw.gfx.title, cc.rect(0,0,124,44));
        gameTitleWhip.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleWhip, 299 + 6);
        gameTitleWhip.setPosition(320/2, 240);
        gameTitleWhip.opacity = 62;

        var gameTitleA = new cc.Sprite(waw.gfx.title, cc.rect(41,45,42,24));
        gameTitleA.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleA, 299 + 5);
        gameTitleA.setPosition(320/2, 240);
        gameTitleA.opacity = 62;

        var gameTitleWimp = new cc.Sprite(waw.gfx.title, cc.rect(0,70,124,46));
        gameTitleWimp.setAnchorPoint(0.5, 0);
        this.addChild(gameTitleWimp, 299 + 4);
        gameTitleWimp.setPosition(320/2, 240);
        gameTitleWimp.opacity = 62;

        var parallax0 = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,0, 640, 48));
        parallax0.setAnchorPoint(0, 0);
        parallax0.setPosition(-60, 73);
        this.addChild(parallax0, -10);
        parallax0.opacity = 220;

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
        label.setPosition(320/2, 240/2-10);

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
    }
});