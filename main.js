"use strict";
window.onload = function () {
    cc.game.onStart = function () {
        cc.view.adjustViewPort(true);
        cc.view.setDesignResolutionSize(320, 240, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        cc.LoaderScene.preload([g_resources], function () {
            cc.director.runScene(new waw.TitleScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};
