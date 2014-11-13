waw.MenuDebug = function (layer) {
    var menu,labelDebug;
    labelDebug = new cc.LabelTTF("Spawn", "System", 12);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
        function () {
//        debugger;
//            switch(Math.round(Math.random()*1)){
            switch(2){
                case 0:
                default:
                    var e = new waw.MobRandomWalker();
                    break;
                case 1:
                    var e = new waw.MobRandomBouncer();
                    break;
                case 2:
                    var e = new waw.MobMerchant();
                    break;
            }
            var m = {x: 100, y: 110};
            var pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            e.setZOrder(250 - pos.y);
            e.setScale(0.1);
            e.runAction(new cc.ScaleTo(0.5, 1));
            //e.runAction(new cc.Blink(1, 4)); //Blink Foe sprite
            this.addChild(e, 6);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            this.addChild(e.shadowSprite, -14);
            //position shadow
            e.shadowSprite.setPosition(pos.x, pos.y - 0);
            waw.foes.push(e);

        }, layer);
    //debugOnOffItem.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16, 239-28);

    labelDebug = new cc.LabelTTF("HitBox", "System", 10);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
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
    //debugOnOffItem.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16, 239-7-38);

//---
    labelDebug = new cc.LabelTTF("Off Music", "System", 10);
    var debugMusicOnOff = new cc.MenuItemLabel(labelDebug,
        function () {
//            if(audioEngine.isMusicPlaying){
//                audioEngine.pauseMusic();
                audioEngine.stopMusic();
//            } else {
//                audioEngine.resumeMusic();
//                audioEngine.playMusic(bgm_Level1, true);
//            }
        }, layer
    );
    menu = new cc.Menu(debugMusicOnOff);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugMusicOnOff.setPosition(16, 239-7-48);

//---
    labelDebug = new cc.LabelTTF("Doors", "System", 10);
    var debugAux = new cc.MenuItemLabel(labelDebug,
        function () {
            for (var i = 0; i< waw.units.length; i++) {
                switch(waw.units[i].getTag()){
                    case TAG_UP_DOORD:
//                        layer.removeChild(waw.units[i]);
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_RIGHT_DOORD:
//                        layer.removeChild(waw.units[i]);
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_DOWN_DOORD:
//                        layer.removeChild(waw.units[i]);
                        waw.units.splice(i,1);
                        i--;
                        break;
                    case TAG_LEFT_DOORD:
//                        layer.removeChild(waw.units[i]);
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
                        node.setTag(0);
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_RIGHT_DOOR:
                        node.setTextureRect(cc.rect(80*2,0,80,80));
                        node.setTag(0);
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_DOWN_DOOR:
                        node.setTextureRect(cc.rect(80*3,0,80,80));
                        node.setTag(0);
//                        this.removeChild(node);
//                        i--;
                        break;
                    case TAG_LEFT_DOOR:
                        node.setTextureRect(cc.rect(80*1,0,80,80));
                        node.setTag(0);
//                        this.removeChild(node);
//                        i--;
                        break;
                    //remove this aux debug+hitbox sprites
                    case TAG_UP_DOORD:
                        layer.removeChild(node);
                        i--;
                        break;
                    case TAG_RIGHT_DOORD:
                        layer.removeChild(node);
                        i--;
                        break;
                    case TAG_DOWN_DOORD:
                        layer.removeChild(node);
                        i--;
                        break;
                    case TAG_LEFT_DOORD:
                        layer.removeChild(node);
                        i--;
                        break;

                }
            }
        }, layer
    );
//    debugAux.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugAux);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugAux.setPosition(16, 239-7-58);

};
