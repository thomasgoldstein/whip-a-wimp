waw.MenuDebug = function (layer) {
    var debugOnOffItem = cc.MenuItemImage.create(
        "res/Menus/CloseNormal.png",
        "res/Menus/CloseSelected.png",
        function () {
            showDebugInfo = !showDebugInfo;
        }, layer);
    debugOnOffItem.setAnchorPoint(0.5, 0.5);

    var menu = cc.Menu.create(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(320 - 22, 8);
};
