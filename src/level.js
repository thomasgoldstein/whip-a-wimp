"use strict";
//Level Generator
//console.log("Init...");
//console.log(document); //you can log virtually any JavaScript object
//you can specify the type of message
//console.debug("debug"); 
//console.info("info"); 
//console.warn("warn");

// #####
// #####
// ##S##
// #####
// #####

//constructor - walls in a room
function walls() {
	this.up = "wall";
	this.right = "wall";
	this.down = "wall";
	this.left = "wall";
	// ceiling & floor
	this.top = "wall";
	this.bottom = "wall";
} 

//a room generator
function room(_name,_x,_y) {
	this.name = _name || "nameless room";
	this.x = _x;
	this.y = _y;
	this.walls = new walls();
} 

var rooms = {};
rooms.initLevel = function() {
	//init level 9x9
	for(var y = 0; y < 9 ; y++) {
		rooms[y] = {};
		for(var x = 0; x < 9 ; x++) {
			//var t = new room("name"+x+"_"+y,x,y);
			rooms[y][x] = null;
		}
	}
}

rooms.genLevel = function() {
	//1st room is at 4,4 pas always
	var x = 4;
	var y = 4;
	var noCycle = 0;
	do {
		noCycle++;
		if(!rooms[x][y]) {
			var r = new room("Room "+x+"-"+y,x,y);
			rooms[x][y] = r;
		} else {
			//cannot put a room here
			noCycle--;
		}

		// % CHANCE
		if(Math.random()*100 < 50) {
			//X
			if(Math.random()*100 < 50)
				x++;
			else
				x--;	
		} else {
			//Y
			if(Math.random()*100 < 50)
				y--;
			else
				y++;
		}
		//check for bounds
		if(x>=8) {
			x=8;
			//noCycle--;
		}
		if(x<0) {
			x=0;
			//noCycle--;
		}
		if(y>=8) {
			y=8;
			//noCycle--;
		}
		if(y<0) {
			y=0;
			//noCycle--;
		}

		//check for max number of rooms to generate
	} while(noCycle<15 );
	//r.walls.up = "door";
}

rooms.printLevel = function() {
	//print debug level map
	for(var y = 0; y < 9 ; y++) {
		var s =""
		for(var x = 0; x < 9 ; x++) {
			if(rooms[y][x])
				s = s + rooms[y][x].name[0];
			else
				s = s + "#";
		}
		console.log(s);
	}
}

rooms.initLevel();
rooms.genLevel();
rooms.printLevel();

console.log(rooms);