var    canvas = document.getElementsByTagName('canvas')[0],
	   	  ctx = canvas.getContext('2d'),
 defaultWidth = 600,
defaultHeight = 400,
	   Curves = [];

function Curve(startX, startY, endX, endY) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	Curves.push(this);

	this.draw = function() {
		ctx.strokeStyle = getStrokeStyle();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.stroke();
		ctx.closePath();
	}
}

function getStrokeStyle() {
	return 'white';
}

function init() {
	canvas.height = defaultHeight;
	canvas.width = defaultWidth;
	window.addEventListener('resize', resize);
	canvas.addEventListener('mousedown', canvasMouseDown);
	canvas.addEventListener('mousemove', canvasMouseMove);
	canvas.addEventListener('mouseout', canvasMouseOut);
	resize();
	var newCurve = new Curve(10, 30, 300, 300);
}

function resize() {
	if (window.innerWidth > canvas.width) {
		canvas.style.left = (window.innerWidth - canvas.width)/2+'px';
	} else {
		canvas.style.left = 0;
	}
	if (window.innerHeight > canvas.height) {
		canvas.style.top = (window.innerHeight - canvas.height)/2+'px';
	} else {
		canvas.style.top = 0;
	}
}

function canvasMouseDown(event) {
	var x = event.clientX - canvas.offsetLeft + window.pageXOffset;
	var y = event.clientY - canvas.offsetTop + window.pageYOffset;
}

function canvasMouseMove(event) {
	var x = event.clientX - canvas.offsetLeft + window.pageXOffset;
	var y = event.clientY - canvas.offsetTop + window.pageYOffset;
	document.getElementsByTagName('P')[0].innerHTML = '(' + x + ', ' + y + ')';	
}

function canvasMouseOut(event) {
	document.getElementsByTagName('P')[0].innerHTML = '';
}

function draw() {
	for (let i = 0; i < Curves.length; i++) {
		Curves[i].draw();
	}
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

function loop() {
  draw();
  requestAnimFrame(loop);
};

init();
loop();