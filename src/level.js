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

//constructor - Walls in a Room
function Walls() {
	this.up = "wall";
	this.right = "wall";
	this.down = "wall";
	this.left = "wall";
	// ceiling & floor
	this.top = "wall";
	this.bottom = "wall";
} 

//a Room generator
function Room(_name,_x,_y) {
	this.name = _name || "nameless Room";
	this.x = _x;
	this.y = _y;
	this.walls = new Walls();
} 

var rooms = {};
rooms.initLevel = function() {
	//init level 9x9
	for(var y = 0; y < 9 ; y++) {
		rooms[y] = {};
		for(var x = 0; x < 9 ; x++) {
			//var t = new Room("name"+x+"_"+y,x,y);
			rooms[y][x] = null;
		}
	}
}

rooms.genLevel = function() {
	//1st Room is at 4,4 pas always
	var x = 4;
	var y = 4;
	var oldx = x;
	var oldy = y;
	var noCycle = 0;
    var temp = "empty";
	do {
		noCycle++;
		if(!rooms[y][x]) {
			var r = new Room("Room "+x+"-"+y,x,y);
			if(x == 4 && y == 4){ //for TEST mark start Room x4,y4
				//r.Walls.up = r.Walls.down = r.Walls.left = r.Walls.right = "empty";
				r.walls.bottom = "start";
			}
			//make connection between previous and current rooms
			if(oldx < x){
                if(Math.random()<0.2)   //20% chance for a closed door
                    temp = "door";
                else
                    temp = "empty";     //80% - passage
				rooms[oldy][oldx].walls.right = temp;
				r.walls.left = temp;
			}
			if(oldx > x){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
				rooms[oldy][oldx].walls.left = temp;
				r.walls.right = temp;
			}
			if(oldy < y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
				rooms[oldy][oldx].walls.down = temp;
				r.walls.up = temp;
			}
			if(oldy > y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
				rooms[oldy][oldx].walls.up = temp;
				r.walls.down = temp;
			}
			rooms[y][x] = r;
		} else {
			//cannot put a Room here
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
	//r.Walls.up = "door";

	//Room - marker 0,0
	x = 0; y = 0;
	r = new Room("Room "+x+"-"+y,x,y);
	r.walls.down = r.walls.right = "empty";
	rooms[y][x] = r;

	//Room - marker 8,8
	x = 8; y = 8;
	r = new Room("Room "+x+"-"+y,x,y);
	r.walls.up = r.walls.left = "empty";	
	rooms[y][x] = r;
}

//print 1 of 3 lines of the set Room 4 debug
// #|#  ###
// - -  # #  .
// #|#  ###
/*function getLineRoom(room, line){
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
}*/

//Small
/*rooms.printSLevel = function() {
	//print Small debug level map
	for(var y = 0; y < 9 ; y++) {
		var s ="";
		for(var x = 0; x < 9; x++) {
			var r = rooms[y][x];
			if(r)	//is it a start Room?
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
}*/




//Generate MiniMap
rooms.GenerateMiniMapLayer = function() {
    //bare map
    var layer;
    layer = new cc.Layer();
    //layer.setContentSize(cc.size(9*3-1,9*3-1));
    var draw = cc.DrawNode.create();
    layer.addChild(draw,10);
//    nextLayer.init();

    for(var y = 0; y < 9 ; y++) {
        for(var x = 0; x < 9; x++) {
            var r = rooms[y][x];
            if(r)	//is it a Room
                draw.drawDot( cc.p(x*3+1, y*3+1), 3, cc.c4f( Math.random(), Math.random(), Math.random(), 1) );
        }
    }
    return layer;
}

//preparesand adds elements of a room onto existing layer
waw.prepareRoomLayer = function(room, units, layer) {
    //layer.addChild();
    if(!room) throw "unknown room";
    if(!units) throw "need a units array to add elements";
    if(!layer) throw "need a layer to add elements";

    //add room Background
    var background = cc.Sprite.create(s_Background);
    background.setAnchorPoint(0, 0);
    layer.addChild(background, -1);

    //TODO add some random debris

    //add doors
    switch (room.walls.up) {
        case "door":
            var d = cc.Sprite.create(s_DoorUp);
            layer.addChild(d);
            d.setPosition(cc.p(160,208+16));
            //we set here obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160,240));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassUp);
            layer.addChild(d);
            d.setPosition(cc.p(160,208+16));
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160,240));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.right) {
        case "door":
            var d = cc.Sprite.create(s_DoorRight);
            layer.addChild(d);
            d.setPosition(cc.p(320-16,120));
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(320,120));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassRight);
            layer.addChild(d);
            d.setPosition(cc.p(320-16,120));
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(320,120));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.down) {
        case "door":
            var d = cc.Sprite.create(s_DoorDown);
            d.setPosition(cc.p(160,16));
            layer.addChild(d);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160,0));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassDown);
            d.setPosition(cc.p(160,16));
            layer.addChild(d);
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160,0));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.left) {
        case "door":
            var d = cc.Sprite.create(s_DoorLeft);
            d.setPosition(cc.p(16,120));
            layer.addChild(d);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(0,120));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassLeft);
            d.setPosition(cc.p(16,120));
            layer.addChild(d);
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(0,120));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }

    //TODO add room obstacles

    //print room coords X,Y at the upper left corner
    var label = cc.LabelTTF.create("ROOM: "+currentRoomX+","+currentRoomY, "Arial", 10);
    layer.addChild(label, 0); //, TAG_LABEL_SPRITE1);
    label.setPosition(cc.p(42, 240-10));
    label.setOpacity(200);

}

//init the current labyrinth of rooms;
rooms.initLevel();
rooms.genLevel();

//console.info("Small Level");
//rooms.printSLevel();
//console.info("Big Level");
//rooms.printLevel();
//console.log(rooms);