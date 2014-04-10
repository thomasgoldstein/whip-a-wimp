"use strict";

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        //init the current labyrinth of rooms;
        rooms.initLevel();
        rooms.genLevel();

        waw.player = new waw.Player();

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
//    isMouseDown: false,
    foes: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)

    init: function () {
        this._super();
        console.info("init layer", currentRoomX, currentRoomY);
        //var w = cc.Director.getInstance().waw;  //global vars at singleton Director.waw
        waw.layer = this;
        waw.units = []; //clear obstacles
        this.units = waw.units;

        //this.setKeyboardEnabled(true);
        //this.scheduleUpdate();

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

//        else if ('mouse' in sys.capabilities)
//            this.setMouseEnabled(true);
        if ('touches' in sys.capabilities) {
//            this.setTouchEnabled(true);

            //Controls buttons
            var circle = cc.Sprite.create(s_TouchControls,
                cc.rect(0, 0, 48, 48));
            var buttons = cc.Sprite.create(s_TouchControls,
                cc.rect(48, 0, 48, 48));
            circle.setPosition(24, 24);
            buttons.setPosition(320 - 24, 24);
            this.addChild(circle, 400);
            this.addChild(buttons, 400);
            circle.runAction(cc.FadeIn.create(1, 2));
            buttons.runAction(cc.FadeIn.create(1, 2));
        }

        //Debug menu
        waw.MenuDebug(this);
    },
    onEnter: function () {
        var m, e,pos;
        this._super();
        console.info("onEnter ROOM",currentRoomX,currentRoomY);

        waw.player.update(currentPlayerPos);   //to update players sprite facing direction
        //attach players shadow to layer OVER BG floor (its Z index = -15)
        //TODO
        this.addChild(waw.player.shadowSprite,-14);
        this.addChild(waw.player,250-currentPlayerPos.y);
        waw.player.setScale(0.8);
        waw.player.runAction(cc.ScaleTo.create(0.25, 1));
//        waw.player.runAction(cc.Blink.create(0.5, 3)); //Blink Player sprite


        //put enemy on the layer
        this.foes = [];
        //TODO Plug. Temp put enemy on the screen
//        debugger;
        for(var i=0; i<currentRoom.mobs.length; i++){
            m = currentRoom.mobs[i];
            //TODO choose m.mobType
            e = new waw.Enemy();
            pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            m.mob = e; //to get some params of the mob later, when u exit the room
            e.setZOrder(250 - pos.y);
            e.setScale(0.1);
            e.runAction(cc.ScaleTo.create(0.5, 1));
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
        waw.player.movement.down =
            waw.player.movement.up =
                waw.player.movement.left =
                    waw.player.movement.right = false;

        this.setKeyboardEnabled(true);
        if ('touches' in sys.capabilities)
            this.setTouchEnabled(true);
        this.scheduleUpdate();
    },
    onExitTransitionDidStart: function () {
        var m,pos,mf;
//        debugger;
        this._super();
        console.info("onExitTransitionDidStart ROOM",currentRoomX,currentRoomY);
        this.setKeyboardEnabled(false);
        this.setTouchEnabled(false);
//        this.unscheduleUpdate();    //disable update:
        //this.removeAllActions();
        this.removeChild(waw.player.shadowSprite);

        for(var i=0; i<currentRoom.mobs.length; i++) {
            m = currentRoom.mobs[i];
            if(!m)
                continue;
            if(!m.mob)      //TODO why it might be NULL ? cant find the prob
                continue;
            pos = m.mob.getPositionF();
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
        var pos = touch[0].getLocation();
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
        }
    },
    onTouchesEnded: function(touch, event){
//        console.log(touch, event);
        if(!touch[0])
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
        }
    },
    onKeyDown: function (e) {
        //if (waw.player)
            waw.player.keyDown(e);
    },
    onKeyUp: function (e) {
        //if (waw.player)
            waw.player.keyUp(e);
    },
    /*     was debug function.
     now pass it cc.KEY.up, down, leftm right to go to the room     */
    onGotoNextRoom: function (e) {
//	    console.info("Goto next room");
        var room = null;
        var transition = cc.TransitionProgressRadialCW.create;   //transition for teleporting
        switch (e) {
            case cc.KEY.up:
                room = rooms[currentRoomY - 1][currentRoomX];
                if (room) {
                    currentRoomY -= 1;
                    transition = cc.TransitionSlideInB.create; //effect - scrolls one scene out
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[currentRoomY + 1][currentRoomX];
                if (room) {
                    currentRoomY += 1;
                    transition = cc.TransitionSlideInT.create;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[currentRoomY][currentRoomX - 1];
                if (room) {
                    currentRoomX -= 1;
                    transition = cc.TransitionSlideInL.create;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[currentRoomY][currentRoomX + 1];
                if (room) {
                    currentRoomX += 1;
                    transition = cc.TransitionSlideInR.create;
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
        var nextScene = cc.Scene.create();
        var nextLayer = new waw.MainLayer();
        nextLayer.init();
        nextScene.addChild(nextLayer);

        waw.player.unscheduleUpdate();
        this.unscheduleUpdate();
        //TODO Change 0.25 sec to 0.5, when the room transition glitch is fixed
        cc.Director.getInstance().replaceScene(transition(0.5, nextScene));  //1st arg = in seconds duration of the transition
        //0.25
//        cc.Director.getInstance().replaceScene(nextScene);    //Instant transition between rooms
        //TODO doesnt appear
        //nextLayer.addChild(waw.player);
        //nextLayer.addChild(waw.player.shadowSprite,-14);

    },
    handleCollisions: function () {
        var me = this;
        var nextPos = waw.player.getNextPosition();
        var oldPos = waw.player.getPosition();
        me.units.forEach(function (unit) {
            var rect = cc.rectIntersection(waw.player.collideRect(nextPos), unit.collideRect());
            //TODO check this condition && why not || ?
            if (rect.width > 0 && rect.height > 0) // Collision!
            {
//                var oldPos = waw.player.getPosition();
                var oldRect = cc.rectIntersection(waw.player.collideRect(oldPos), unit.collideRect());

                if (oldRect.height > 0) {
                    // Block the player horizontally
                    nextPos.x = oldPos.x;
                }

                if (oldRect.width > 0) {
                    // Block the player vertically
                    nextPos.y = oldPos.y;
                }
            }
        });
//        if(oldPos.x == nextPos.x || oldPos.y == nextPos.y ){
//            waw.player.runAction(cc.Blink.create(0.5, 2)); //Blink Foe sprite
//        }
        return nextPos;
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
//        if (!waw.player)
//            return;
        var nextPos = this.handleCollisions();
        currentPlayerPos = nextPos;
        if (nextPos.x < 16) {
            currentPlayerPos.x = 320 - 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);    //TODO Fix it better. this setpos insta moves player to the next room pos. It prevents running UPDATE several times at once.
            this.onGotoNextRoom(cc.KEY.left);
            return;
        } else if (nextPos.y < 16) {
            currentPlayerPos.y = 240 - 32 - 16; //upper wall is 16pix taller
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.down);
            return;
        } else if (nextPos.x > 320 - 16) {
            currentPlayerPos.x = 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.right);
            return;
        } else if (nextPos.y > 240 - 32) {  //upper wall is 16pix taller
            currentPlayerPos.y = 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.up);
            return;
        }
        waw.player.update(nextPos);
    }
});

//adds grid sprite to show hit Box
waw.AddHitBoxSprite = function (unit, layer, tag){
    //if(!showDebugInfo) return;
    var tag = tag | 0;
    var contentSize = unit.getContentSize();
    var sprite = cc.Sprite.create(s_HitBoxGrid, cc.rect(0, 0, contentSize.width, contentSize.height));
    sprite.setPositionX(unit.getPositionX());
    sprite.setPositionY(unit.getPositionY());
    layer.addChild(sprite,300, tag);
    unit.debugCross = sprite;
    unit.debugCross.setVisible(showDebugInfo);
//    sprite.runAction(cc.FadeOut.create(10)); //remove marks
}