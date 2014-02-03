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
    this.type = 0; //0 = clean room type
// Random Seed to generate the same lists of decorative elements
    this.randomSeedDebris = Math.round(Math.random()*100000);
    this.randomSeedObstacles = Math.round(Math.random()*100000);

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
};

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
                r.type = 0; //clean room. no obstacles in it
			}

            //random type of the room obstacles pattern
            //set chance to 90%  TODO - put it back to 50
            if(Math.random() <= 0.9)
                r.type = Math.floor(Math.random()*11);
            else
                r.type = 0;

			//make connection between previous and current rooms
			if(oldx < x){
                if(Math.random()<0.2)   //20% chance for a closed door
                    temp = "door";
                else
                    temp = "empty";     //80% - passage
                r.walls.left = rooms[oldy][oldx].walls.right = temp;
                //TODO in the final ver, make the cance of the shifted door at 30% 1-> 0.3 . Now it is for debugging
                if(Math.random()<0.3)     //30% - chance of the shifted passage
                    r.walls.left_d = rooms[oldy][oldx].walls.right_d = Math.round(80- Math.random()*160); // -80 .. 80
            }
			if(oldx > x){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.right = rooms[oldy][oldx].walls.left = temp;
                if(Math.random()<0.3)
                    r.walls.right_d = rooms[oldy][oldx].walls.left_d = Math.round(80- Math.random()*160); // -80 .. 80
			}
			if(oldy < y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.up = rooms[oldy][oldx].walls.down = temp;
                if(Math.random()<0.3)
                    r.walls.up_d = rooms[oldy][oldx].walls.down_d = Math.round(100- Math.random()*200); // -100 .. 100
			}
			if(oldy > y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.down = rooms[oldy][oldx].walls.up = temp;
                if(Math.random()<0.3)
                    r.walls.down_d = rooms[oldy][oldx].walls.up_d = Math.round(100- Math.random()*200); // -100 .. 100
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

    //start room[4,4] should have no obstacles!
    rooms[4][4].type = 0;
};

//Generate MiniMap
//TODO it doesnt work
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
};

//init 8 pieces of impassable walls
waw.initWalls = function(room,units) {
    if(!room) throw "unknown room";
    if(!units) throw "need a units array to add elements";
    var wall;
    var wallSize = 16; //thickness of the border walls

    // Left wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(wallSize / 2, 240+room.walls.left_d);
    units.push(wall);
    // Left wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(wallSize / 2, 0+   room.walls.left_d);
    units.push(wall);

    // Right wall upper
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(320-wallSize / 2, 240+room.walls.right_d);
    units.push(wall);
    // Right wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-32));
    wall.setPosition(320-wallSize / 2, 0+room.walls.right_d);
    units.push(wall);

    // Top wall. left half
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(0+room.walls.up_d, 240-wallSize/2);
    units.push(wall);
    // Top wall. right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(320+room.walls.up_d, 240-wallSize/2);
    units.push(wall);

    // Bottom wall left
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(0+room.walls.down_d, wallSize / 2);
    units.push(wall);
    // Bottom wall right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 32, wallSize));
    wall.setPosition(320+room.walls.down_d, wallSize / 2);
    units.push(wall);
};

//preparesand adds elements of a room onto existing layer
waw.prepareRoomLayer = function(room, units, layer) {
    //layer.addChild();
    if(!room) throw "unknown room";
    if(!units) throw "need a units array to add elements";
    if(!layer) throw "need a layer to add elements";

    //add room Background
    var background = cc.Sprite.create(s_Background);
    background.setAnchorPoint(0, 0);
    layer.addChild(background, -10);

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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
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
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    //put obstacles in the room
    waw.prepareRoomPattern(room, units, layer);

    //print room coords X,Y at the upper left corner
    var label = cc.LabelTTF.create("ROOM: "+currentRoomX+","+currentRoomY+" Type:"+room.type, "Arial", 10);
    layer.addChild(label, 0); //, TAG_LABEL_SPRITE1);
    label.setPosition(cc.p(42, 240-10));
    label.setOpacity(200);

};

