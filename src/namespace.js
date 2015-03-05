/**
 * @namespace
 */
"use strict";
//our singleton
var waw = {
    layer: null,    //main layer to attach units / sprites, etc
    player: null,   //player unit obj
    units: [],      //obstacles
    foes: [],        //enemy units
    items: [],        //items
    hitBoxField: [], // [320][240] of passable/not of the current level
    KEYS: [], // list of pressed keys. bool
    score: 0,
    hiScore: 100,
    keys: 0,
    coins: 0,
    gems: 0,
    addScore: function(n) {
        this.score += n;
        if(this.score > this.hiScore )
            this.hiScore = this.score;
    }
};
//waw.KEYS[cc.KEY.up] = waw.KEYS[cc.KEY.down] = waw.KEYS[cc.KEY.left] = waw.KEYS[cc.KEY.right] = false;

//Global vars
var currentRoom = null;
var currentRoomX = 4, currentRoomY = 4; //The start room is 4,4 by default
var startPlayerPos = cc.p(320 / 2, 240 / 2); //Start player position. Global var to keep players coords
var rooms = []; //2d 9x9 array of the level rooms
var real_rooms = []; //1d array with all generated rooms

//console.log(cc.Director.getInstance().waw);

//debug vars
var showDebugInfo = false;

var TAG_SPRITE = 100+0;
var TAG_SHADOWSPRITE = 100+1;
var TAG_HITBOXSPRITE = 100+2;
var TAG_LABELSPRITE = 100+3;

var TAG_PILLAR = 110+0;
var TAG_CHEST = 110+1;

var TAG_WHIP = 120+0;

var TAG_UP_DOOR = 200+0;
var TAG_RIGHT_DOOR = 200+1;
var TAG_DOWN_DOOR = 200+2;
var TAG_LEFT_DOOR = 200+3;
var TAG_UP_DOORD = 200+4;
var TAG_RIGHT_DOORD = 200+5;
var TAG_DOWN_DOORD = 200+6;
var TAG_LEFT_DOORD = 200+7;

var TAG_ENEMY= 300+0;
var TAG_BOSS= 300+1;

var TAG_SUBSTATE_ANIMATION = 400+0;


//instance of the audio
//var audioEngine = cc.AudioEngine.getInstance();