cc.game.onStart = function(){
    var designSize = cc.size(320, 240);
    //var screenSize = cc.view.getFrameSize();
    //    cc.loader.resPath = "res/HD";
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new waw.MainScene());
    }, this);
};
cc.game.run();