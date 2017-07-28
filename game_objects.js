console.log("game_object.js loaded");

// function TextObject(container,properties,patternFunc){
//   this.text=properties.text;
//   this.length=properties.text.length;
//   this.speed=tbCanvas.common.isNumber(properties.speed)?properties.speed:null;
//   this.speedCount=0;
//   this.xN=this.x=tbCanvas.common.isNumber(properties.x)?properties.x:0;
//   this.yN=this.y=tbCanvas.common.isNumber(properties.y)?properties.y:0;
//   this.xD=tbCanvas.common.isNumber(properties.xD)?properties.xD:0;
//   this.yD=tbCanvas.common.isNumber(properties.yD)?properties.yD:0;
//   this.patternFunc=patternFunc;
//   BaseObject.call(this, container);
// }
// TextObject.prototype = Object.create(BaseObject.prototype);
// TextObject.prototype.constructor = TextObject;
// TextObject.prototype.draw = function(){
//   game.tbScreen.deleteText(this.x,this.y,this.text);
//   this.x = this.xN;
//   this.y = this.yN;
//   game.tbScreen.insertText(this.x,this.y,this.text);
// };
// TextObject.prototype.calculate = function(){
//   if(this.speed){
//     if(this.speedCount >= this.speed){
//       this.patternFunc();
//       this.speedCount = 0;
//     } else {
//       this.speedCount++;
//     }
//   }
// };
// TextObject.prototype.setSpeed = function(speed){
//   this.speed=speed;
// };

const BLOCKS = [
  [[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],
  [[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]],
  [[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]],[[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]]],
  [[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]]
];

function Star(speed,properties){
  this.x = properties.x;
  this.y = properties.y;
  this.blank = 0;
  tbCanvas.LoopObject.call(this, speed);
}
Star.prototype = Object.create(tbCanvas.LoopObject.prototype);
Star.prototype.constructor = Star;

Star.prototype.init = function () {
  this.initInterval();
};
Star.prototype.calculate = function () {
  this.blank = (this.blank+1)%2;
};
Star.prototype.draw = function () {
  if(this.blank%2===0) game.tbScreen.insertText(this.x,this.y,"★");
  else game.tbScreen.insertText(this.x,this.y,"☆");
};
Star.prototype.erase = function () {
  game.tbScreen.insertText(this.x,this.y,"  ");
};

function Status(properties){
  this.x = properties.x;
  this.y = properties.y;
  tbCanvas.LoopObject.call(this);
}
Status.prototype = Object.create(tbCanvas.LoopObject.prototype);
Status.prototype.constructor = Status;

