"use strict";
//some random function with randomSeed
//USAGE: 1) create a randomseed object (once) ->  e.g  seedObj = waw.seed(13456);
//          it will return the same pseudo random set of numbers. You can have many random seed objects for some game stuff
//      If you re-create the random seed object with the same initial value, then waw.rand(seedObj) will return the same set of values
//  2) calling waw.rand() w/o seed arg is equal to Math.rand()
//      so use it with seedObj -> e.g.    waw.rand(seedObj) -> 0 .. 1

// Global variables used for the seeded random functions, below.
var waw_seeda = 1103515245;
var waw_seedc = 12345;
var waw_seedm = 4294967295; //0x100000000

// Takes any integer
waw.seed = function(seednum){
    return waw_gseed = [seednum];
};

//some global random seed. to use waw.rand w/o agrs
var waw_gseed = waw.seed(Math.random());

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
waw.rand = function(seedobj){
    if(!seedobj)    //to be able to use it w/o SEED arg
        seedobj = waw_gseed;

    seedobj[0] = (seedobj[0] * waw_seeda + waw_seedc) % waw_seedm;
    return seedobj[0] / (waw_seedm - 1);
};

//Debug output
console.log(waw.rand()+" - "+waw.rand()+" - "+waw.rand()+" - "+waw.rand());
waw.seed(345432);
console.log(waw.rand()+" - "+waw.rand()+" - "+waw.rand()+" - "+waw.rand());
waw.seed(301);
console.log(waw.rand()+" - "+waw.rand()+" - "+waw.rand()+" - "+waw.rand());
