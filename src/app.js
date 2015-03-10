"use strict";

waw.oldLayer = null;
waw.currentLayer = null;
waw.currentScene = null;
waw.scrollActionDone = true; //isDone scrolling between rooms

if (cc.sys.capabilities.hasOwnProperty('keyboard'))
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function (key, event) {
            waw.KEYS[key] = true;
            switch (key) {   //clean opposite arrows pressed status
                case cc.KEY.up:
                    waw.KEYS[cc.KEY.down] = false;
                    break;
                case cc.KEY.down:
                    waw.KEYS[cc.KEY.up] = false;
                    break;
                case cc.KEY.left:
                    waw.KEYS[cc.KEY.right] = false;
                    break;
                case cc.KEY.right:
                    waw.KEYS[cc.KEY.left] = false;
                    break;
            }
        },
        onKeyReleased: function (key, event) {
            waw.KEYS[key] = false;
        }
    }, 1);

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        cc.audioEngine.playMusic(bgm_Level1, true);

        rooms.initLevel();
        rooms.genLevel();
        rooms.initNeighbours();
        rooms.calcDistance();

        waw.player = new waw.Player();
        waw.player.setPosition(startPlayerPos);
        waw.whip = new waw.Whip();

        //TODO add menu
        var layer = new waw.MainLayer();
        layer.init();
        this.addChild(layer);
    }
});

