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
};
//waw.KEYS[cc.KEY.up] = waw.KEYS[cc.KEY.down] = waw.KEYS[cc.KEY.left] = waw.KEYS[cc.KEY.right] = false;

//Global vars
var currentRoom = null;
var currentRoomX = 4, currentRoomY = 4; //The start room is 4,4 by default
var startPlayerPos = cc.p(320 / 2, 240 / 2); //Start player position. Global var to keep players coords
var rooms = {};

//console.log(cc.Director.getInstance().waw);

//debug vars
var showDebugInfo = false;

//instance of the audio
//var audioEngine = cc.AudioEngine.getInstance();