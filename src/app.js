"use strict";

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

	//audioEngine.setMusicVolume(0.5);
     //   audioEngine.playMusic(bgm_Level1, true);

        //init the current labyrinth of rooms;
        rooms.initLevel();
        rooms.genLevel();

        waw.player = new waw.Player();
        waw.player.setPosition(startPlayerPos);

        //TODO add menu
        var layer = new waw.MainLayer();
        layer.init();
        this.addChild(layer);
//	    this.setScale(0.5); //size 50% to see that it's the 1st room.
    }
});


//this layer exists on every Room
//it contains all keyboard stuff
waw.MainLayer = cc.Layer.extend({
    foes: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)

    init: function () {
        this._super();
        console.info("init layer", currentRoomX, currentRoomY);
        //var w = cc.director.waw;
        waw.layer = this;
        waw.units = []; //clear obstacles
        this.units = waw.units;

        this.scheduleUpdate();

        //Initially draw room BG, walls, foes onto layer
        currentRoom = rooms[currentRoomY][currentRoomX];
        if (currentRoom) {
            waw.initWalls(currentRoom); //init array units with non-destructable walls (8 pieces)
            waw.prepareRoomLayer(currentRoom);
        } else
            throw "this room coords are out of the grid"
        waw.units = this.units;   //init array


        var room = rooms[currentRoomY][currentRoomX];
        room.visited = true;
        var miniMap = waw.GenerateMiniMap();
        this.addChild(miniMap, 400);
        if(room.walls.up_d > 0) //if the upper door is shifted to right, then put mini-map to left
            miniMap.setPosition(34,240-48);
        else
            miniMap.setPosition(320-33-40,240-48);  //mm to the right

/*        if (cc.sys.capabilities.hasOwnProperty('touches')){
//            this.setTouchEnabled(true);

            //Controls buttons
            var circle = new cc.Sprite(s_TouchControls,
                cc.rect(0, 0, 48, 48));
            var buttons = new cc.Sprite(s_TouchControls,
                cc.rect(48, 0, 48, 48));
            circle.setPosition(24, 24);
            buttons.setPosition(320 - 24, 24);
            this.addChild(circle, 400);
            this.addChild(buttons, 400);
            circle.runAction(cc.FadeIn(1, 2));
            buttons.runAction(cc.FadeIn(1, 2));
        }*/
        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function (key, event) {
                    waw.KEYS[key] = true;
                },
                onKeyReleased:function (key, event) {
                    waw.KEYS[key] = false;
                }
            }, this);

        //Debug menu
        //TODO
        waw.MenuDebug(this);
    },
    onEnter: function () {
        var m, e,pos;
        this._super();
        console.info("onEnter ROOM",currentRoomX,currentRoomY);

        //TODO
        waw.player.update();   //to update players sprite facing direction

        //attach players shadow to layer OVER BG floor (its Z index = -15)
        //TODO
        this.addChild(waw.player.shadowSprite,-14);
        this.addChild(waw.player,250-waw.player.y);
        //waw.player.setScale(0.8);
        //waw.player.runAction(new cc.ScaleTo(0.25, 1));
        //waw.player.runAction(new cc.Blink(0.5, 3)); //Blink Player sprite

        //waw.player.setPosition(waw.player.getPosition());   //to update players sprite facing direction

        //put enemy on the layer
        this.foes = [];
        //TODO Plug. Temp put enemy on the screen
        for(var i=0; i<currentRoom.mobs.length; i++){
            m = currentRoom.mobs[i];
            //TODO choose m.mobType
            e = new waw.Enemy();
            pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            m.mob = e; //to get some params of the mob later, when u exit the room
            e.setZOrder(250 - pos.y);
            e.setScale(0.1);
            e.runAction(new cc.ScaleTo(0.5, 1));
            //e.runAction(cc.Blink.create(1, 4)); //Blink Foe sprite
            this.addChild(e, 6);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            this.addChild(e.shadowSprite,-14);
            //position shadow
            e.shadowSprite.setPosition(pos.x, pos.y-0);
            this.foes.push(e);
        }
        waw.foes = this.foes;
    },
    onEnterTransitionDidFinish: function () {
        this._super();
//        console.info("onEnterTransitionDidFinish ROOM:",currentRoomX,currentRoomY);

        //TODO fix freez of the player anim
/*        waw.player.movement.down =
            waw.player.movement.up =
                waw.player.movement.left =
                    waw.player.movement.right = false;*/

/*        this.setKeyboardEnabled(true);
        if ('touches' in sys.capabilities)
            this.setTouchEnabled(true);
        this.scheduleUpdate();*/
        waw.player.scheduleUpdate();
    },
    onExitTransitionDidStart: function () {
        var m,pos,mf;
        this._super();
        console.info("onExitTransitionDidStart ROOM",currentRoomX,currentRoomY);
        //this.setKeyboardEnabled(false);
        //this.setTouchEnabled(false);
        //this.unscheduleUpdate();    //disable update:
        //this.removeAllActions();
        this.removeChild(waw.player.shadowSprite);

        for(var i=0; i<currentRoom.mobs.length; i++) {
            m = currentRoom.mobs[i];
            if(!m)
                continue;
            if(!m.mob)      //TODO why it might be NULL ? cant find the prob
                continue;
            pos = m.mob.getPosition();
            m.x = pos.x;
            m.y = pos.y;
            m.mob = null;
        }

        for(var i=0; i<waw.foes.length; i++) {
//            this.removeChild(waw.foes[i]);
//            waw.foes[i].unscheduleUpdate();
//            waw.foes[i].unscheduleAllCallbacks();
            waw.foes[i] = null;
        }
        this.foes = [];
        waw.foes = [];
        this.units = [];
        this.cleanup();
    },
    onTouchesBegan: function(touch, event){
//        console.log(touch, event);
/*        var pos = touch[0].getLocation();
        if(pos.x>50 || pos.y >50)
            return;
        if(pos.x<16) {
            waw.player.keyUp(cc.KEY.right);
            waw.player.keyDown(cc.KEY.left);
        }
        else if(pos.x>50-16) {
            waw.player.keyUp(cc.KEY.left);
            waw.player.keyDown(cc.KEY.right);
        }
        if(pos.y<16) {
            waw.player.keyUp(cc.KEY.up);
            waw.player.keyDown(cc.KEY.down);
        }
        else if(pos.y>50-16) {
            waw.player.keyUp(cc.KEY.down);
            waw.player.keyDown(cc.KEY.up);
        }*/
    },
    onTouchesEnded: function(touch, event){
//        console.log(touch, event);
/*        if(!touch[0])
            return;
        var pos = touch[0].getLocation();
        if(pos.x>50 || pos.y >50) {
            waw.player.keyUp(cc.KEY.left);
            waw.player.keyUp(cc.KEY.right);
            waw.player.keyUp(cc.KEY.down);
            waw.player.keyUp(cc.KEY.up);
            return;
        }
        if(pos.x<16) {
            waw.player.keyUp(cc.KEY.left);
        }
        else if(pos.x>50-16) {
            waw.player.keyUp(cc.KEY.right);
        }
        if(pos.y<16) {
            waw.player.keyUp(cc.KEY.down);
        }
        else if(pos.y>50-16) {
            waw.player.keyUp(cc.KEY.up);
        }*/
    },
    onGotoNextRoom: function (e, playerPos) {
//	    console.info("Goto next room");
        //set player coords for the next room
        this.removeChild(waw.player, true);
        waw.player.setPosition(playerPos);    //TODO Fix it better. this setpos insta moves player to the next room pos. It prevents running UPDATE several times at once.
        waw.player.unscheduleUpdate();
        this.unscheduleUpdate();

        var room = null;
        var transition = cc.TransitionProgressRadialCW;   //transition for teleporting
        switch (e) {
            case cc.KEY.up:
                room = rooms[currentRoomY - 1][currentRoomX];
                if (room) {
                    currentRoomY -= 1;
                    transition = cc.TransitionSlideInT; //effect - scrolls one scene out
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[currentRoomY + 1][currentRoomX];
                if (room) {
                    currentRoomY += 1;
                    transition = cc.TransitionSlideInB;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[currentRoomY][currentRoomX - 1];
                if (room) {
                    currentRoomX -= 1;
                    transition = cc.TransitionSlideInL;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[currentRoomY][currentRoomX + 1];
                if (room) {
                    currentRoomX += 1;
                    transition = cc.TransitionSlideInR;
                } else
                    return;
                break;
        }

        //NOW we prepare NEXT room to slide from current to the next one.
        //so we have to remove player from the current room
        //this.removeChild(waw.player);
        //this.removeChild(waw.player, false);

        currentRoom = room; //??? remove later
        //create new scene to put a layer of the next room into it. To use DIRECTOR to use transitions between scenes
        var nextScene = new cc.Scene();
        var nextLayer = new waw.MainLayer();
        nextLayer.init();
        nextScene.addChild(nextLayer);

        //TODO Change 0.25 sec to 0.5, when the room transition glitch is fixed
        //cc.director.runScene(new cc.TransitionProgressRadialCW(0.5, nextScene));  //1st arg = in seconds duration of the transition
        cc.director.runScene(new transition(0.5, nextScene));  //1st arg = in seconds duration of the transition
        //cc.director.runScene(nextScene);  //1st arg = in seconds duration of the transition
        //0.25
//        cc.director.replaceScene(nextScene);    //Instant transition between rooms
        //TODO doesnt appear
        //nextLayer.addChild(waw.player);
        //nextLayer.addChild(waw.player.shadowSprite,-14);

    },
    update: function (dt) {
          //monsters
        for(var i=0; i<this.foes.length; ++i){
            if(this.foes[i]) {
                this.foes[i].update(); //pass current closure to have access to its Units arr
//                if(!this.foes[i].condition.alive)
//                    this.foes[i] = null;
            }
        }
        //go to another room?
        var playerPos = waw.player.getPosition();
        //debugger;

        if (playerPos.x < 16) {
            playerPos.x = 320 - 32;
            this.onGotoNextRoom(cc.KEY.left, playerPos);
            return;

        } else if (playerPos.y < 16) {
            playerPos.y = 240 - 32 - 16; //upper wall is 16pix taller
            this.onGotoNextRoom(cc.KEY.down, playerPos);
            return;

        } else if (playerPos.x > 320 - 16) {
            playerPos.x = 32;
            this.onGotoNextRoom(cc.KEY.right, playerPos);
            return;

        } else if (playerPos.y > 240 - 32) {  //upper wall is 16pix taller
            playerPos.y = 32;
            this.onGotoNextRoom(cc.KEY.up, playerPos);
            return;
        }
//        waw.player.update(nextPos);
    }
});