//this layer exists on every Room
waw.MainLayer = cc.Layer.extend({
    mobs: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)

    lightspot: null,
    lightspot1: null,
    lightspot2: null,
    lightspot3: null,
    lightspot4: null,
    lightspotPos: null,

    init: function () {
        this._super();
        //console.info("init layer", currentRoomX, currentRoomY);
        waw.layer = this;
        waw.units = []; //clear obstacles
        this.units = waw.units;

        //Initially draw room BG walls onto layer
        currentRoom = rooms[currentRoomY][currentRoomX];
        if (currentRoom) {
            waw.initWalls(currentRoom); //init array units with non-destructable walls (8 pieces)
            waw.prepareRoomLayer(currentRoom);
        } else
            throw "this room coords are out of the grid";
        currentRoom.visited = true;

        if(rooms.foundMap)
            waw.AddMiniMap(this, currentRoom);

        this.lightspot = new cc.Sprite(s_LightSpot, new cc.rect(0,0,1,1));
        this.lightspot.setAnchorPoint(0.5, 0.5);
        this.lightspot.setPosition(160, 120);
        //right down spot
        this.lightspot1 = new cc.Sprite(s_LightSpot);
        this.lightspot1.setAnchorPoint(0, 1);
        this.lightspot1.setRotation(0);
        this.lightspot.addChild(this.lightspot1);
        this.lightspot1.setPosition(0, 0);
        //left down
        this.lightspot2 = new cc.Sprite(s_LightSpot);
        this.lightspot2.setAnchorPoint(0, 1);
        this.lightspot2.setRotation(90);
        this.lightspot.addChild(this.lightspot2);
        this.lightspot2.setPosition(0, 0);
        //left up
        this.lightspot3 = new cc.Sprite(s_LightSpot);
        this.lightspot3.setAnchorPoint(0, 1);
        this.lightspot3.setRotation(180);
        this.lightspot.addChild(this.lightspot3);
        this.lightspot3.setPosition(0, 0);
        //right up
        this.lightspot4 = new cc.Sprite(s_LightSpot);
        this.lightspot4.setAnchorPoint(0, 1);
        this.lightspot4.setRotation(270);
        this.lightspot.addChild(this.lightspot4);
        this.lightspot4.setPosition(0, 0);

        this.lightspot.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.9), //0.9
                new cc.ScaleTo(0.5, 1)    //1
            )
        ));

        this.addChild(this.lightspot, 290);

        this.lightspot1.visible =
        this.lightspot2.visible =
        this.lightspot3.visible =
        this.lightspot4.visible = currentRoom.dark;

        this.scheduleUpdate();
        //TODO Remove Debug menu
        waw.MenuDebug(this);
    },
    onEnter: function () {
        this._super();
        //console.info("onEnter ROOM",currentRoomX,currentRoomY);

        waw.player.update();   //to update players sprite facing direction

        //attach players shadow to layer OVER BG floor (its Z index = -15)
        this.addChild(waw.player.shadowSprite,-14);
        this.addChild(waw.player,250-waw.player.y);

        waw.player.addChild(waw.whip,10);
        waw.whip.init();

        //put items on the layer
        this.items = waw.spawnItems(this);

        //put mobs on the layer
        this.mobs = waw.spawnMobs(this);

        waw.player.becomeInvincible();
    },
    onEnterTransitionDidFinish: function () {
        this._super();
//      console.info("onEnterTransitionDidFinish ROOM:",currentRoomX,currentRoomY);
        waw.player.scheduleUpdate();
    },
    onExitTransitionDidStart: function () {
        var m,pos;
        this._super();
        //console.info("onExitTransitionDidStart ROOM",currentRoomX,currentRoomY);

        this.removeChild(waw.player.shadowSprite);

        waw.cleanSpawnMobs(this);

        this.cleanup();
    },
    onGotoNextRoom: function (key, playerPos) {
        //set player coords for the next room
        this.removeChild(waw.player, true);
        waw.player.setPosition(playerPos);
        waw.player.unscheduleUpdate();
        this.unscheduleUpdate();
        waw.player.removeTempSprites();

        var room = null;
        switch (key) {
            case cc.KEY.up:
                room = rooms[currentRoomY - 1][currentRoomX];
                if (room) {
                    currentRoomY -= 1;
                    this.lightspot3.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[currentRoomY + 1][currentRoomX];
                if (room) {
                    currentRoomY += 1;
                    this.lightspot1.visible = false;
                    this.lightspot2.visible = false;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[currentRoomY][currentRoomX - 1];
                if (room) {
                    currentRoomX -= 1;
                    this.lightspot2.visible = false;
                    this.lightspot3.visible = false;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[currentRoomY][currentRoomX + 1];
                if (room) {
                    currentRoomX += 1;
                    this.lightspot1.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
        }
        currentRoom = room; //TODO remove later?

        this.scrollToNextRoom(key, 0.5);  //1st arg = in seconds duration of the transition
    },
    scrollToNextRoom: function (direction) {
        waw.oldLayer = this;
        waw.oldLayer.unscheduleUpdate();
        waw.oldLayer.stopAllActions();
        waw.oldLayer.onExitTransitionDidStart();

        var nextLayer = new waw.MainLayer();
        nextLayer.init();

        switch (direction) {
            case cc.KEY.up:
                nextLayer.setPosition(0,240);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 0,-240));
                break;
            case cc.KEY.down:
                nextLayer.setPosition(0,-240);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 0,240));
                break;
            case cc.KEY.left:
                nextLayer.setPosition(-320,0);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 320,0));
                break;
            case cc.KEY.right:
                nextLayer.setPosition(320,0);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, -320,0));
                break;
            default:
                nextLayer.setPosition(60,60);   //debug
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 200,200));
        }
        waw.scrollActionDone = false;
        waw.currentScene.addChild(nextLayer);
        nextLayer.runAction(new cc.MoveTo(0.5, 0,0));
        this.scheduleOnce(
            function(){
                waw.oldLayer.removeAllChildrenWithCleanup();
                waw.scrollActionDone = true;
            }, 0.9);
    },
    update: function (dt) {
        if(currentRoom.dark) {
            if(!this.lightspot1.visible){
                this.lightspot1.visible =
                this.lightspot2.visible =
                this.lightspot3.visible =
                this.lightspot4.visible = true;
            }
            //flickering
            if(this.lightspot1.opacity < 255) {
                this.lightspot1.opacity =
                this.lightspot2.opacity =
                this.lightspot3.opacity =
                this.lightspot4.opacity = this.lightspot1.opacity + 1;
            } else if(Math.random()<0.01){
                this.lightspot1.opacity =
                this.lightspot2.opacity =
                this.lightspot3.opacity =
                this.lightspot4.opacity = 200 + 5 * Math.round(Math.random()*10);
            }
            var pos = waw.player.getPosition();
            if(this.lightspotPos == null)
                this.lightspotPos = pos;
            pos.y += 24;
            switch(waw.player.direction){
                case "down":
                    pos.y -= 16;
                    break;
                case "up":
                    pos.y += 16;
                    break;
                case "left":
                    pos.x -= 16;
                    break;
                case "right":
                    pos.x += 16;
                    break;
            }

            if(this.lightspotPos.x < pos.x)
                this.lightspotPos.x = this.lightspotPos.x + (pos.x-this.lightspotPos.x)/20;
            else if(this.lightspotPos.x > pos.x)
                this.lightspotPos.x = this.lightspotPos.x - (this.lightspotPos.x-pos.x)/20;
            if(this.lightspotPos.y < pos.y)
                this.lightspotPos.y = this.lightspotPos.y + (pos.y-this.lightspotPos.y)/20;
            else if(this.lightspotPos.y > pos.y)
                this.lightspotPos.y = this.lightspotPos.y - (this.lightspotPos.y-pos.y)/20;

            this.lightspot.setPosition(this.lightspotPos);
        } else {
            if(this.lightspot1.visible){
                this.lightspot1.visible =
                    this.lightspot2.visible =
                        this.lightspot3.visible =
                            this.lightspot4.visible = false;
            }
        }
        //monsters
        waw.updateSpawnMobs(this);

        //go to another room?
        var playerPos = waw.player.getPosition();
        if(waw.scrollActionDone) {
            if (playerPos.x < 8/*16*/) {
                playerPos.x = 320-8;
                this.onGotoNextRoom(cc.KEY.left, playerPos);
            } else if (playerPos.y < 4) {
                playerPos.y = 240 - 12; //upper wall is 16pix taller
                this.onGotoNextRoom(cc.KEY.down, playerPos);
            } else if (playerPos.x > 320-8 ) {
                playerPos.x = 8;
                this.onGotoNextRoom(cc.KEY.right, playerPos);
            } else if (playerPos.y > 240 - 12) {  //upper wall is 16pix taller
                playerPos.y = 4;
                this.onGotoNextRoom(cc.KEY.up, playerPos);
            }
        } else {
            if (playerPos.x < 8) {
                waw.player.x = 8;
            } else if (playerPos.y < 4) {
                waw.player.y = 4 ; //upper wall is 16pix taller
            } else if (playerPos.x > 320-8 ) {
                waw.player.x = 320-8;
            } else if (playerPos.y > 240 - 12) {  //upper wall is 16pix taller
                waw.player.y = 240-12;
            }

        }
    }
});