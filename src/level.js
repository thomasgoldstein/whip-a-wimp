"use strict";
//Level Generator

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
    this.visited = false;
    this.type = 0; //0 = clean room type
    this.nMonsters = Math.round(Math.random()*5);
// Random Seed to generate the same lists of decorative elements
    this.randomSeedDebris = Math.round(Math.random()*100000);
    this.randomSeedObstacles = Math.round(Math.random()*100000);

}

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
    var maxDy = 36; //+- max vertical shift of left + right doors
    var maxDx = 90; //+- max horizontal shift of up + down doors
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
            //set chance to set a pattern to 90%  TODO - put it back to 50
            if(Math.random() <= 0.9)
                r.type = Math.floor(Math.random()*7);
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
                    r.walls.left_d = rooms[oldy][oldx].walls.right_d = Math.round(maxDy - Math.random()*(maxDy*2)); // -maxDy .. maxDy
            }
			if(oldx > x){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.right = rooms[oldy][oldx].walls.left = temp;
                if(Math.random()<0.3)
                    r.walls.right_d = rooms[oldy][oldx].walls.left_d = Math.round(maxDy - Math.random()*(maxDy*2)); // // -maxDy .. maxDy
			}
			if(oldy < y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.up = rooms[oldy][oldx].walls.down = temp;
                if(Math.random()<0.3)
                    r.walls.up_d = rooms[oldy][oldx].walls.down_d = Math.round(maxDx - Math.random()*(maxDx*2)); // -maxDx .. maxDx
			}
			if(oldy > y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.down = rooms[oldy][oldx].walls.up = temp;
                if(Math.random()<0.3)
                    r.walls.down_d = rooms[oldy][oldx].walls.up_d = Math.round(maxDx- Math.random()*(maxDx*2)); // -maxDx .. maxDx
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

//Generate Mini Map Layer
waw.GenerateMiniMap = function() {
    var color = null;
//    var layer = cc.Layer.create(39, 39);    //transparent BG of mini-map
    var layer = cc.LayerColor.create(cc.c4b(0, 0, 0, 24), 39, 39);   //dark BG
    var draw = cc.DrawNode.create();
    layer.addChild(draw);

    for(var y = 0; y < 9 ; y++) {
        for(var x = 0; x < 9; x++) {
            var r = rooms[y][x];
            if(r) {	//is it a Room
                if(r.visited)
                    color = cc.c4f( 1,1,1, 0.5);
                else
                    color = cc.c4f( 0.2,0.2,0.2, 0.5);
                //4 passages
                if(r.walls.up != "wall")
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5 + 1.5), 0.5, color );
                if(r.walls.right != "wall")
                    draw.drawDot( cc.p(x*4+3.5 +1.5, (8-y)*4+3.5), 0.5, color );
                if(r.walls.down != "wall")
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5 - 1.5), 0.5, color );
                if(r.walls.left != "wall")
                    draw.drawDot( cc.p(x*4+3.5 -1.5, (8-y)*4+3.5), 0.5, color );
                //the room
                draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5), 1.7, color );
                //Draw yellow dot for player
                if(currentRoomX == x && currentRoomY == y)
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5), 1, cc.c4f( 25,0,0, 1) );
            }
        }
    }
    return layer;
};

//init 8 pieces of impassable walls
waw.initWalls = function(room) {
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;
    var wall;
    var wallSize = 32; //thickness of the border walls
    var wallSize2 = 44; //thickness of the TOP walls

    // Left wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-64));
    wall.setPosition(wallSize / 2, 240+room.walls.left_d);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Left wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-64));
    wall.setPosition(wallSize / 2, 0+   room.walls.left_d);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Right wall upper
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-64));
    wall.setPosition(320-wallSize / 2, 240+room.walls.right_d);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Right wall lower
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(wallSize, 240-64));
    wall.setPosition(320-wallSize / 2, 0+room.walls.right_d);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Top wall. left half
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 64, wallSize2));   //fat top wall
    wall.setPosition(0+room.walls.up_d, 240-wallSize2/2);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Top wall. right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 64, wallSize2));
    wall.setPosition(320+room.walls.up_d, 240-wallSize2/2);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Bottom wall left
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 64, wallSize));
    wall.setPosition(0+room.walls.down_d, wallSize / 2);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Bottom wall right
    wall = new waw.Unit();
    wall.setContentSize(new cc.Size(320 - 64, wallSize));
    wall.setPosition(320+room.walls.down_d, wallSize / 2);
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
};