Status.prototype.init = function(){
  this.drawFrame();
};
Status.prototype.drawFrame = function(){
  game.tbScreen.insertText(this.x, this.y+0, " LEVEL :");
  game.tbScreen.insertText(this.x, this.y+1, " GOAL  :");
  game.tbScreen.insertText(this.x, this.y+2, "+-  N E X T   -+ ");
  game.tbScreen.insertText(this.x, this.y+3, "|              | ");
  game.tbScreen.insertText(this.x, this.y+4, "|              | ");
  game.tbScreen.insertText(this.x, this.y+5, "|              | ");
  game.tbScreen.insertText(this.x, this.y+6, "|              | ");
  game.tbScreen.insertText(this.x, this.y+7, "+-- -  --  - --+ ");
  game.tbScreen.insertText(this.x, this.y+8, " YOUR SCORE :");
  game.tbScreen.insertText(this.x, this.y+10," LAST SCORE :");
  game.tbScreen.insertText(this.x, this.y+12," BEST SCORE :");
  game.tbScreen.insertText(this.x, this.y+15,"  △   : Shift        SPACE : Hard Drop");
  game.tbScreen.insertText(this.x, this.y+16,"◁  ▷ : Left / Right   P   : Pause");
  game.tbScreen.insertText(this.x, this.y+17,"  ▽   : Soft Drop     ESC  : Quit");
  game.tbScreen.insertText(this.x, this.y+20,"www.A-MEAN-Blog.com");
};
Status.prototype.drawNextBlock = function(blockType){
  let xOffset = (blockType === 0 || blockType === 1)?-1:0;
  let color = Tetris.prototype.getBlockColor(blockType);
  let xAdj = this.x+5;
  let yAdj = this.y+3;
  for(let i=1;i<3;i++){
    for(let j=0;j<5;j++){
      let x = xAdj-2+j*2;
      let y = yAdj+i;
      game.tbScreen.insertText(x,y,"  ");
    }
  }
  for(let i=1;i<3;i++){
    for(let j=0;j<4;j++){
      let x = xAdj+j*2+xOffset;
      let y = yAdj+i;
      if(BLOCKS[blockType][0][i][j]==1) {
        game.tbScreen.insertText(x,y,"■", color);
      }
    }
  }
};
Status.prototype.convertScore = function(score){
  let string = score.toString();
  let formatted = string.replace(/(\d)(?=(\d{3})+$)/g,'$1,');
  let offset = 10 - formatted.length;
  let padding = "";
  for(let i=offset;i>0;i--) padding+=" ";
  return padding+ formatted;
};
Status.prototype.drawScore = function(score){
  game.tbScreen.insertText(this.x+7, this.y+9, this.convertScore(score));
};
Status.prototype.drawLastScore = function(score){
  game.tbScreen.insertText(this.x+7, this.y+11, this.convertScore(score));
};
Status.prototype.drawBestScore = function(score){
  game.tbScreen.insertText(this.x+7, this.y+13, this.convertScore(score));
};

function Tetris(properties, status){
  this.ACTIVE_BLOCK = -2;
  this.CEILLING = -1;
  this.EMPTY = 0;
  this.WALL = 1;
  this.parentObjects = {};
  this.parentObjects.status = status;
  this.x = properties.x;
  this.y = properties.y;
  this.dropSpeed = 80;
  this.dropSpeedCount = 0;
  this.inputSpeed = 10;
  this.inputSpeedCount = 0;
  this.keyset = properties.keyset;
  this.colNum = 11;
  this.rowNum = 23;
  this.data = {
    dataArray:undefined,
    activeBlock:{
      type:undefined,
      rotation:undefined,
      x:undefined,
      y:undefined,
      inActivate:{
        flag:false,
        countMax:50,
        count:0
      },
    },
    nextBlockType:undefined,
  };
  tbCanvas.LoopObject.call(this, 10);
}
Tetris.prototype = Object.create(tbCanvas.LoopObject.prototype);
Tetris.prototype.constructor = Tetris;