//adds obstacles of a room onto existing layer
waw.prepareRoomPattern = function(room, units, layer) {
    if(!room) throw "unknown room";
    if(!units) throw "need a units array to add elements";
    if(!layer) throw "need a layer to add elements";

    //some random debris to PSEUDO random per a room
    waw.rand = new Math.seedrandom(room.randomSeedDebris); //a temp Pseudo random func with set seed
    for(var x = 0; x < waw.rand()*2; x++) { //*3+1
        var d = cc.Sprite.create(s_Debris,
            cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 32));

        layer.addChild(d,-9); //on the floor
        d.setPosition(cc.p(Math.round(64+waw.rand()*192),Math.round(64+waw.rand()*112)));
        if(waw.rand()>0.5)
            continue;
        d.setRotation(waw.rand()*360);
        if(waw.rand()>0.5)
            continue;
        d.setScale(0.75 + waw.rand()*0.3);
        //d.runAction(cc.FadeTo.create(5,0.5));
    }
    //TODO remove them from there. they'll be in the patterns
/*
    for(var x = 0; x < waw.rand()*2; x++) {
        var d = cc.Sprite.create(s_Pit,
            cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 32));
        layer.addChild(d,-8); //on the floor
        d.setPosition(cc.p(Math.round(64+waw.rand()*192),Math.round(64+waw.rand()*112)));
        units.push(d);
    }
*/

    //now put some obstacles, according to the room.type
    waw.rand = new Math.seedrandom(room.randomSeedObstacles); //a temp Pseudo random func with set seed
    switch(room.type){
        case 0:
            //no obstacles
            break;
        case 1:
            //1 obstacle in the middle of the room
            waw.putRoomObstacle(units, layer, new cc.p(320/2,240/2), new cc.Size(32,16), new cc.p(320/2,240/2-8));
            break;
        case 2:
            //horizontal line of obstacles in the room
            for(var x = 64; x <= 320-64; x += 48){
                var y1 = 240/2+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x,y1), new cc.Size(32,16), new cc.p(x,y1-8));
            }
            break;
        case 3:
            //vertical line of obstacles in the room
            for(var y = 64; y <= 240-48; y += 32) {
                var x1 = 320/2+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x1,y), new cc.Size(32,16), new cc.p(x1,y-8));
            }
            break;
        case 4:
            //2 horizontal lines of obstacles in the room
            for(var x = 64; x <= 320-64; x += 48) {
                var y1 = 240/3+(Math.round(waw.rand()*8-4));
                var y2 = 240-240/3+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x,y1), new cc.Size(32,16), new cc.p(x,y1-8));
                waw.putRoomObstacle(units, layer, new cc.p(x,y2), new cc.Size(32,16), new cc.p(x,y2-8));
            }
            break;
        case 5:
            //2 vertical lines of obstacles in the room
            for(var y = 64; y <= 240-48; y += 32) {
                var x1 = 104+(Math.round(waw.rand()*8-4));
                var x2 = 320-104+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x1,y), new cc.Size(32,16), new cc.p(x1,y-8));
                waw.putRoomObstacle(units, layer, new cc.p(x2,y), new cc.Size(32,16), new cc.p(x2,y-8));
            }
            break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            //square of obstacles in the room
            for(var x = 64; x <= 320-64; x += 48) {
                var y1 = 240/3+(Math.round(waw.rand()*8-4));
                var y2 = 240-240/3+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x,y1), new cc.Size(32,16), new cc.p(x,y1-8));
                waw.putRoomObstacle(units, layer, new cc.p(x,y2), new cc.Size(32,16), new cc.p(x,y2-8));
            }
            for(var y = 64; y <= 240-48; y += 32) {
                var x1 = 104+(Math.round(waw.rand()*8-4));
                var x2 = 320-104+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(units, layer, new cc.p(x1,y), new cc.Size(32,16), new cc.p(x1,y-8));
                waw.putRoomObstacle(units, layer, new cc.p(x2,y), new cc.Size(32,16), new cc.p(x2,y-8));
            }
            break;
    }

};

//adds obstacles of a room onto existing layer
waw.putRoomObstacle = function(units, layer, pos, hitbox, hitboxPos) {
    if(!units) throw "need a units array to add elements";
    if(!layer) throw "need a layer to add elements";

    var sprite = cc.Sprite.create(s_Block,cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 32));
    //coords in the room
    sprite.setPosition(pos);
    layer.addChild(sprite, 250 - pos.y);
    var wall = new waw.Unit();
    wall.setContentSize(hitbox); //collision box
    wall.setPosition(hitboxPos); //collision box 32x16
    units.push(wall);
};


//init the current labyrinth of rooms;
rooms.initLevel();
rooms.genLevel();

//console.info("Small Level");
//rooms.printSLevel();
//console.info("Big Level");
//rooms.printLevel();
//console.log(rooms);