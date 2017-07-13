


// https://www.html5rocks.com/en/tutorials/canvas/hidpi/

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, id, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.getElementById(id);
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px"; 
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

//end

function setFontSize(ctx, size) {
	ctx.font = size +'px "Myriad Pro","Segoe UI","Arial"';
}


w = 500
h = 500



function render(state) {

  var {canvas,ctx} = state;

  var frequency = .2;
  phi = -state.t/10;
  var amplitude = h/48;

  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w/3, 3.5*h/10);
  ctx.rotate(-Math.PI/6);
  ctx.translate(-w/3, -3.5*h/10);
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "hsl(" + state.t + ",100%,50%)";
  for (var x = w/3 + 0.05*w; x < w; x++) {
    y = Math.sin(x * frequency + phi) * amplitude / 2 + amplitude / 2 + h/4;
    //y = Math.cos(x * frequency + phi) * amplitude / 2 + amplitude / 2;
    

    if(x === 0) {
      ctx.moveTo(x, y+40);
    } else {
      ctx.lineTo(x, y + 40); // 40 = offset
    }
  }

  ctx.stroke();
  
  var frequency = 5
  
  // c
  phi = state.t/10;
  ctx.restore()


  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "hsl(" + (state.t+100) + ",100%,50%)";
  // ctx.moveTo(0, h);
  for (var x = 0; x < w/3; x++) {
    y = Math.sin(x * frequency + phi) * amplitude / 2 + amplitude / 2 + h/4;
    //y = Math.cos(x * frequency + phi) * amplitude / 2 + amplitude / 2;
    

    if(x === 0) {
      ctx.moveTo(x, y+40);
    } else {
      ctx.lineTo(x, y + 40); // 40 = offset
    }

  }

  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = 'yellow'
  ctx.arc(w/3,3.5*h/10,30,0,2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'yellow'
  ctx.arc(Math.max((w/3 + state.t*5) % (w),w/3),Math.max((3.5*h/10 + state.t*5) % (h), 3.5*h/10),5,0,2*Math.PI);
  ctx.fill();  
  
  
  state.t ++;

  requestAnimationFrame(render.bind(window,state));
}

function init(name) {
  var canvas = createHiDPICanvas(500, 500, name),
    ctx = canvas.getContext('2d');

  console.log(canvas);

  var state = {
    canvas,
    ctx,
    t: 0
  }
  requestAnimationFrame(render.bind(window,state));
  

}

init('draw');