console.log("tb-canvas-3.js loaded");


tbCanvas.Interval = function(){
  this.id = undefined;
  this.func = undefined;
  this.speed = undefined;
};
tbCanvas.Interval.prototype.stop = function () {
  window.clearInterval(this.id);
  this.id = null;
};
tbCanvas.Interval.prototype.start = function () {
  this.stop();
  this.func();
  this.id = window.setInterval(_=>this.func(), this.speed);
};
tbCanvas.Interval.prototype.setSpeed = function (speed) {
  this.speed = speed;
  this.start();
};
tbCanvas.Interval.prototype.init = function (speed,func) {
  this.speed = speed;
  this.func = func;
  this.start();
};


tbCanvas.LoopObject = function(speed){
  this.isActive = true;
  this.speed = speed;
  this.interval = new tbCanvas.Interval();
  this.init();
};
tbCanvas.LoopObject.prototype.init = function (){
  // if(this.speed) this.initInterval();
};
tbCanvas.LoopObject.prototype.initInterval = function(){
  this.isActive = true;
  this.interval.init(this.speed, _=> {
    if(this.isActive) this.calculate();
    if(this.isActive) this.draw();
  });
};
tbCanvas.LoopObject.prototype.calculate = function(){};
tbCanvas.LoopObject.prototype.draw = function(){};
tbCanvas.LoopObject.prototype.destroy = function(){
  this.beforeDestroy();
  this.interval.stop();
  this.isActive = false;
  this.erase();
};
tbCanvas.LoopObject.prototype.beforeDestroy = function(){};
tbCanvas.LoopObject.prototype.erase = function(){};


tbCanvas.Program = function(speed,data){
  this.data = data;
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  tbCanvas.LoopObject.call(this, speed);
};
tbCanvas.Program.prototype = Object.create(tbCanvas.LoopObject.prototype);
tbCanvas.Program.prototype.constructor = tbCanvas.Program;

tbCanvas.Program.prototype.timeline = function(){};
tbCanvas.Program.prototype.getInput = function(){};
tbCanvas.Program.prototype.calculate = function(){
  this.count++;
  this.timeline();
  this.getInput();
};
tbCanvas.Program.prototype.initProgram = function(){
  this.objects = [];
  this.uniqueObjects = {};
  this.count = 0;
  this.initInterval();
};
tbCanvas.Program.prototype.destroy = function(){
  tbCanvas.LoopObject.prototype.destroy.call(this);
  this.count = 0;
  for(let i = this.objects.length-1;i>=0;i--){
    this.objects[i].destroy();
  }
  for(let key in this.uniqueObjects){
    if(this.uniqueObjects[key])this.uniqueObjects[key].destroy();
  }
};
tbCanvas.Program.prototype.addToObjects = function(object){
  this.objects = game.programs.intro.objects.filter(object => object.isActive);
  this.objects.push(object);
};


tbCanvas.Screen_Char = function(screen, char, isFullwidth, color, backgroundColor){
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screen.defalutFontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screen.backgroundColor;
  this.font = screen.fontFamily;
  this.isNew = true;
};


tbCanvas.Screen = function(screenInput){
  this.screen = tbCanvas.setting.screen;
  if(screenInput){
    for(let p in this.screen){
      if(screenInput[p]!==undefined) this.screen[p] = screenInput[p];
    }
  }

  this.isFontLoaded = false;
  this.screenData = [];
  this.blockWidth = tbCanvas.common.getBlockWidth(this.screen.fontSize);
  this.blockHeight = tbCanvas.common.getBlockHeight(this.screen.fontSize);

  this.canvas = document.querySelector("#"+this.screen.canvasId);
  this.canvas.width = this.blockWidth * this.screen.column;
  this.canvas.height = this.blockHeight * this.screen.row;
  this.canvas.style.border = this.screen.backgroundColor+" 1px solid";
  this.canvas.style.borderRadius = "5px";
  this.canvas.style.backgroundColor = this.screen.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screen.zoom + "px";
  this.canvas.style.height = this.canvas.height * this.screen.zoom + "px";
  this.ctx = this.canvas.getContext("2d");

  tbCanvas.LoopObject.call(this, this.screen.frameSpeed);
};
tbCanvas.Screen.prototype = Object.create(tbCanvas.LoopObject.prototype);
tbCanvas.Screen.prototype.constructor = tbCanvas.Screen;

