waw.MenuDebug = function (layer) {
    var menu;
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

    menu = cc.Menu.create(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(22, 239-8);

//---
    var debugAux = cc.MenuItemImage.create(
        "res/Menus/CloseNormal.png",
        "res/Menus/CloseSelected.png",
        function () {
            for (var i = 0; i< waw.units.length; i++) {
                switch(waw.units[i].getTag()){
                    case TAG_UP_DOOR:
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_RIGHT_DOOR:
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_DOWN_DOOR:
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_LEFT_DOOR:
                        waw.units.splice(i,1);
                        i--;
                        break;
                }
            }
            var allSprites = this.getChildren();
            for (var i = 0; i < allSprites.length; i++) {
                var node = allSprites[i];
                switch (node.getTag()) {
                    case TAG_UP_DOOR:
                        node.setTextureRect(cc.rect(0,0,80,80));
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_RIGHT_DOOR:
                        node.setTextureRect(cc.rect(80*2,0,80,80));
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_DOWN_DOOR:
                        node.setTextureRect(cc.rect(80*3,0,80,80));
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_LEFT_DOOR:
                        node.setTextureRect(cc.rect(80*1,0,80,80));
//                        this.removeChild(node);
//                        i--;
                        break;

                }
            }
        }, layer
    );
    debugAux.setAnchorPoint(0.5, 0.5);

    menu = cc.Menu.create(debugAux);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugAux.setPosition(22, 239-8-16);

};
