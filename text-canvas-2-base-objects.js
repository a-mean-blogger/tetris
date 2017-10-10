console.log('text-canvas-2-base-objects.js loaded');

/******************************/
/* TC.Interval                */
/******************************/
TC.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
TC.Interval.prototype.stop = function () {
  if(this.id) window.clearInterval(this.id);
  this.id = null;
};
TC.Interval.prototype.start = function () {
  this.stop();
  this.id = window.setInterval(_=>this.func(), this.speed);
};
TC.Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
TC.Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};

/******************************/
/* TC.Object                  */
/******************************/
// Description: create an Object that does not loop
//             init is an function that can be inherited for additional initial behavior,
//             destroy is an function that can be inherited for additional destroy behavior.
TC.Object = function(data, createWithOutInit){
  this.data = TC.common.mergeObjects(this.data, data);
  if(!createWithOutInit) this.init();
};

// TC.Object functions
TC.Object.prototype.init = function (){
  this.isActive = true;
};
TC.Object.prototype.destroy = function(){
  this.isActive = false;
};

/******************************/
/* TC.LoopObject              */
/******************************/
// Description: create an Object that does loop.
//             speed is the interval(millisecond), caculate and draw are functions that loop.
//             calculate is an interface function that need to be implemented and calculate values in data,
//             draw is is an interface function that need to be implemented and display the values on screen,
TC.LoopObject = function(data, speed, autoStart){
  this.isActive = true; // need this to tell this object is not destroyed even though it's not autoStarted
  this.createWithOutInit = !autoStart;
  this.speed = speed;
  this.interval = new TC.Interval();
  TC.Object.call(this, data, this.createWithOutInit);
};
TC.LoopObject.prototype = Object.create(TC.Object.prototype);
TC.LoopObject.prototype.constructor = TC.LoopObject;

// TC.Object functions inheritance
TC.LoopObject.prototype.init = function (){
  this.draw();
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
  TC.Object.prototype.init.call(this);
};
TC.LoopObject.prototype.destroy = function(){
  this.interval.stop();
  TC.Object.prototype.destroy.call(this);
};

// TC.LoopObject interface functions
TC.LoopObject.prototype.calculate = function(){};
TC.LoopObject.prototype.draw = function(){};

/******************************/
/* TC.Program              */
/******************************/
// Description: an object to control multiple TC.Objects and/or TC.LoopObjects
TC.Program = function(data, speed){
  this.autoStart = false;
  this.speed = speed;
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  TC.LoopObject.call(this, data, this.speed, this.autoStart);
};
TC.Program.prototype = Object.create(TC.LoopObject.prototype);
TC.Program.prototype.constructor = TC.Program;

// TC.LoopObject functions inheritance
TC.Program.prototype.init = function(){
  this.count = 0;
  TC.LoopObject.prototype.init.call(this);
};
TC.Program.prototype.destroy = function(){
  TC.LoopObject.prototype.destroy.call(this);
  for(let i = this.objects.length-1; i >= 0; i--){
    this.objects[i].destroy();
  }
  for(let key in this.uniqueObjects){
    if(this.uniqueObjects[key])this.uniqueObjects[key].destroy();
  }
};

// TC.LoopObject functions implementation
TC.Program.prototype.calculate = function(){
  this.count++;
  this.timeline();
  this.getInput();
};

// TC.Program interface functions
TC.Program.prototype.draw = function(){};
TC.Program.prototype.timeline = function(){};
TC.Program.prototype.getInput = function(){};

// TC.Program functions
TC.Program.prototype.addToObjects = function(object){
  this.objects = this.objects.filter(object => object.isActive); // removed destroyed objects
  this.objects.push(object);
};
