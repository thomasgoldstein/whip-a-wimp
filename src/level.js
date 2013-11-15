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
	var oldx = x;
	var oldy = y;
	var noCycle = 0;
	do {
		noCycle++;
		if(!rooms[y][x]) {
			var r = new room("Room "+x+"-"+y,x,y);
			if(x == 4 && y == 4){ //for TEST mark start room
				//r.walls.up = r.walls.down = r.walls.left = r.walls.right = "empty";
				r.walls.bottom = "start";
			}
			//make connection between previous and current rooms
			if(oldx < x){
				rooms[oldy][oldx].walls.right = "empty";
				r.walls.left = "empty";
			}
			if(oldx > x){
				rooms[oldy][oldx].walls.left = "empty";
				r.walls.right = "empty";
			}
			if(oldy < y){
				rooms[oldy][oldx].walls.down = "empty";
				r.walls.up = "empty";
			}
			if(oldy > y){
				rooms[oldy][oldx].walls.up = "empty";
				r.walls.down = "empty";
			}
			rooms[y][x] = r;
		} else {
			//cannot put a room here
			noCycle--;
		}

		oldx = x;
		oldy = y;
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

	//room - marker 0,0
	x = 0; y = 0;
	r = new room("Room "+x+"-"+y,x,y);
	r.walls.down = r.walls.right = "empty";
	rooms[y][x] = r;

	//room - marker 8,8
	x = 8; y = 8;
	r = new room("Room "+x+"-"+y,x,y);
	r.walls.up = r.walls.left = "empty";	
	rooms[y][x] = r;
}

//print 1 of 3 lines of the set room 4 debug
// #|#  ###
// - -  # #  .
// #|#  ###
function getLineRoom(room, line){
	if(!room)
		if(line == 1)
			return " . ";
		else
			return "   ";
	switch(line){
	case 0:	//up
		if(room.walls.up == "wall")
			return "###";
		else
			return "#|#";
	case 1:	//left + right
		return ((room.walls.left == "wall")?"#":"-")+((room.walls.bottom == "start")?"S":" ")+((room.walls.right == "wall")?"#":"-");
	case 2:	//down
		if(room.walls.down == "wall")
			return "##W";
		else
			return "#|#"; // i return different line, because FireBug does shorten the outpt. If I output 2 equal lines, it prints only 1 instead
	default:
		return "???";
	}
}

//Small
rooms.printSLevel = function() {
	//print Small debug level map
	for(var y = 0; y < 9 ; y++) {
		var s ="";
		for(var x = 0; x < 9; x++) {
			var r = rooms[y][x];
			if(r)	//is it a start room?
				if(r.walls.bottom == "start")
					s = s + "S";
				else
					s = s + "W";
				//s = s + r.name[0];
			else	//wall
				s = s + ".";
		}
		console.log(s);
	}
}

//BIG
rooms.printLevel = function() {
	//print debug level map
	for(var y = 0; y < 9 ; y++) {
		for(var i=0; i<3; i++) {
			var s ="";
			for(var x = 0; x < 9; x++) {
				s = s + getLineRoom(rooms[y][x], i);
				//if(rooms[y][x])
				//	s = s + rooms[y][x].name[0];
				//else
				//	s = s + "#";
			}
			console.log(s);
		}
	}
}


rooms.initLevel();
rooms.genLevel();
console.info("Small Level");
rooms.printSLevel();
console.info("Big Level");
rooms.printLevel();

console.log(rooms);