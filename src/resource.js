"use strict";
var themeDir = "res/Themes/Temple/";
waw.gfx = {
    barrel: themeDir + "Barrel.png",
    bat: themeDir + "Bat.png",
    cherub: "res/Common/Cherub.png",
    chest: themeDir + "Chest.png",
    doors: themeDir + "Doors.png",
    floor: themeDir + "Floor.png",
    items: themeDir + "Items.png",
    jesus: "res/Common/Jesus.png",
    jesusCloth: "res/Common/JesusCloth.png",
    kiwi: "res/Common/Kiwi.png",
    lightSpot: "res/Common/LightSpot.png",
    map: themeDir + "Map.png",
    merchant: themeDir + "Merchant.png",
    middleWalls: themeDir + "MiddleWalls.png",
    pig: themeDir + "Pig.png",
    pillar: themeDir + "Pillar.png",
    shadow12x6: "res/Common/Shadow12x6.png",
    shadow24x12: "res/Common/Shadow24x12.png",
    shadow32x16: "res/Common/Shadow32x16.png",
    sparkle: "res/Common/Sparkle.png",
    spikes: themeDir + "Spikes.png",
    textures: themeDir + "Textures.png",
    titleGFX: themeDir + "TitleGFX.png",
    touchControls: "res/UI/TouchControls.png",
    upperWalls: themeDir + "UpperWalls.png",
    weapons: "res/Common/Weapons.png",
	
    //gfx for debug
    hitBoxGrid: "res/DBG/hbGrid.png",
    hitBoxGridBlue: "res/DBG/hbGridBlue.png"
};

//music
waw.bgm = {
    level1: "res/Music/ingame01.mp3"
};

//SFX
waw.sfx = {
    candelabre01: "res/SFX/Candelabre01.ogg",
    coin01: "res/SFX/Coin01.ogg",
    door01: "res/SFX/Door01.ogg",
    merchDeath: "res/SFX/MerchDeath.ogg",
    merchHurt01: "res/SFX/MerchHurt01.ogg",
    merchHurt02: "res/SFX/MerchHurt02.ogg",
    ouch01: "res/SFX/Ouch01.ogg",
    ouch02: "res/SFX/Ouch02.ogg",
    ouch03: "res/SFX/Ouch03.ogg",
    pigDeath: "res/SFX/PigDeath.ogg",
    pigHurt01: "res/SFX/PigHurt01.ogg",
    pigHurt02: "res/SFX/PigHurt02.ogg",
    punch01: "res/SFX/Punch01.ogg",
    whip01: "res/SFX/Whip01.ogg",
    whip02: "res/SFX/Whip02.ogg"
};

var g_resources = [
    //bgm
    {src:waw.bgm.level1},

    //image
    {src:waw.gfx.barrel},
    {src:waw.gfx.bat},
    {src:waw.gfx.cherub},
    {src:waw.gfx.chest},
    {src:waw.gfx.doors},
    {src:waw.gfx.floor},
    {src:waw.gfx.items},
    {src:waw.gfx.jesus},
    {src:waw.gfx.jesusCloth},
    {src:waw.gfx.kiwi},
    {src:waw.gfx.lightSpot},
    {src:waw.gfx.map},
    {src:waw.gfx.merchant},
    {src:waw.gfx.middleWalls},
    {src:waw.gfx.pig},
    {src:waw.gfx.pillar},
    {src:waw.gfx.shadow12x6},
    {src:waw.gfx.shadow24x12},
    {src:waw.gfx.shadow32x16},
    {src:waw.gfx.sparkle},
    {src:waw.gfx.spikes},
    {src:waw.gfx.textures},
    {src:waw.gfx.titleGFX},
    {src:waw.gfx.touchControls},
    {src:waw.gfx.upperWalls},
    {src:waw.gfx.weapons},

    //gfx for debug
    {src:waw.gfx.hitBoxGrid},
    {src:waw.gfx.hitBoxGridBlue},

    //plist

    //fnt

    //tmx

    //effect
    {src:waw.sfx.candelabre01},
    {src:waw.sfx.coin01},
    {src:waw.sfx.door01},
    {src:waw.sfx.merchDeath},
    {src:waw.sfx.merchHurt01},
    {src:waw.sfx.merchHurt02},
    {src:waw.sfx.ouch01},
    {src:waw.sfx.ouch02},
    {src:waw.sfx.ouch03},
    {src:waw.sfx.pigDeath},
    {src:waw.sfx.pigHurt01},
    {src:waw.sfx.pigHurt02},
    {src:waw.sfx.punch01},
    {src:waw.sfx.whip01},
    {src:waw.sfx.whip02}
];