#!/usr/bin/env node
  
  //Requires
  var keypress = require('keypress')
    , x1 = require('axel')
    ;





  var bullets = []
  , maxBullets = 8
  , bulletSpeed = .125
  ;




  with(x1){
    // brush = 'o';
    // 
  // line(0,0,width,height);
  // scrub(3,3,7,7);
  
    
    
    var width = cols
      , height = rows
      , p1x = cols/2
      , p1y = rows
      , gameLoop
      , fps = 60
      ;
  }


  

  function shoot(){with(x1){
    var newBullet = {
      x: p1x,
      y: p1y-3, 
      s: bulletSpeed
    };

    bullets.push(newBullet);

    if(bullets.length>maxBullets) bullets.shift();
  }}

  function updateBullets(){
    bullets.forEach(function(it){with(x1){
      
      //console.log(this.x, this.y);
      point(it.x, it.y);
      it.y-=bulletSpeed;
    }});
  }


  function drawPlayer(x, y){with(x1){
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
    drawPlayer(p1x,p1y);
    updateBullets();
    checkKeyDown();
  }}

  
  function endGame(){with(x1){
    process.stdin.pause();
    clearInterval(gameLoop);
    cursor.on;
    cursor.reset;
  }}


  function start(){with(x1){
    cursor.off;
    gameLoop = setInterval(eachLoop, 1000/fps);
    process.stdin.setRawMode(true);
    keypress(process.stdin);
    process.stdin.resume();
  }}


  start();



  function left(){
    p1x-=p1x>4?1:0;
  }
  function right(){
    p1x+=p1x<width-4?1:0;
  }






  //// KEYBOARD EVENTS ///////////////////////////////////////////////////////


  var keyDown = null;
  var lastChecked = now();
  var releaseTime = 25;

  function now(){
    return (+new Date());
  };


  function checkKeyDown(){
    if (now()-lastChecked>30){
      keyDown =null;
    }

    switch(keyDown){
    case 'left':
      left();
      break;
    case 'right':
      right();
      break;
    case 'space':
      shoot();
      break;
    default:
      lastChecked = now();
      break;
    }

  }

process.stdin.on('keypress', function (ch, key) {
  
  // console.log(key, ch);

  // keyDown = null;

  if (key) {
    if (key.name == 'escape') endGame();
    if (key.name == 'q') endGame();
    if (key.name == 'left') keyDown = 'left';
    if (key.name == 'right')  keyDown = 'right';
    if (key.name == 'space') keyDown = 'space'
  }

  if (key && key.ctrl && key.name == 'c') { 
    endGame();
  }
  // console.log('got "keypress"', key); 
});