tbCanvas.Screen.prototype.init = function () {
  this.initScreenData();
  if(!document.querySelector(`link[href='${this.screen.fontSource}'][rel='stylesheet']`)){
    var link = document.createElement('link');
    link.href = this.screen.fontSource;
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  this.initInterval();
};
tbCanvas.Screen.prototype.calculate = function() {
  if(!this.isFontLoaded) this.checkFontLoaded();
};
tbCanvas.Screen.prototype.draw = function() {
  let ctx = this.ctx;
  ctx.textBaseline = "buttom";
  for(let i = 0; i <this.screen.row; i++){
    for(let j = 0; j<this.screen.column; j++){
      if(this.screenData[i][j].char[0] != "$"
        && this.screenData[i][j].isNew === true
      ){
        //draw backgroundColor
        let bgX = this.blockWidth*j-this.blockWidth*0.05;
        let bgY = this.blockHeight*i;
        let width = (this.screenData[i][j].isFullwidth?this.blockWidth*2:this.blockWidth)+this.blockWidth*0.05;
        let height = this.blockHeight;
        ctx.fillStyle = this.screenData[i][j].backgroundColor;
        ctx.fillRect(bgX,bgY,width,height);

        //draw char
        let chX = this.blockWidth*j;
        let chY = this.blockHeight*i+this.blockHeight*0.8; // y adjustment
        let charset = tbCanvas.common.getCharGroup(this.screenData[i][j].char);
        if(charset){
          ctx.font = this.screen.fontSize*charset.sizeAdj+"px "+this.screenData[i][j].font;
          chX = chX+this.blockWidth*charset.xAdj;
          chY = chY+this.blockHeight*charset.yAdj;
        }
        else {
          ctx.font = this.screen.fontSize+"px "+this.screenData[i][j].font;
        }
        ctx.fillStyle = this.screenData[i][j].color;
        ctx.fillText(this.screenData[i][j].char,chX,chY);

        //do not draw once it already drew for the better performance
        this.screenData[i][j].isNew = false;
      }
    }
  }
};
tbCanvas.Screen.prototype.checkFontLoaded= function(){
  if(document.fonts.check("1em "+this.screen.fontFamily)){
    this.isFontLoaded = true;
    this.refreshScreen();
  }
};
tbCanvas.Screen.prototype.isInCanvas = function(x,y){
  if(x>=0 && y>=0 && y<this.screenData.length && x<this.screenData[y].length) return true;
  else return false;
};
tbCanvas.Screen.prototype.initScreenData = function(){
  this.screenData = [];
  for(let i = 0; i <this.screen.row; i++){
    this.screenData[i]=[];
    for(let j = 0; j<this.screen.column; j++){
      this.screenData[i][j]=new tbCanvas.Screen_Char(this.screen, " ");
    }
  }
};
tbCanvas.Screen.prototype.refreshScreen = function(){
  for(let i = 0; i <this.screenData.length; i++){
    for(let j = 0; j<this.screenData[i].length; j++){
      this.screenData[i][j].isNew = true;
    }
  }
};
tbCanvas.Screen.prototype.fillScreen = function(char){
  if(typeof char != "string") char = " ";
  this.screenData = [];
  for(let i = 0; i <this.screen.row; i++){
    this.screenData[i]=[];
    for(let j = 0; j<this.screen.column; j++){
      this.screenData[i][j]=new tbCanvas.Screen_Char(this.screen, char);
    }
  }
};
tbCanvas.Screen.prototype.clearScreen = function(){
  this.fillScreen(" ");
};
tbCanvas.Screen.prototype.insertChar = function(x,y,char,color,backgroundColor){
  if(char.constructor != String) return console.error(char+" is invalid");

  if(this.isInCanvas(x,y)
  && (this.screenData[y][x].char != char
    || this.screenData[y][x].color != (color?color:this.screen.defalutFontColor)
    || this.screenData[y][x].backgroundColor != (backgroundColor?backgroundColor:this.screen.backgroundColor)
    )
  ){
    let regex = tbCanvas.common.getFullwidthRegex();
    let fullwidth = regex.test(char);

    this.screenData[y][x] = new tbCanvas.Screen_Char(this.screen, char,fullwidth,color,backgroundColor);

    // to clean background outliner
    if(this.isInCanvas(x-1,y)) this.screenData[y][x-1].draw = true;
    if(this.isInCanvas(x+(fullwidth?2:1),y)) this.screenData[y][x+(fullwidth?2:1)].draw = true;
  }
};
tbCanvas.Screen.prototype.deleteChar = function(x,y){
  this.insertChar(x,y," ");
};
tbCanvas.Screen.prototype.insertText = function(x,y,text,color,backgroundColor){
  let regex = tbCanvas.common.getFullwidthRegex();
  text = text.toString().replace(regex,"$1 ");
  if(y<0 || y>=this.screenData.length) return;
  for(let i = 0; i<text.length; i++){
    if(x+i>=0 && x+i <this.screen.column){
      this.insertChar(x+i,y,text[i],color,backgroundColor);

      let regex = tbCanvas.common.getFullwidthRegex();
      let fullwidth = regex.test(text[i]);
      if(fullwidth){
        i++;
        this.insertChar(x+i,y,"$fullwidthFiller");
      }
    }
  }
};
tbCanvas.Screen.prototype.deleteText = function(x,y,text){
  let regex = tbCanvas.common.getFullwidthRegex();
  text = text.toString().replace(regex,"$1 ");
  this.insertText(x,y,text.replace(/./g," "));
};



tbCanvas.DevTask = function(domId, data, calculate){
  this.outputDom = document.querySelector("#"+tbCanvas.setting.devMode.outputDomId);
  this.output = '';
  this.domId = domId;
  this.data = data;
  this.calculate = calculate;
  tbCanvas.LoopObject.call(this, 10);
};
tbCanvas.DevTask.prototype = Object.create(tbCanvas.LoopObject.prototype);
tbCanvas.DevTask.prototype.constructor = tbCanvas.DevTask;

tbCanvas.DevTask.prototype.init = function(){
  this.initInterval();
};
tbCanvas.DevTask.prototype.calculate = function(){
  // get this from constructor
};
tbCanvas.DevTask.prototype.draw = function(){
  let dom = document.querySelector("#"+this.domId);
  if(!dom){
    dom = document.createElement("div");
    dom.id = this.domId;
    this.outputDom.appendChild(dom);
  }
  dom.innerText = this.output;
};
tbCanvas.DevTask.prototype.stop = function(){
  let dom = document.querySelector("#"+this.domId);
  dom.remove();
  this.isActive = false;
};
tbCanvas.DevTask.prototype.restart = function(){
  this.isActive = true;
};
tbCanvas.DevTask.prototype.beforeDestroy = function(){
  if(Array.isArray(this.container)){
    let i = this.container.indexOf(this);
    if (i >= 0) this.container.splice(i,1);
  }
  let dom = document.querySelector("#"+this.domId);
  if(dom) dom.remove();
};


tbCanvas.inputs = {
  isAllowed: true,
  keyboard:{
    isAllowed: true,
    keystate:{},
    eventHandlers:{
      keydown: function(e){
        e.preventDefault();
        if(tbCanvas.inputs.isAllowed && tbCanvas.inputs.keyboard.isAllowed){
          tbCanvas.inputs.keyboard.keystate[e.keyCode] = true;
          // console.log("e.keyCode: ", e.keyCode);
        }
      },
      keyup: function(e){
        e.preventDefault();
        delete tbCanvas.inputs.keyboard.keystate[e.keyCode];
      },
    },
    init: function(){
      document.addEventListener("keydown", this.eventHandlers.keydown);
      document.addEventListener("keyup", this.eventHandlers.keyup);
    },
    checkKeyPress: function(keyCode){
      // console.log("keyCode: ", keyCode);
      // console.log("this.keystate: ", this.keystate);
      if(this.keystate[keyCode]) {
        // delete tbCanvas.inputs.keyboard.keystate[keyCode];
        return true;
      }
      else return false;
    },
    unpressKey: function(keyCode){
      delete tbCanvas.inputs.keyboard.keystate[keyCode];
    },
    checkKeyPressAny: function(){
      if(Object.keys(this.keystate).length) return true;
      else return false;
    },
  },
  init: function(){
    this.keyboard.init();
  }
};

tbCanvas.inputs.init();
