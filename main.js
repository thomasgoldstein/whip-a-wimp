"use strict";
window.onload = function () {
    cc.game.onStart = function () {
        var designSize = cc.size(320, 240);
        //var screenSize = cc.view.getFrameSize();
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

        //load resources
//      cc.LoaderScene.preload(["LoadingScreen.png"], function () {
        //cc._loaderImage = "data:image/png;base64,iVBORw ... fQAAAABJRU5ErkJggg==";
        cc.LoaderScene.preload([g_resources], function () {
            cc.director.runScene(new waw.TitleScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};