Tetris.prototype.init = function () {
  this.resetDataArray();
  this.createNewBlock();
  this.test = new tbCanvas.DevTask('test',
    this.data,
    function(){
      let activeBlock = this.data.activeBlock;
      this.output =
      `activeBlock.type: ${activeBlock.type}
      activeBlock.rotation: ${activeBlock.rotation}
      activeBlock.x: ${activeBlock.x}
      activeBlock.y: ${activeBlock.y}
      nextBlockType: ${this.data.nextBlockType}`;
    });
  this.initInterval();
};
Tetris.prototype.draw = function () {
  let activeBlock = this.data.activeBlock;

  for(let i=0;i<this.rowNum;i++){
    for(let j=0;j<this.colNum;j++){
      let blockChar;
      let color;
      switch(this.data.dataArray[i][j]){
        case this.ACTIVE_BLOCK: //-2
          blockChar="□";
          color = this.getBlockColor(activeBlock.type);
          break;
        case this.CEILLING: // -1
          blockChar=". ";
          break;
        case this.EMPTY: //0
          blockChar="  ";
          break;
        case this.WALL: // 1
          blockChar="▣";
          break;
        default: // 2~
          blockChar="■";
          color = this.getBlockColor(this.data.dataArray[i][j]-2);
          break;
      }
      game.tbScreen.insertText(this.x+j*2,this.y+i,blockChar,color);
    }
  }
};
Tetris.prototype.calculate = function () {
  this.updateCeilling();
  this.autoDrop();
  this.updateActiveBlock();
  if(this.data.activeBlock.inActivate.flag) this.inActivateBlock();
  this.getInput();
};
Tetris.prototype.beforeDestroy = function (blockType) {
  this.test.destroy();
};
Tetris.prototype.getBlockColor = function (blockType) {
  let color;
  if(blockType === 0) color = "red";
  else if(blockType === 1) color = "orange";
  else if(blockType === 2) color = "blue";
  else if(blockType === 3) color = "tomato";
  else if(blockType === 4) color = "yellow";
  else if(blockType === 5) color = "gray";
  else if(blockType === 6) color = "green";
  return color;
};
Tetris.prototype.resetDataArray = function () {
  this.data.dataArray=[];
  for(let i=0;i<this.rowNum;i++){
    this.data.dataArray[i]=[];
    for(let j=0;j<this.colNum;j++){
      this.data.dataArray[i][j]=0;
    }
  }
  for(let i=1;i<this.rowNum-1;i++){
    this.data.dataArray[i][0]=this.WALL;
    this.data.dataArray[i][this.colNum-1]=this.WALL;
  }
  for(let j=0;j<this.colNum;j++){
    this.data.dataArray[this.rowNum-1][j]=this.WALL;
  }
};
Tetris.prototype.updateCeilling = function(){
  for(let j=1;j<this.colNum-1;j++){
    if(this.data.dataArray[3][j]<=0) this.data.dataArray[3][j]=this.CEILLING;
  }
};
Tetris.prototype.createNewBlock = function(){
  let newBlock = this.data.activeBlock;
  newBlock.rotation = 0;
  newBlock.type = tbCanvas.common.isNumber(this.data.nextBlockType)?this.data.nextBlockType:Math.floor(Math.random()*7);
  newBlock.x = Math.floor(this.colNum/2)-1;
  newBlock.y = 0;
  newBlock.inActivate.flag = false;
  newBlock.inActivate.count = this.data.activeBlock.inActivate.countMax;
  this.data.nextBlockType = Math.floor(Math.random()*7);
  this.updateActiveBlock();
  this.parentObjects.status.drawNextBlock(this.data.nextBlockType);
};
Tetris.prototype.updateActiveBlock = function(){
  let activeBlock= this.data.activeBlock;

  this.changeActiveBlockTo(this.EMPTY);

  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(BLOCKS[activeBlock.type][activeBlock.rotation][i][j]==1)
        this.data.dataArray[activeBlock.y+i][activeBlock.x+j]=this.ACTIVE_BLOCK;
    }
  }
};
Tetris.prototype.changeActiveBlockTo = function(to){
  for(let i=0;i<this.rowNum;i++){
    for(let j=0;j<this.colNum;j++){
      if(this.data.dataArray[i][j]==this.ACTIVE_BLOCK)
        this.data.dataArray[i][j]=to;
    }
  }
};
Tetris.prototype.getInput = function () {
  if(this.inputSpeedCount === 0){
    this.inputSpeedCount = this.inputSpeed;
    if(tbCanvas.inputs.keyboard.check(this.keyset.RIGHT)){
      this.moveActiveBlock(1,0);
    }
    if(tbCanvas.inputs.keyboard.check(this.keyset.LEFT)){
      this.moveActiveBlock(-1,0);
    }
    if(tbCanvas.inputs.keyboard.check(this.keyset.DOWN)){
      this.moveDownActiveBlock();
    }
    if(tbCanvas.inputs.keyboard.check(this.keyset.ROTATE)){
      this.rotateActiveBlock();
    }
    if(tbCanvas.inputs.keyboard.check(this.keyset.DROP)){
      this.hardDrop();
    }
  } else {
    this.inputSpeedCount--;
  }
};
Tetris.prototype.hardDrop = function(){
  let activeBlock = this.data.activeBlock;

  if(this.moveActiveBlock(0,1)){
    this.hardDrop();
  }
  else{
    this.inActivateBlock();
    return;
  }
};
Tetris.prototype.moveActiveBlock = function(x,y){
  let activeBlock = this.data.activeBlock;
  let xN = activeBlock.x+x;
  let yN = activeBlock.y+y;
  let moved = false;
  if(this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,xN,yN)){
    activeBlock.x = xN;
    activeBlock.y = yN;
    moved = true;
  }
  return moved;
};
Tetris.prototype.moveDownActiveBlock = function(){
  let activeBlock = this.data.activeBlock;
  let moved = this.moveActiveBlock(0,1);

  if(moved && this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1)){
    activeBlock.inActivate.count = activeBlock.inActivate.countMax;
    activeBlock.inActivate.flag = false;
  }
  else {
    activeBlock.inActivate.flag = true;
  }
};
Tetris.prototype.rotateActiveBlock = function(){
  let activeBlock = this.data.activeBlock;
  let rN = (activeBlock.rotation+1)%4;
  let moved = false;
  if(this.checkActiveBlockMove(activeBlock.type,rN,activeBlock.x,activeBlock.y)){
    activeBlock.rotation = rN;
    moved = true;
  } else if(this.checkActiveBlockMove(activeBlock.type,rN,activeBlock.x,activeBlock.y-1)){
    activeBlock.rotation = rN;
    activeBlock.y -= 1;
    moved = true;
  }
  return moved;
};
Tetris.prototype.checkActiveBlockMove = function(type,rN,xN,yN){
  let activeBlock = this.data.activeBlock;
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(BLOCKS[type][rN][i][j]==1
      && this.data.dataArray[yN+i][xN+j] > 0){
        return false;
      }
    }
  }
  return true;
};
Tetris.prototype.autoDrop = function(){
  let activeBlock= this.data.activeBlock;
  if(this.dropSpeedCount >= this.dropSpeed){
    this.dropSpeedCount = 0;
    this.moveDownActiveBlock();
  } else {
    this.dropSpeedCount++;
  }
};
Tetris.prototype.inActivateBlock = function(){
  let activeBlock = this.data.activeBlock;
  if(!this.checkActiveBlockMove(activeBlock.type,activeBlock.rotation,activeBlock.x,activeBlock.y+1) && --activeBlock.inActivate.count < 0){
    activeBlock.inActivate.count = activeBlock.inActivate.countMax;
    this.updateActiveBlock();
    this.changeActiveBlockTo(this.data.activeBlock.type+2);
    this.checkLines();
    this.createNewBlock();
  }
};
Tetris.prototype.checkLines = function(){
  let removedLineNum = 0;
  for(let i=this.rowNum-2;i>=0;i--){
    let occupiedCount = 0;
    for(let j=1;j<this.colNum-1;j++){
      if(removedLineNum){
        if(i<removedLineNum) this.data.dataArray[i][j] = 0;
        else if(i === 0 || this.data.dataArray[i-removedLineNum][j] == this.CEILLING) this.data.dataArray[i][j] = this.EMPTY;
        else this.data.dataArray[i][j] = this.data.dataArray[i-removedLineNum][j];
      }
      if(this.data.dataArray[i][j]>0) occupiedCount++;
    }
    if(occupiedCount == this.colNum-2){
      i++;
      removedLineNum++;
    }
  }
};
Tetris.prototype.removeLine = function(lineNum){
  for(let i=lineNum;i>=0;i--){
    for(let j=1;j<this.colNum-1;j++){
      if(i === 0 || this.data.dataArray[i-1][j] == this.CEILLING) this.data.dataArray[i][j] = this.EMPTY;
      else this.data.dataArray[i][j] = this.data.dataArray[i-1][j];
    }
  }
};