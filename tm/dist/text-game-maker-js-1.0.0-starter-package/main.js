var screenSetting = {
  // canvasId: 'tm-canvas',
  // fontSize: 30,
  // frameSpeed: 10,
  // zoom: 0.5,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // defalutFontColor: '#F5F7FA',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontFamily: 'monospace',
  // fontSource: null,
  column: 70,
  row: 9,
};

var debugSetting = {
  // devMode: true,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting),
    TMI = new TM.InputManager(),
    TMD = new TM.DebugManager(debugSetting);

var x = 1;
    y = 1;
    blogUrl = 'http://a-mean-blog.com/en/blog/Text-Game-Maker-JS';

TMS.insertTextAt(x,y,'Hello World!', 'white', '#4e4e4e');
TMS.nextLine(x+4);
TMS.insertText("I'm Text Game Maker JS!");
TMS.cursor.move(x,y+3);
TMS.insertText('Find more information of me at: \n');
TMS.insertText(blogUrl);

TMD.print('debug1',{
  x: x,
  y: y,
  'Blog Url': blogUrl,
});
