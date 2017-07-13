

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
w = 500
h = 400

function generateMetal({canvas,ctx,metalColumns,nColumns,min,max}, color='rgb(100, 120, 100)') {


	ctx.fillStyle = color;
	var columnHeights = []

	if(metalColumns.length <= 0) {
		console.log('Populating metal...');
		for(var i = 0; i < nColumns; i++) {
			let height = _.random(min, max, true)
			metalColumns.push(height);
			// ctx.fillRect( w* (i / nColumns), h - height, w/nColumns, height); 
		}
	}

	// console.log(metalColumns);

	for(var i = 0; i < metalColumns.length; i++) {
		let height = metalColumns[i];
		ctx.fillRect( w* (i / nColumns), h - height, w/nColumns, height); 
	}

}


function setFontSize(ctx, size) {
	ctx.font = size +'px "Myriad Pro","Segoe UI","Arial"';
}

function drawLabels({canvas, ctx, curMicroscopeX}) {

	setFontSize(ctx, 20);

	var metalLabel = "Conductive surface",
		metalWidth = ctx.measureText(metalLabel).width;

	ctx.fillStyle = 'white';
	ctx.fillText(metalLabel, (w-metalWidth) / 2, h * 0.9);


	setFontSize(ctx, 10);
	var microscopeLabel = "Platinum-Iridium wire",
		microscopeLabelWidth = ctx.measureText(metalLabel).width;

	ctx.fillStyle = 'black';

	ctx.fillText(microscopeLabel, curMicroscopeX <= w*.5 ? curMicroscopeX + w*.05 : curMicroscopeX - w*.05 - microscopeLabelWidth, h * 0.2);



}

function drawMicroscope(state, maxT = Math.pow(10, 3)) {

	var {canvas, ctx, t} = state

	ctx.fillStyle = 'rgb(200, 50, 50)';

	state.curMicroscopeX = ((t/maxT) * w) % w

	ctx.fillRect(state.curMicroscopeX, 0, state.microscopeWidth, h *.72);
}

function getColumnHeight(state, x) {

	return state.metalColumns[Math.floor(x / (w/state.nColumns))];
}


function drawElectrons(state) {

	var {canvas, ctx, electrons, electronCount} = state;
	while(electrons.length < electronCount) {
		x = state.curMicroscopeX + _.random(-w/ (2*state.nColumns), w/ (2*state.nColumns), true)
		electrons.push([x, (h*.03)+h - getColumnHeight(state, x)]);
	}

	for(var [x,y] of electrons) {
		
		if(Math.random() < .008) {
			// tunnel electron
			state.tunneling.push([x,h*.72]);
			delete electrons[electrons.indexOf([x,y])];
		} else {
			ctx.fillStyle = 'yellow';
			x += state.curMicroscopeX + _.random(-w/ (2*state.nColumns));
			y = (h*.03)+h - getColumnHeight(state, x) + _.random(-w/ (2*state.nColumns), true);
			ctx.fillRect(x,y, 2, 2);
		}
	}

	for(var i = 0; i < state.tunneling.length; i++) {
		var [x,y] = state.tunneling[i];
		ctx.fillStyle = 'yellow';
		x = state.curMicroscopeX + state.microscopeWidth/2 - 1;
		state.tunneling[i] = [x,y-5]
		ctx.fillRect(x,y, 2, 2);
	}

}

function render(state) {

	var {canvas, ctx } = state

	ctx.clearRect(0, 0, w, h);
	
	generateMetal(state);

	drawLabels(state);

	drawMicroscope(state);

	drawElectrons(state);

	state.t++

	// console.log(state.t)

	requestAnimationFrame(render.bind(window,state));
}

function init(canvas) {
	var canvas = createHiDPICanvas(500, 500, 'draw'),
		ctx = canvas.getContext('2d');

	console.log(canvas);

	var state = {
		canvas,
		ctx,
		metalColumns: [],
		electronCount: 10,
		electrons: [],
		curMicroscopeX: 0,
		t: 0,
		nColumns: 20, 
		min:h * .25, 
		max:h*.27,
		tunneling: [],
		microscopeWidth: 5
	}
	requestAnimationFrame(render.bind(window,state));
	

}

init('draw');