//preparesand adds elements of a room onto existing layer
waw.prepareRoomLayer = function(room) {
    //layer.addChild();
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;

    //add room Background
    var floor = cc.Sprite.create(s_Floor);
    floor.setAnchorPoint(0, 0);
    layer.addChild(floor, -20); //Z index the lowest one
    var middleWalls = cc.Sprite.create(s_MiddleWalls);
    middleWalls.setAnchorPoint(0, 0);
    layer.addChild(middleWalls, -19);
    var upperWalls = cc.Sprite.create(s_UpperWalls);
    upperWalls.setAnchorPoint(0, 0);
    layer.addChild(upperWalls, 255);

    //add doors
    switch (room.walls.up) {    //FAT upper wall
        case "door":
            var d = cc.Sprite.create(s_Doors, cc.rect(0,80,80,80)); //closed door
            layer.addChild(d,-18);
            d.setPosition(cc.p(160+room.walls.up_d,240-48));
            //we set here obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(88, 88));
            wall.setPosition(cc.p(160+room.walls.up_d,240));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_Doors, cc.rect(0,0,80,80));  //open door
            layer.addChild(d,-18);
            d.setPosition(cc.p(160+room.walls.up_d,240-48));
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(88, 88));
            wall.setPosition(cc.p(160,240));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.right) {
        case "door":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*2,80,80,80)); //closed door
            layer.addChild(d,-18);
            d.setPosition(cc.p(320-32,120+room.walls.right_d));
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(320,120+room.walls.right_d));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*2,0,80,80)); //open door
            layer.addChild(d,-18);
            d.setPosition(cc.p(320-32,120+room.walls.right_d));
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(320,120));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.down) {
        case "door":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*3,80,80,80)); //closed door
            d.setPosition(cc.p(160+room.walls.down_d,32));
            layer.addChild(d,-18);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(160+room.walls.down_d,0));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*3,0,80,80)); //open door
            d.setPosition(cc.p(160+room.walls.down_d,32));
            layer.addChild(d,-18);
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(160,0));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    switch (room.walls.left) {
        case "door":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*1,80,80,80)); //closed door
            d.setPosition(cc.p(32,120+room.walls.left_d));
            layer.addChild(d,-18);
            // obstacle
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(0,120+room.walls.left_d));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
        case "empty":
            var d = cc.Sprite.create(s_Doors, cc.rect(80*1,0,80,80)); //open door
            d.setPosition(cc.p(32,120+room.walls.left_d));
            layer.addChild(d,-18);
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            var wall = new cc.Sprite.create(s_Empty32x32);
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(cc.p(0,120));
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
//            layer.addChild(wall); //DEBUG! to see obstacle
            break;
    }
    //put obstacles in the room
    waw.prepareRoomPattern(room);

    //print room coords X,Y at the upper left corner
    if(showDebugInfo) {
        var label = cc.LabelTTF.create("ROOM: "+currentRoomX+","+currentRoomY+" Type:"+room.type, "Arial", 10);
        layer.addChild(label, 300); //, TAG_LABEL_SPRITE1);
        label.setPosition(cc.p(48, 240-10));
        label.setOpacity(200);
    }

};

