var    canvas = document.getElementsByTagName('canvas')[0],
	  wrapper = canvas.parentElement,
	   	  ctx = canvas.getContext('2d'),
 defaultWidth = 600,
defaultHeight = 400,
 currentCurve = null,
 	   colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'],
	   Curves = [];

function Curve(startX, startY, endX, endY) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.color = colors[ Math.floor(Math.random() * 5) ];
	Curves.push(this);

	this.draw = function() {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.stroke();
		ctx.closePath();
	}
}

function init() {
	canvas.height = defaultHeight;
	canvas.width = defaultWidth;
	ctx.globalCompositeOperation = 'lighter';
	window.addEventListener('resize', resize);
	canvas.addEventListener('mousedown', canvasMouseDown);
	canvas.addEventListener('mouseup', canvasMouseUp);
	canvas.addEventListener('mousemove', canvasMouseMove);
	canvas.addEventListener('mouseout', canvasMouseOut);
	resize();
}

function resize() {
	if (window.innerWidth > canvas.width) {
		wrapper.style.left = (window.innerWidth - canvas.width)/2+'px';
	} else {
		wrapper.style.left = 0;
	}
	if (window.innerHeight > canvas.height) {
		wrapper.style.top = (window.innerHeight - canvas.height)/2+'px';
	} else {
		wrapper.style.top = 0;
	}
}

function canvasMouseDown(event) {
	var x = getMouseX(event.clientX);
	var y = getMouseY(event.clientY);

	currentCurve = new Curve(x, y, x, y);

}

function canvasMouseUp(event) {
	var x = getMouseX(event.clientX);
	var y = getMouseY(event.clientY);

	currentCurve = null;
}

function canvasMouseMove(event) {
	var x = getMouseX(event.clientX);
	var y = getMouseY(event.clientY);
	document.getElementsByTagName('P')[0].innerHTML = '(' + x + ', ' + y + ')';	

	if (currentCurve != null) {
		currentCurve.endX = x;
		currentCurve.endY = y;
	}
}

function canvasMouseOut(event) {
	document.getElementsByTagName('P')[0].innerHTML = '';
	currentCurve = null;
}

function getMouseX(x) {
	return x - canvas.offsetLeft + window.pageXOffset - 5;	// Subtract width of canvas border
}

function getMouseY(y) {
	return y - canvas.offsetTop + window.pageYOffset - 5;	// Subtract width of canvas border
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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