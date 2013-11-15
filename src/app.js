"use strict";
waw.MainLayer = cc.Layer.extend({
    isMouseDown: false,
    player: null,
    units: [],

    init: function() {
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        var background = cc.Sprite.create(s_Background);
        background.setAnchorPoint(0, 0);
        lazyLayer.addChild(background, -1);

		this.player = new waw.Player();
		this.player.setPosition(cc.p(size.width / 2, size.height / 2));
		lazyLayer.addChild(this.player, 1);

        this.initWalls(size);
	// Temp! Add doors sprites 128x128
	// Left Door Place
        var door = cc.Sprite.create(s_Door);
	door.setPosition(24-64,size.height/2);
	lazyLayer.addChild(door);	
	// Right Door Place
        var door = cc.Sprite.create(s_Door);
	door.setPosition(64-24+size.width,size.height/2);
	lazyLayer.addChild(door);	
	// Left Door Place
        var door = cc.Sprite.create(s_Door);
	door.setPosition(24-64,size.height/2);
	lazyLayer.addChild(door);	
	// Left Door Place
        var door = cc.Sprite.create(s_Door);
	door.setPosition(24-64,size.height/2);
	lazyLayer.addChild(door);	

        var block;

        // Block #1
        block = new waw.Block();
        block.setPosition(200, 150);
        lazyLayer.addChild(block, 0);
        this.units.push(block);

        // Block #2
        block = new waw.Block();
        block.setPosition(100, 100);
        lazyLayer.addChild(block, 0);
        this.units.push(block);

        // Block #3 Moving
        block = new waw.MovingBlock();
        block.setPosition(40, 50);
        lazyLayer.addChild(block, 0);
        this.units.push(block);

        //this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();
        return true;
    },
    /*onTouchesBegan: function (touches, event) {
        this.isMouseDown = true;
    },
    onTouchesEnded: function (touches, event) {
        this.isMouseDown = false;
    },*/
	onKeyDown: function(e) {
        this.player.keyDown(e);
    },
	onKeyUp: function(e) {
        this.player.keyUp(e);
    },
    update: function(dt) {
        var nextPos = this.handleCollisions();
        this.player.update(nextPos);
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
    initWalls: function(size) {
        var wall;
        var wallSize = 32;

        // Top wall
        wall = new waw.Unit();
        wall.setPosition(size.width / 2, size.height - wallSize / 2);
        wall.setContentSize(new cc.Size(size.width, wallSize));
        this.units.push(wall);

        // Left wall
        wall = new waw.Unit();
        wall.setPosition(wallSize / 2, size.height / 2);
        wall.setContentSize(new cc.Size(wallSize, size.height));
        this.units.push(wall);

        // Right wall
        wall = new waw.Unit();
        wall.setPosition(size.width - wallSize / 2, size.height / 2);
        wall.setContentSize(new cc.Size(wallSize, size.height));
        this.units.push(wall);

        // Bottom wall
        wall = new waw.Unit();
        wall.setPosition(size.width / 2, wallSize / 2);
        wall.setContentSize(new cc.Size(size.width, wallSize));
        this.units.push(wall);
    }
});

waw.MainScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
	var level = waw.level;
        var layer = new waw.MainLayer();
        layer.init();
        this.addChild(layer);
    }
});