"use strict";
//Global vars
var currentRoom = null;
var currentRoomX = 4, currentRoomY = 4; //The start room is 4,4 by default
var currentPlayerPos = cc.p(320 / 2, 240 / 2); //Start player position. Global var to keep players coords

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

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
    isMouseDown: false,
    player: null,
    foes: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)

    init: function () {
        this._super();
//        var size = cc.Director.getInstance().getWinSize();

        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

        this.units = new Array();   //init array
        this.foes = new Array();
        //Initially draw room BG, walls, foes onto layer
        currentRoom = rooms[currentRoomY][currentRoomX];
        if (currentRoom) {
            waw.initWalls(currentRoom, this.units); //init array units with non-destructable walls (8 pieces)
            waw.prepareRoomLayer(currentRoom, this.units, this);
        } else
            throw "this room coords are out of the grid"
        //this.addChild(miniMapLayer);

        //console.info("new Player");
        //put player sprite on the screen
        this.player = new waw.Player();
        this.player.setPosition(currentPlayerPos);
        this.addChild(this.player, 250-currentPlayerPos.y);
        //anti stuck START POSITION of player check
        while( this.player.doesCollide(this.units)) {
            currentPlayerPos.x = Math.round(Math.random()*320);
            currentPlayerPos.y = Math.round(Math.random()*240);
            this.player.setPosition(currentPlayerPos);
        }
        //guess player sprite facing on spawn
        if (this.player.getPositionX() < 40) {
            this.player.direction.left = false;
            this.player.direction.right = true;
        } else if (this.player.getPositionY() < 40) {
            this.player.direction.down = false;
            this.player.direction.up = true;
        } else if (this.player.getPositionX() > 320 - 40) {
            this.player.direction.left = true;
            this.player.direction.right = false;
        } else if (this.player.getPositionY() > 240 - 40) {
            this.player.direction.down = true;
            this.player.direction.up = false;
        } else {
            this.player.direction.down = true;  //at room center, or other player pos
            this.player.direction.up = false;
        }
        this.player.update(currentPlayerPos);   //to update players sprite facing direction

        this.player.runAction(cc.Blink.create(1, 5)); //Blink Player sprite

        //-------------TEST enemy
        //TODO Plug. Temp put enemy on the screen
        for(var i=0; i<5; ++i){
            var e = new waw.Enemy();
            e.setPositionX(Math.round(Math.random()*(320-80)+40));
            e.setPositionY(Math.round(Math.random()*(240-80)+40));
            e.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
            this.addChild(e, 6);
            this.foes.push(e);
        }
        //anti stuck START POSITION of player check
       /* while( this.foes[0].doesCollide(this.units)) {
            currentPlayerPos.x = Math.round(Math.random()*320);
            currentPlayerPos.y = Math.round(Math.random()*240);
            this.player.setPosition(currentPlayerPos);
        }*/
    },
    onEnterTransitionDidFinish: function () {
        console.info("onEnterTransitionDidFinish ROOM: " + currentRoomX + "," + currentRoomY);
        //put player sprite on the screen
//        this.player = new waw.Player();
//        this.player.setPosition(currentPlayerPos);
//        this.addChild(this.player, 5);
    },
    onExitTransitionDidStart: function () {
        console.info("onExitTransitionDidStart ROOM: " + currentRoomX + "," + currentRoomY);
        //put player sprite on the screen
//        this.player = new waw.Player();
//        this.player.setPosition(currentPlayerPos);
//        this.addChild(this.player, 5);
    },

    onKeyDown: function (e) {
        if (this.player)
            this.player.keyDown(e);
    },
    onKeyUp: function (e) {
        if (this.player)
            this.player.keyUp(e);
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

        //this.setKeyboardEnabled(false); //or else you can re-run Player movement functions or so


        //NOW we prepare NEXT room to slide from current to the next one.
        //so we have to remove player from the currebt room
        //and create him for the next
        if (this.player) {
            this.removeChild(this.player, false);
        }

        currentRoom = room; //??? remove later
        //create new scene to put a layer of the next room into it. To use DIRECTOR to use transitions between scenes
        var nextScene = cc.Scene.create();
        var nextLayer;
        nextLayer = new waw.MainLayer(true);
        nextLayer.init();
        nextScene.addChild(nextLayer);

        //TODO Change 0.25 sec to 0.5, when the room transition glitch is fixed
        cc.Director.getInstance().replaceScene(transition(0.25, nextScene));  //1st arg = in seconds duration of the transition
//        cc.Director.getInstance().replaceScene(nextScene);    //Instant transition between rooms

    },
    handleCollisions: function () {
        var me = this;
        var nextPos = this.player.getNextPosition();

        me.units.forEach(function (unit) {
            var rect = cc.rectIntersection(me.player.collideRect(nextPos), unit.collideRect());
            //TODO check this condition && why not || ?
            if (rect.width > 0 && rect.height > 0) // Collision!
            {
                var oldPos = me.player.getPosition();
                var oldRect = cc.rectIntersection(me.player.collideRect(oldPos), unit.collideRect());

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

        return nextPos;
    },
    update: function (dt) {

        for(var i=0; i<this.foes.length; ++i){
            if(this.foes[i])
            this.foes[i].update(this); //pass current closure to have access to its Units arr
        }
        if (!this.player)
            return;
        var nextPos = this.handleCollisions();
        currentPlayerPos = nextPos;
        if (nextPos.x < 16) {
            currentPlayerPos.x = 320 - 32;
//            this.player.alive = false;
            this.removeChild(this.player, true);
            this.player.setPosition(nextPos);    //TODO Fix it better. this setpos insta moves player to the next room pos. It prevents running UPDATE several times at once.
            this.onGotoNextRoom(cc.KEY.left);
            return;
        } else if (nextPos.y < 16) {
            currentPlayerPos.y = 240 - 32;
//            this.player.alive = false;
            this.removeChild(this.player, true);
            this.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.down);
            return;
        } else if (nextPos.x > 320 - 16) {
            currentPlayerPos.x = 32;
//            this.player.alive = false;
            this.removeChild(this.player, true);
            this.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.right);
            return;
        } else if (nextPos.y > 240 - 16) {
            currentPlayerPos.y = 32;
//            this.player.alive = false;
            this.removeChild(this.player, true);
            this.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.up);
            return;
        }
        this.player.update(nextPos);
    }
});
