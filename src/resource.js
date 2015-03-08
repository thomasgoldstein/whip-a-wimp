"use strict";
var themeDir = "res/Themes/Temple/";

var s_TitleGFX = themeDir + "TitleGFX.png";
var s_Floor = themeDir + "Floor.png";
var s_MiddleWalls = themeDir + "MiddleWalls.png";
var s_UpperWalls = themeDir + "UpperWalls.png";
var s_Doors = themeDir + "Doors.png";
var s_Pillar = themeDir + "Pillar.png";
var s_Items = themeDir + "Items.png";
var s_Weapons = "res/Weapons.png";
var s_LightSpot = "res/LightSpot.png";
var s_Textures = themeDir + "Textures.png";
var s_Chest = themeDir + "Chest.png";
var s_Merchant = themeDir + "Merchant.png";
var s_Jesus = "res/Jesus.png";
var s_JesusCloth = "res/JesusCloth.png";
var s_Kiwi = "res/Kiwi.png";
var s_Shadow12x6 = "res/Shadow12x6.png";
var s_Shadow24x12 = "res/Shadow24x12.png";
var s_Shadow32x16 = "res/Shadow32x16.png";
var s_Pit = "res/Pit.png";
var s_Sparkle = "res/Sparkle.png";
var s_Pig = themeDir + "Pig.png";
var s_Spikes = themeDir + "Spikes.png";
var s_Barrel = themeDir + "Barrel.png";
var s_Bat = themeDir + "Bat.png";
var s_Map = themeDir + "Map.png";
var s_TouchControls = "res/TouchControls.png";
//music
var bgm_Level1 = "res/Music/ingame01.mp3";
//SFX
var sfx_Ouch01 = "res/SFX/Ouch01.ogg";
var sfx_Ouch02 = "res/SFX/Ouch02.ogg";
var sfx_Ouch03 = "res/SFX/Ouch03.ogg";
var sfx_Punch01 = "res/SFX/Punch01.ogg";
var sfx_PigHurt01 = "res/SFX/PigHurt01.ogg";
var sfx_PigHurt02 = "res/SFX/PigHurt02.ogg";
var sfx_PigDeath = "res/SFX/PigDeath.ogg";
var sfx_MerchHurt01 = "res/SFX/MerchHurt01.ogg";
var sfx_MerchHurt02 = "res/SFX/MerchHurt02.ogg";
var sfx_MerchDeath = "res/SFX/MerchDeath.ogg";
var sfx_Candelabre01 = "res/SFX/Candelabre01.ogg";
var sfx_Whip01 = "res/SFX/Whip01.ogg";
var sfx_Whip02 = "res/SFX/Whip02.ogg";
var sfx_Coin01 = "res/SFX/Coin01.ogg";
var sfx_Door01 = "res/SFX/Door01.ogg";
//gfx for debug
var s_HitBoxGrid = "res/DBG/hbGrid.png";
var s_HitBoxGridBlue = "res/DBG/hbGridBlue.png";

var g_resources = [
    //bgm
    {src:bgm_Level1},

    //image
    {src:s_HitBoxGrid},
    {src:s_TitleGFX},
    {src:s_Floor},
    {src:s_MiddleWalls},
    {src:s_UpperWalls},
    {src:s_Doors},
    {src:s_LightSpot},
    {src:s_Chest},
    {src:s_Jesus},
    {src:s_JesusCloth},
    {src:s_Kiwi},
    {src:s_Shadow12x6},
    {src:s_Shadow24x12},
    {src:s_Shadow32x16},
    {src:s_Pillar},
    {src:s_Items},
    {src:s_Weapons},
    {src:s_Merchant},
    {src:s_Pit},
    {src:s_Textures},
    {src:s_Sparkle},
    {src:s_Pig},
    {src:s_Spikes},
    {src:s_Barrel},
    {src:s_Bat},
    {src:s_Map},
    {src:s_TouchControls},

    //plist

    //fnt

    //tmx

    //effect
    {src:sfx_Ouch01},
    {src:sfx_Ouch02},
    {src:sfx_Ouch03},
    {src:sfx_Punch01},
    {src:sfx_PigHurt01},
    {src:sfx_PigHurt02},
    {src:sfx_PigDeath},
    {src:sfx_MerchHurt01},
    {src:sfx_MerchHurt02},
    {src:sfx_MerchDeath},
    {src:sfx_Candelabre01},
    {src:sfx_Whip01},
    {src:sfx_Whip02},
    {src:sfx_Coin01},
    {src:sfx_Door01}
];