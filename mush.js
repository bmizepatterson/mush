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
	this.slope = (endY-startY)/(endX-startX);
	this.b = this.startY - this.slope * this.startX;
	this.color = colors[ Math.floor(Math.random() * 5) ];
	this.startVX = Math.round( Math.random() * 6) - 1.5;
 	this.startVY = Math.round( Math.random() * 6) - 1.5;
 	this.endVX = Math.round( Math.random() * 6) - 1.5;
 	this.endVY = Math.round( Math.random() * 6) - 1.5;
 	this.midpointX = Math.round((startX+endX)/2);
 	this.midpointY = Math.round((startY+endY)/2);
 	this.centerX = (this.endX+this.startX)/2;
 	this.centerVX = 1; //Math.round( Math.random() * 6);
 	this.centerY = this.slope * this.centerX + this.b;
 	this.centerDelta = 100;
 	this.id = Curves.length;
	Curves.push(this);

	this.draw = function() {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 1;
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 20;
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.stroke();
		ctx.closePath();

		var length = distance(this.startX, this.startY, this.endX, this.endY);
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, length/30, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();		
		
		if (Curves.length > this.id+1) {
			var next = Curves[this.id+1];
			var radius = distance(this.midpointX, this.midpointY, next.midpointX, next.midpointY)/2;
			var centerX = (this.midpointX+next.midpointX)/2;
			var centerY = (this.midpointY+next.midpointY)/2;
			ctx.beginPath();
			// ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			ctx.moveTo(this.endX, this.endY);
			ctx.lineTo(next.startX, next.startY);
			ctx.stroke();
			ctx.closePath();
		}

		this.startX += this.startVX;
		this.startY += this.startVY;
		this.endX += this.endVX;
		this.endY += this.endVY;
		this.centerX += this.centerVX;
		this.centerY = this.evaluate(this.centerX);
		this.midpointX = (this.endX+this.startX)/2;
		this.midpointY = (this.endY+this.startY)/2;
		this.slope = (this.endY-this.startY)/(this.endX-this.startX);
		this.b = this.startY - this.slope * this.startX;

		if (this.startX > canvas.width || this.startX < 0) this.startVX = -this.startVX;
		if (this.endX > canvas.width || this.endX < 0) this.endVX = -this.endVX;
		if (this.startY > canvas.height || this.startY < 0) this.startVY = -this.startVY;
		if (this.endY > canvas.height || this.endY < 0) this.endVY = -this.endVY;

		if (this.startX < this.endX) {
			if (this.centerX > this.endX) {
				this.centerX = this.endX;
				this.centerVX = -this.centerVX;
			}
			if (this.centerX < this.startX) {
				this.centerX = this.startX;
				this.centerVX = -this.centerVX;
			}
		} else if (this.endX < this.startX) {
			if (this.centerX > this.startX) {
				this.centerX = this.startX;
				this.centerVX = -this.centerVX;
			}
			if (this.centerX < this.endX) {
				this.centerX = this.endX;
				this.centerVX = -this.centerVX;
			}
		} else if (this.startX === this.endX) {
			if (this.startY < this.endY) {
				if (this.centerY > this.endY) this.centerY = this.endY;
				if (this.centerY < this.startY) this.centerY = this.startY
			}
			if (this.endY < this.startY) {
				if (this.centerY > this.startY) this.centerY = this.startY;
				if (this.centerY < this.endY) this.centerY = this.endY;
			}
			this.centerX = this.startX;
		}

	}

	this.evaluate = function(x) {
		return this.slope * x + this.b;
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
	canvas.addEventListener('mouseover', canvasMouseOver);
	document.getElementById('clear').addEventListener('click', clear);
	document.getElementById('add').addEventListener('click', add);
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
	// Check for collisions
	// var collision = checkForCollision(x, y);
	// if (collision instanceof Curve) {
	// 	collision.highlighted = true;
	// }
}

function canvasMouseOver(event) {
	// document.getElementsByTagName('UL')[0].style.left = '-70px';
}

function canvasMouseOut(event) {
	document.getElementsByTagName('P')[0].innerHTML = '';
	// document.getElementsByTagName('UL')[0].style.left = '5px';
	currentCurve = null;
}

function checkForCollision(x, y) {
	var collision = false;
	for (let i = 0; i < Curves.length; i++) {
		if (y === Curves[i].evaluate(x)) {
			collision = Curves[i];
			break;
		}
	}
	return collision;
}

function clear() {
	Curves = [];
}

function add() {
	var startX = Math.random() * canvas.width;
	var endX = Math.random() * canvas.width;
	var startY = Math.random() * canvas.height;
	var endY = Math.random() * canvas.height;
	new Curve(startX, startY, endX, endY);
}

function distance(x1, y1, x2, y2) {
	// Use the distance formula to calculate the distance between two points.
	return Math.sqrt( Math.pow( (x2-x1), 2 ) + Math.pow( (y2-y1), 2 ) );
}

function getMouseX(x) {
	return x - wrapper.offsetLeft + window.pageXOffset;
}

function getMouseY(y) {
	return y - wrapper.offsetTop + window.pageYOffset;
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