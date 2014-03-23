"use strict";
// add clear update
// create an obj that keeps some functions que and try to run them while
// previous function returns true. then u delete it from the que and run the next one

waw.Shedule = function(tasks, interrupts) {
    this.tasks = [];
    this.interrupts = [];
    this.currentTask = 0;
    this.done = false;
    if (arguments.length < 1)
        return;
    for (var i in tasks)
        this.tasks.push(tasks[i]);
    for (var j in interrupts)
        this.interrupts.push(interrupts[j]);
};
waw.Shedule.prototype.trace = function () {
    console.info("trace currTask:" + this.currentTask + " Done:" + this.done);
    for (var i in this.tasks)
        console.log(this.tasks[i]);
    for (var j in this.interrupts)
        console.log(this.interrupts[j]);
};
waw.Shedule.prototype.reset = function () {
    this.currentTask = 0;
    this.done = false;
    console.info(" reset tasks que");
};
waw.Shedule.prototype.stop = function () {
    this.currentTask = 0;
    this.done = true;
    console.info(" stop tasks que");
};
waw.Shedule.prototype.addTask = function (f) {
    if (!f) throw "argument should be a function";
    this.tasks.push(f);
    console.info(" added " + f + " to tasks");
};
waw.Shedule.prototype.addInterrupt = function (t) {
    if (!t) throw "argument should be a string with interrupt condition name";
    this.interrupts.push(t);
    console.info(" added " + t + " to interrupts");
};
waw.Shedule.prototype.isDone = function (conditions) {
    console.info(" isDone?");
    if (this.done) {
        this.reset();
        console.info(" all tasks are done");
        return true;
    }
    for (var i in conditions)
        if (this.interrupts.indexOf(conditions[i]) >= 0) {
            this.reset();
            console.info(" all tasks are done by right interrupt");
            return true;
        }
    console.info(" nope");
    return false;
};
waw.Shedule.prototype.update = function () {
    console.info(" tasks len " + this.tasks.length + ", interrupts len " + this.interrupts.length);
    if (this.done) {
        console.info(" no update: all tasks are done");
        return false;
    }
    if (this.tasks.length <= 0) {
        console.info(" no tasks");
        return false;
    }
    if (this.tasks[this.currentTask]()) {   //if func returns true, delete this from the que
        this.currentTask++;
        console.info(" que func run with true");
        if (this.currentTask > this.tasks.length - 1)
            this.stop();
        return true;
    }
    console.info(" que func run with false");
    return false;
};

/*
console.info("start");

var my_tasks = [function () {
    console.log("1f");
    return true;
},
    function () {
        console.log("2f");
        return true;
    }, function () {
        console.log("2FFf");
        return false;
    },
    function () {
        console.log("3f");
        return true;
    }];
var my_interrupts = ["nope", "idle", "run", "died", "seeEnemy"];

var q = new Shedule(my_tasks, my_interrupts);
console.info(q);
q.trace();

q.update();
q.isDone([]);
q.update();
q.isDone();
q.update();
q.isDone();
q.update();
q.isDone(["sss","seeEnemy"]);
q.update();
q.isDone(["run"]);
q.update();
q.isDone();
*/
