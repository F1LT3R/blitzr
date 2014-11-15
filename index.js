#!/usr/bin/env node
  
  //Requires
  var keypress = require('keypress')
    , x1 = require('axel')
    ;


  with(x1){
    // brush = 'o';
    // 
  // line(0,0,width,height);
  // scrub(3,3,7,7);
  
    
    
    var width = cols
      , height = rows
      , x = cols/2
      , y = rows
      , gameLoop
      , fps = 60
      ;
  }




  function ship(x, y){with(x1){
    line(x-2, y, x+2, y);  
    line(x, y, x, y-3);  
    line(x-2, y, x-2, y-2);  
    line(x+2, y, x+2, y-2);  
  }}


  function eachLoop(){with(x1){
    width = cols;
    height = rows;
    y=rows;
    cursor.reset;
    clear;
    fg(0,0,0);
    bg(0,255,0);
    ship(x,y);
  }}

  
  function endGame(){with(x1){
    process.stdin.pause();
    clearInterval(gameLoop);
    cursor.on;
    cursor.reset;
  }}


  function start(){with(x1){
    cursor.off;
    gameLoop = setInterval(eachLoop, 1000/60);
    process.stdin.setRawMode(true);
    keypress(process.stdin);
    process.stdin.resume();
  }}


  start();



  function left(){
    x-=x>4?1:0;
  }
  function right(){
    x+=x<width-4?1:0;
  }



process.stdin.on('keypress', function (ch, key) {
  
  // console.log('got "keypress"', key); 
  
  if (key) {
    if (key.name == 'escape') endGame();
    if (key.name == 'q') endGame();
    if (key.name == 'left') left();
    if (key.name == 'right') right();
  }

  if (key && key.ctrl && key.name == 'c') { 
    endGame();
  }
});



