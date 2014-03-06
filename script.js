/*
Moody Particle-Generator. Uncomment code for automated movement
*/

var HEIGHT;
var WIDTH;
var ctx;
var particleList;
var canvas;
var mousex;
var mousey;
var dx;
var dy;
var moodLevel;
var bounce = false;
var gravity = false;
var gravitron = true;
var slinky = false;
//var time;

function init() {
    HEIGHT = parseInt(document.getElementById('canvas').getAttribute('height'));
    WIDTH = parseInt(document.getElementById('canvas').getAttribute('width'));
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    particleList = [];
    mousex = WIDTH/2;
    mousey = HEIGHT/2;
    moodLevel = 1;
    //time = 0;
    //move();
    setInterval(draw, 15);
}

function draw() {
    if (!slinky) ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.save();
    //ctx.translate(WIDTH/2, HEIGHT/2);

    function Particle(x, y, dx, dy) {
        this.x = mousex;
        this.y = mousey;
        this.age = 0;
        switch(true) {
          case moodLevel > -12 && moodLevel <= 1:
            this.dx = dx * 0.8;
            this.dy = dy * 0.8;
            this.color = calmBlue();
            this.radius = Math.floor(HEIGHT/40);
            break;
          case moodLevel > 1 && moodLevel <= 3000:
            this.dx = dx;
            this.dy = dy;
            this.color = randomColor();
            this.radius = Math.floor(HEIGHT/60);
            break;
          case moodLevel > 3000:
            this.dx = dx * 2;
            this.dy = dy * 2;
            this.color = fieryRed();
            this.radius = Math.floor(HEIGHT/90);
            break;
        }
    }

    // create particles and add to array
    var amount = (moodLevel > 3000) ? 2 : 1;
    for (var i = 0; i < amount; i++) {
        var part = new Particle(WIDTH/2,HEIGHT/2,Math.random()*5-2.5,Math.random()*5-2.5);
        particleList.push(part);
    }

    // draw particles
    for (i = 0; i < particleList.length; i++) {
        var current = particleList[i];
        ctx.strokeStyle = current.color + (1.25 - current.age/100) + ')';

        if (bounce) {
            if (current.x + current.radius > WIDTH || current.x - current.radius < 0) current.dx = -current.dx;
            if (current.y + current.radius > HEIGHT || current.y - current.radius< 0) current.dy = -current.dy;
        }

        if (gravity) current.dy -= 0.1;

        if (gravitron) {
            var xdistance = mousex - current.x;
            var ydistance = mousey - current.y;
            current.dx -= xdistance / (WIDTH * 2);
            current.dy -= ydistance / (HEIGHT * 2);
        }

        ctx.beginPath();
        ctx.arc(current.x, current.y, current.radius, 0, 2*Math.PI);
        ctx.stroke();

        current.x -= current.dx;
        current.y -= current.dy;
        current.age += 1;
        //time += 0.001;

        // memory help
        if (particleList.length > 600) {
            particleList = particleList.slice(300, 600);
        }
    }

    // mood changes
    if (moodLevel > 0) moodLevel -= 12;
    //move();

    ctx.restore();
}

// controls automated movement
function move() {
    mousex = Math.floor((0.65-1) * (Math.cos(time) + 1) * (Math.cos(time * (0.65-1))) * WIDTH/5);
    mousey = Math.floor((0.65-1) * (Math.sin(time) - 1) * (Math.sin(time * (0.65-1))) * HEIGHT/5);
}


// color definitions
function randomColor() {
  var color = "rgba(";
  for (var i = 0; i < 3; i++) {
    var colorValue = Math.floor(Math.random()*256);
    color += colorValue + ',';
  }
  return color;
}

function calmBlue() {
  var r = Math.floor(Math.random() * -95 + 110);
  var g = Math.floor(Math.random() * -80 + 210);
  var b = Math.floor(Math.random() * -50 + 280);
  return "rgba(" + r + "," + g + "," + b + ","
}

function fieryRed() {
  var r = Math.floor(Math.random() * -50 + 280);
  return "rgba(" + r + ",0,0,";
}


$(document).ready(function() {

  // mouse tracking
  $('canvas').mousemove(function(e) {
    if (e.which == 1) {
      var offset = $(this).offset();
      dx = (mousex - (e.clientX - offset.left) != 0) ? (Math.abs(mousex - (e.clientX - offset.left))) : dx;
      dy = (mousey - (e.clientY - offset.top) != 0) ? (Math.abs(mousey - (e.clientY - offset.top))) : dy;
      if (dx + dy) moodLevel += (dx + dy);
      mousex = e.clientX - offset.left;
      mousey = e.clientY - offset.top;
    }
  });
  $('canvas').mousedown(function(e) {
      var offset = $(this).offset();
      mousex = e.clientX - offset.left;
      mousey = e.clientY - offset.top;
  });

  // buttons
  $('#gravField').click(function() {
      if (gravitron) {
        gravitron = false;
      } else {
        gravitron = true;
      }
      $('#gravField').toggleClass('on off');
  });
  $('#gravity').click(function() {
      if (gravity) {
        gravity = false;
      } else {
        gravity = true;
      }
      $('#gravity').toggleClass('on off')
  })
  $('#bounce').click(function() {
      if (bounce) {
        bounce = false;
      } else {
        bounce = true;
      }
      $('#bounce').toggleClass('on off');
  });
    $('#slinky').click(function() {
      if (slinky) {
        slinky = false;
      } else {
        slinky = true;
      }
      $('#slinky').toggleClass('on off');
  });
});
