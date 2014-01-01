"use strict";

//Level Generator
//console.log("Init...");
//console.log(document); //you can log virtually any JavaScript object
//you can specify the type of message
//console.debug("debug"); 
//console.info("info"); 
//console.warn("warn");

//constructor - Walls in a Room
function Walls() {
	this.up = "wall";   //wall type
	this.right = "wall";
	this.down = "wall";
	this.left = "wall";
    this.up_d = 0;      //the passage/door DELTA offset in pixels +-100px
    this.right_d = 0;
    this.down_d = 0;
    this.left_d = 0;
    // ceiling & floor
    //TODO add usage of top / bottom ladders in the level
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
            var d = 0; //delta offset of the door/passage position
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
                r.walls.left = rooms[oldy][oldx].walls.right = temp;
                if(Math.random()<1)     //30% - chance of the shifted passage
                    r.walls.left_d = rooms[oldy][oldx].walls.right_d = Math.round(100- Math.random()*200); // -100 .. 100
            }
			if(oldx > x){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.right = rooms[oldy][oldx].walls.left = temp;
                if(Math.random()<1)
                    r.walls.right_d = rooms[oldy][oldx].walls.left_d = Math.round(100- Math.random()*200); // -100 .. 100
			}
			if(oldy < y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.up = rooms[oldy][oldx].walls.down = temp;
                if(Math.random()<1)
                    r.walls.up_d = rooms[oldy][oldx].walls.down_d = Math.round(80- Math.random()*160); // -80 .. 80
			}
			if(oldy > y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.down = rooms[oldy][oldx].walls.up = temp;
                if(Math.random()<1)
                    r.walls.down_d = rooms[oldy][oldx].walls.up_d = Math.round(80- Math.random()*160); // -80 .. 80
			}
			rooms[y][x] = r;
		} else {
			//cannot put a Room here
			noCycle--;
		}

		oldx = x;
		oldy = y;
		// % CHANCE //randomly move to the next room in the generated maze
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

//init 8 pieces of impassable walls
waw.initWalls = function(room,units) {
    if(!room) throw "unknown room";
    if(!units) throw "need a units array to add elements";
    var wall;
    var wallSize = 16; //thickness of the border walls

//    console.log(room);

    //TODO - fill gaps in corners.. due to shifted invisible walls
    // Top wall left
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(0+room.up_d, 240-wallSize/2);
    units.push(wall);
    // Top wall right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(320+room.up_d, 240-wallSize/2);
    units.push(wall);

    // Left wall upper
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(wallSize / 2, 240+room.left_d);
    units.push(wall);
    // Left wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(wallSize / 2, 0+room.left_d);
    units.push(wall);

    // Right wall upper
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(320-wallSize / 2, 240+room.right_d);
    units.push(wall);
    // Right wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(320-wallSize / 2, 0+room.right_d);
    units.push(wall);

    // Bottom wall left
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(0+room.down_d, wallSize / 2);
    units.push(wall);
    // Bottom wall right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(320+room.down_d, wallSize / 2);
    units.push(wall);
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
            d.setPosition(cc.p(160+room.walls.up_d,208+16));
            //we set here obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160+room.walls.up_d,240));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassUp);
            layer.addChild(d);
            d.setPosition(cc.p(160+room.walls.up_d,208+16));
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
            d.setPosition(cc.p(320-16,120+room.walls.right_d));
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(320,120+room.walls.right_d));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassRight);
            layer.addChild(d);
            d.setPosition(cc.p(320-16,120+room.walls.right_d));
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
            d.setPosition(cc.p(160+room.walls.down_d,16));
            layer.addChild(d);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(160+room.walls.down_d,0));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassDown);
            d.setPosition(cc.p(160+room.walls.down_d,16));
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
            d.setPosition(cc.p(16,120+room.walls.left_d));
            layer.addChild(d);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(32, 32));
            wall.setPosition(cc.p(0,120+room.walls.left_d));
            units.push(wall);
            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_PassLeft);
            d.setPosition(cc.p(16,120+room.walls.left_d));
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