//adds obstacles of a room onto existing layer
waw.prepareRoomPattern = function(room) {
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;

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
    //we do not use "laying on the floor obstacles" now
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
            waw.putRoomObstacle(new cc.p(320/2,240/2), new cc.Size(32,16), new cc.p(320/2,240/2-8));
            break;
        case 2:
            //4 obstacles around the middle of the room
            waw.putRoomObstacle(new cc.p(320/3,240/3), new cc.Size(32,16), new cc.p(320/3,240/3-8));
            waw.putRoomObstacle(new cc.p(320/3,240-240/3), new cc.Size(32,16), new cc.p(320/3,240-240/3-8));
            waw.putRoomObstacle(new cc.p(320-320/3,240/3), new cc.Size(32,16), new cc.p(320-320/3,240/3-8));
            waw.putRoomObstacle(new cc.p(320-320/3,240-240/3), new cc.Size(32,16), new cc.p(320-320/3,240-240/3-8));
            break;
        case 3:
            //4 obstacles wide around the middle of the room
            waw.putRoomObstacle(new cc.p(320/4,240/4+8), new cc.Size(32,16), new cc.p(320/4,240/4-8+8));
            waw.putRoomObstacle(new cc.p(320/4,240-240/4-16), new cc.Size(32,16), new cc.p(320/4,240-240/4-8-16));
            waw.putRoomObstacle(new cc.p(320-320/4,240/4+8), new cc.Size(32,16), new cc.p(320-320/4,240/4-8+8));
            waw.putRoomObstacle(new cc.p(320-320/4,240-240/4-16), new cc.Size(32,16), new cc.p(320-320/4,240-240/4-8-16));
            break;
        case 4:
            //1 obstacle in the middle of the room
            waw.putRoomObstacle(new cc.p(320/2,240/2), new cc.Size(32,16), new cc.p(320/2,240/2-8));
            //4 obstacles wide around the middle of the room
            waw.putRoomObstacle(new cc.p(320/4,240/4+8), new cc.Size(32,16), new cc.p(320/4,240/4-8+8));
            waw.putRoomObstacle(new cc.p(320/4,240-240/4-16), new cc.Size(32,16), new cc.p(320/4,240-240/4-8-16));
            waw.putRoomObstacle(new cc.p(320-320/4,240/4+8), new cc.Size(32,16), new cc.p(320-320/4,240/4-8+8));
            waw.putRoomObstacle(new cc.p(320-320/4,240-240/4-16), new cc.Size(32,16), new cc.p(320-320/4,240-240/4-8-16));
            break;
        case 5:
            //horizontal line of obstacles in the room
            for(var x = 0; x <= 80; x += 64){
                var y1 = 240/2+(Math.round(waw.rand()*8-4))-16;
                waw.putRoomObstacle(new cc.p(160+x,y1), new cc.Size(32,16), new cc.p(160+x,y1-8));
                if(x!=0)
                    waw.putRoomObstacle(new cc.p(160-x,y1), new cc.Size(32,16), new cc.p(160-x,y1-8));
            }
            break;
        case 6:
            //vertical line of obstacles in the room
            for(var y = 0; y <= 60; y += 48) {
                var x1 = 320/2+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(new cc.p(x1,114+y), new cc.Size(32,16), new cc.p(x1,114+y-8));
                if(y!=0)
                    waw.putRoomObstacle(new cc.p(x1,114-y), new cc.Size(32,16), new cc.p(x1,114-y-8));
            }
            break;
    }

};

//adds obstacles of a room onto existing layer
waw.putRoomObstacle = function(pos, hitbox, hitboxPos) {
    var units = waw.units;
    var layer = waw.layer;

    //var sprite = cc.Sprite.create(s_Pillar,cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 64)); //to pick random
    var sprite = cc.Sprite.create(s_Pillar,cc.rect(0, 0, 32, 64));
    //coords in the room
    pos.y += 20;
    sprite.setPosition(pos);
    layer.addChild(sprite, 20+ 250 - pos.y);
    var wall = new waw.Unit();
    hitboxPos.y += 8;   //4
    wall.setContentSize(hitbox); //collision box
    wall.setPosition(hitboxPos); //collision box 32x16
    units.push(wall);

    //debug
    waw.AddHitBoxSprite(wall, layer);
};