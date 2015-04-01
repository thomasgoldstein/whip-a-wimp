"use strict";
//our singleton
var waw = {
    curRoom: null,
    curRoomX: 4,
    curRoomY: 4, //The start room is 4,4 by default

    layer: null,    //main layer to attach units / sprites, etc
    player: null,   //player unit obj
    units: [],      //obstacles
    mobs: [],        //enemy units
    items: [],        //items

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
    },
    initScoreAndItems: function() {
        this.score = 0;
        this.keys = 0;
        this.coins = 0;
        this.gems = 0;
    }
};

//Global vars
var startPlayerPos = cc.p(320 / 2, 240 / 2); //Start player position. Global var to keep players coords
var rooms = []; //2d 9x9 array of the level rooms
var real_rooms = []; //1d array with all generated rooms

//debug vars
var showDebugInfo = false;

var TAG_SPRITE = 100+0;
var TAG_SHADOWSPRITE = 100+1;
var TAG_HITBOXSPRITE = 100+2;
var TAG_LABELSPRITE = 100+3;
var TAG_SPRITE_TEMP = 100+4;

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
var TAG_EXIT = 200+8;

var TAG_ENEMY= 300+0;
var TAG_BOSS= 300+1;

var TAG_SUBSTATE_ANIMATION = 400+0;

// Disable anti-aliasing
waw.ccTexture2D_handleLoadedTexture = cc.Texture2D.prototype.handleLoadedTexture;
cc.Texture2D.prototype.handleLoadedTexture = function() {
    waw.ccTexture2D_handleLoadedTexture.apply(this, arguments);
    this.setAliasTexParameters();
};