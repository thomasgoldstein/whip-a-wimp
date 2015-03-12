/**
 * Created by bmv on 19.12.2014.
 */
"use strict";

waw.TitleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new waw.TitleLayer();
        layer.init();
        this.addChild(layer);

        this.scheduleOnce(function(){
            var transition = cc.TransitionProgressRadialCW;
            //var transition = cc.TransitionRotoZoom;
            //var transition = cc.TransitionProgressVertical;

            waw.currentScene = new waw.MainScene();

            cc.LoaderScene.preload(g_resources, function () {
                cc.director.runScene(new transition(0.5, waw.currentScene));
            }, this);

            //cc.director.runScene(new transition(0.5, new waw.MainScene()));  //1st arg = in seconds duration of t
        }, 5);
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
            }
        };

        //var bgLayer = new cc.LayerGradient(cc.color(45,34,0,0), cc.color(0,90,80,0), cc.p(0.5,-1));
        //this.addChild(bgLayer);

        var bgLayer  = new cc.LayerColor(cc.color(191,239,255,255), 320, 240);
        this.addChild(bgLayer, -100);

        var gameTitle = new cc.LabelTTF("Whip-a-Wimp", "System", 32);
        gameTitle.setAnchorPoint(0.5, 0.5);
        gameTitle.setFontFillColor( cc.color(255,30,0,50));
        this.addChild(gameTitle, 299 + 5);
        gameTitle.setPosition(320/2, 240/2+80);

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

        var tower = this.createTower();
        parallax0.addChild(tower);
        tower.setPosition(220, 20);

        gameTitle.runAction(new cc.MoveBy(2, 0, 10));

        parallax0.runAction(new cc.MoveBy(5, -20, -24));
        parallax1.runAction(new cc.MoveBy(5, -60, -16));
        parallax2.runAction(new cc.MoveBy(5, -100, -8));
        parallax3.runAction(new cc.MoveBy(5, -120, 0));

        var sprite = new waw.AnimatedSprite(waw.gfx.jesus, animData);
        sprite.setAnchorPoint(0.5, 0);
        sprite.setPosition(120, 20);
        this.addChild(sprite);
        sprite.runAction(new cc.MoveBy(3, 16, 16));
        sprite.playAnimation("walk_right");


    },
    createTower: function() {
        var n = new cc.Node();
        var b = null;
        for(var y=0; y<7; y++){
            for(var x=0; x<(10-y); x++){
                b = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(32* Math.round(Math.random()*7),147, 32, 32));
                b.setAnchorPoint(0, 0);
                b.setPosition(y * 16 + x * 28 + 2 - Math.round(Math.random()*4), y * 28 - Math.round(Math.random()*4));
                n.addChild(b);
            }
            if(y === 0){
                b = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(0,179, 32, 32));
                b.setPosition(10 * 28 / 2, -6);
            } else {
                b = new cc.Sprite(waw.gfx.titleGFX, new cc.rect(32* Math.round(1+Math.random()*6),178, 32, 32));
                b.setPosition(y * 16 + 28*(Math.round(Math.random()*(6-y))), y * 28 - Math.round(Math.random()*4));
            }
            b.setAnchorPoint(0, 0);
            n.addChild(b);
        }
        return n;
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