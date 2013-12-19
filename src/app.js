"use strict";
//Global vars
var currentRoom = null;
var currentRoomX = 4, currentRoomY = 4; //The start room is 4,4 by default
var currentPlayerPos = cc.p(320/2,240/2); //Start player position. Global var to keep players coords

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function() {
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
    units: [],

    init: function() {
        this._super();

//        var size = cc.Director.getInstance().getWinSize();
//        var lazyLayer = cc.Layer.create();

        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

        //Initially draw room BG, walls, enemies onto layer
        currentRoom = rooms[currentRoomY][currentRoomX];
        if(currentRoom)
            waw.prepareRoomLayer(currentRoom,this);
        else
            throw "this room coords are out of the grid"
        //this.addChild(miniMapLayer);

        //if(createPlayer){
            console.info("new Player");
            //put player sprite on the screen
            this.player = new waw.Player();
            this.player.setPosition(currentPlayerPos);
            this.addChild(this.player, 5);
            this.player.runAction(cc.Blink.create(1, 5)); //Blink Player sprite

        //}
    },
onEnterTransitionDidFinish: function() {
    console.info("onEnterTransitionDidFinish ROOM: "+currentRoomX+","+currentRoomY);
    //put player sprite on the screen
//        this.player = new waw.Player();
//        this.player.setPosition(currentPlayerPos);
//        this.addChild(this.player, 5);
    },
onExitTransitionDidStart: function() {
        console.info("onExitTransitionDidStart ROOM: "+currentRoomX+","+currentRoomY);
        //put player sprite on the screen
//        this.player = new waw.Player();
//        this.player.setPosition(currentPlayerPos);
//        this.addChild(this.player, 5);
    },

onKeyDown: function(e) {
        if(this.player)
            this.player.keyDown(e);
    },
    onKeyUp: function(e) {
        if(this.player)
            this.player.keyUp(e);
    },
    /*     was debug function.
     now pass it cc.KEY.up, down, leftm right to go to the room     */
    onGotoNextRoom: function(e) {
//	    console.info("Goto next room");
        var room = null;
        var transition = cc.TransitionProgressRadialCW.create;   //transition for teleporting
        switch (e)
        {
            case cc.KEY.up:
                room = rooms[currentRoomY-1][currentRoomX];
                if(room){
                    currentRoomY -= 1;
                    transition = cc.TransitionSlideInB.create; //effect - scrolls one scene out
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[currentRoomY+1][currentRoomX];
                if(room){
                    currentRoomY += 1;
                    transition = cc.TransitionSlideInT.create;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[currentRoomY][currentRoomX-1];
                if(room){
                    currentRoomX -= 1;
                    transition = cc.TransitionSlideInL.create;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[currentRoomY][currentRoomX+1];
                if(room){
                    currentRoomX += 1;
                    transition = cc.TransitionSlideInR.create;
                } else
                    return;
                break;
        }

        this.setKeyboardEnabled(false); //or else you can re-run Player movement functions or so


        //NOW we prepare NEXT room to slide from current to the next one.
        //so we have to remove player from the currebt room
        //and create him for the next
        if(this.player) {
            this.removeChild(this.player,false);
        }

        currentRoom = room; //??? remove later
        //create new scene to put a layer of the next room into it. To use DIRECTOR to use transitions between scenes
        var nextScene = cc.Scene.create();
        var nextLayer;
    	nextLayer = new waw.MainLayer(true);
        nextLayer.init();
        nextScene.addChild(nextLayer);

        //stop all actions

//        cc.Director.getInstance().replaceScene(transition(0.5, nextScene));  //1st arg = in seconds duration of the transition
        cc.Director.getInstance().replaceScene(nextScene);

    },
    handleCollisions: function() {
        var me = this;
        var nextPos = this.player.getNextPosition();

        me.units.forEach(function(unit) {
            var rect = cc.rectIntersection(me.player.collideRect(nextPos), unit.collideRect());

            if (rect.width > 0 && rect.height > 0) // Collision!
            {
                var oldPos = me.player.getPosition();
                var oldRect = cc.rectIntersection(me.player.collideRect(oldPos), unit.collideRect());

                if (oldRect.height > 0)
                {
                    // Block the player horizontally
                    nextPos.x = oldPos.x;
                }

                if (oldRect.width > 0)
                {
                    // Block the player vertically
                    nextPos.y = oldPos.y;
                }
            }
        });

        return nextPos;
    },
    update: function(dt) {
        if(!this.player)
            return;
        var nextPos = this.handleCollisions();
        currentPlayerPos = nextPos;
        if(nextPos.x < 16) {
            currentPlayerPos.x = 320 - 32;
//            this.player.alive = false;
            this.removeChild(this.player,true);
            this.onGotoNextRoom(cc.KEY.left);
            return;
        } else
        if(nextPos.y < 16) {
            currentPlayerPos.y = 240 - 32;
//            this.player.alive = false;
            this.removeChild(this.player,true);
            this.onGotoNextRoom(cc.KEY.down);
            return;
        } else
        if(nextPos.x > 320-16) {
            currentPlayerPos.x = 32;
//            this.player.alive = false;
            this.removeChild(this.player,true);
            this.onGotoNextRoom(cc.KEY.right);
            return;
        } else
        if(nextPos.y > 240-16) {
            currentPlayerPos.y = 32;
//            this.player.alive = false;
            this.removeChild(this.player,true);
            this.onGotoNextRoom(cc.KEY.up);
            return;
        }
        this.player.update(nextPos);
    }
});
