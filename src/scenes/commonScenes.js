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
            var transition = cc.TransitionRotoZoom;
            var transition = cc.TransitionShrinkGrow;
            cc.director.runScene(new transition(1, new waw.MainScene()));  //1st arg = in seconds duration of t
            //cc.director.runScene(new waw.MainScene());
        }, 1);
    }
});

waw.TitleLayer = cc.Layer.extend({
    init: function () {
        this._super();
        console.info("init layer Title");

        //var bgLayer = new cc.LayerGradient(cc.color(45,34,0,0), cc.color(0,90,80,0), cc.p(0.5,-1));
        //this.addChild(bgLayer);

        var bgLayer  = new cc.LayerColor(cc.color(155,155,0,255), 320, 240);
        this.addChild(bgLayer);

        var label = new cc.LabelTTF("Whip-a-Wimp", "System", 32);
        label.setAnchorPoint(0.5, 0.5);
        label.setFontFillColor( cc.color(255,0,0,50));
        this.addChild(label, 299 + 5);
        label.setPosition(320/2, 240/2+80);
    },
    onEnter: function () {
        this._super();
        console.info("onEnter GO");
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        console.info("onEnterTransitionDidFinish Title");
    },
    onExitTransitionDidStart: function () {
        this._super();
        console.info("onExitTransitionDidStart Title");
    }
});