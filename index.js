#!/usr/bin/env node

  'use strict';
  
  //Requires
  var keypress = require('keypress')
    , c = require('axel')
    , int = parseInt
    , sin = Math.sin
    // , cos = Math.cos
    // , floor = Math.floor
    // , ceil = Math.ceil
    // , pow = Math.pow
    , score = 0
    , bullets = []
    , maxBullets = 20
    , bulletSpeed = 0.125
    , width = c.cols
    , height = c.rows
    , p1x = c.cols/2
    , p1y = c.rows-2
    , lp1x = p1x
    , lp1y = p1y
    , gameLoop
    , interval = 20
    , tick =0
    , enemies = []
    , maxEnemies = 24
    , enemySpeed = 0.025
    ;
  
  genEnemies();
  function genEnemies(){
    for (var y=0; y< c.rows; y+=3){
      for (var x=0; x< c.cols*0.75; x+=4){
        enemies.push({
          x: 2+x,
          y: y
        });
        if (enemies.length>=maxEnemies) {
          return;
        }
      }
    }
  }

  

  function shoot(){
    var newBullet = {
      x: p1x,
      y: p1y-3, 
      speed: bulletSpeed
    };

    bullets.push(newBullet);

    if(bullets.length>maxBullets){
      bullets.shift();
    }
  }

  function updateBullets(){
    bullets.forEach(function(bullet){
    
      // Set last positions
      bullet.lx = bullet.x;
      bullet.ly = bullet.y;
      
      // Move and accelarate
      bullet.y-=bullet.speed;
      bullet.speed+=bullet.speed*0.025;
    


      if( int(bullet.x)!==int(bullet.lx) ||
          int(bullet.y)!==int(bullet.ly))
        {
          // Draw off
          c.cursor.reset();
          c.point(bullet.lx, bullet.ly);

          // Draw on
          c.bg(0,255,0);
          c.point(bullet.x, bullet.y);
      }

      function destroyBullet(){
        c.cursor.reset();
        c.point(bullet.x, bullet.y);
        bullets.shift();
        return;
      }

      enemies.forEach(function(enemy,i){
        var D = c.dist(enemy.x, enemy.y, bullet.x, bullet.y);
        if(D<5){
          genExplosion(enemy.x,enemy.y);
          destroyBullet();
          enemies.splice(i,1);
          updateScore(12.34*bullet.speed);
        }
      });

      if(bullet.y<1){
        destroyBullet();
      }
      
    })
  }


  var explosions = [];
  function genExplosion(x,y){
    explosions.push({
      x:x,
      y:y,
      size:0,
      lsize:0,
      rate: 1,
      max: 5
    });
  }
  function updateExplosions(){
    explosions.forEach(function(exp){
      exp.lsize = exp.size;
      
      c.cursor.reset();
      c.circ(exp.x, exp.y, exp.lsize);

      c.bg(255,128,0);
      c.circ(exp.x, exp.y, exp.size);

      exp.size+=exp.rate;
      if(exp.size>exp.max){
        c.cursor.reset();
        c.circ(exp.x, exp.y, exp.lsize);
        explosions.shift();
      }
    });
  }

  function updateEnemies(){
    enemies.forEach(function(enemy){
      enemy.ly = enemy.y;
      enemy.lx = enemy.x;
      enemy.y+=enemySpeed;
      enemy.x=enemy.x+(sin(tick/10)/1.5);
     
      // Only draw enemies again if they have moved
      if(int(enemy.y)!==int(enemy.ly) ||
          int(enemy.x)!==int(enemy.lx)) 
        {
          c.cursor.reset();
          drawEnemy(int(enemy.lx), int(enemy.ly));

          c.bg(255,0,0);
          drawEnemy(int(enemy.x), int(enemy.y));  
      }
    });
  }


  function updateScore(add){
    score+=add;
    c.cursor.reset();
    c.fg(255,255,255);
    c.text(0, c.rows, "Score: "+ int(score));
  }

  function drawPlayer(x, y){
    c.bg(0,255,0);
    c.line(x-2, y, x+2, y);  
    c.line(x, y, x, y-3);  
    c.line(x-2, y, x-2, y-2);  
    c.line(x+2, y, x+2, y-2);  
  }

  function erasePlayer(x, y){
    c.cursor.reset();
    c.line(x-2, y, x+2, y);  
    c.line(x, y, x, y-3);  
    c.line(x-2, y, x-2, y-2);  
    c.line(x+2, y, x+2, y-2);  
  }

  function drawEnemy(x,y){
    c.line(x-1, y, x+1, y);
    c.line(x-1, y, x-1, y+2);
    c.line(x+1, y, x+1, y+2);
  }


  function eachLoop(){
    tick+=1;

    width = c.cols;
    height = c.rows;
  
    updateBullets();
    updateEnemies();
    updateExplosions();
    checkKeyDown();

    erasePlayer(lp1x,lp1y);
    drawPlayer(p1x,p1y);
  }

  
  function endGame(){
    process.stdin.pause();
    clearInterval(gameLoop);
    c.cursor.on();
    c.cursor.reset();
  }


  function start(){
    c.cursor.off();
    c.clear();
    gameLoop = setInterval(eachLoop, interval);
    process.stdin.setRawMode(true);
    keypress(process.stdin);
    process.stdin.resume();
  }


  start();


  function left(){
    lp1x = p1x;
    p1x-=p1x>4?1:0;
  }
  function right(){
    lp1x = p1x;
    p1x+=p1x<width-4?1:0;
  }






  //// KEYBOARD EVENTS ///////////////////////////////////////////////////////


  var keyDown = null;
  var lastChecked = now();
  var releaseTime = 25;

  function now(){
    return (+new Date());
  };


var dir;
  function checkKeyDown(){
    // if (now()-lastChecked>30){
    //   keyDown =null;
    // }

    switch(dir){
    case 'left':
      left();
      break;
    case 'right':
      right();
      break;
    }

    lastChecked = now();
  }

process.stdin.on('keypress', function (ch, key) {
  
  // console.log(key, ch);

  // keyDown = null;

  if (key) {
    if (key.name == 'escape') endGame();
    if (key.name == 'q') endGame();
    if (key.name == 'left') dir = 'left';
    if (key.name == 'right') dir = 'right';
    if (key.name == 'space') shoot();
  }

  if (key && key.ctrl && key.name == 'c') { 
    endGame();
  }
  // console.log('got "keypress"', key); 
});


