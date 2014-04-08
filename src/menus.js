waw.MenuDebug = function (layer) {
    var debugOnOffItem = cc.MenuItemImage.create(
        "res/Menus/CloseNormal.png",
        "res/Menus/CloseSelected.png",
        function () {
            showDebugInfo = !showDebugInfo;
            waw.player.label.setVisible(showDebugInfo);
            waw.player.debugCross.setVisible(showDebugInfo);
            for(var i in waw.foes){
                waw.foes[i].label.setVisible(showDebugInfo);
                waw.foes[i].debugCross.setVisible(showDebugInfo);
            }
            for(var i in waw.units){
                waw.units[i].debugCross.setVisible(showDebugInfo);
            }
        }, layer);
    debugOnOffItem.setAnchorPoint(0.5, 0.5);

    var menu = cc.Menu.create(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(22, 239-8);
};
