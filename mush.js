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
	this.startVX = Math.round( Math.random() * 3);
 	this.startVY = Math.round( Math.random() * 3);
 	this.endVX = Math.round( Math.random() * 3);
 	this.endVY = Math.round( Math.random() * 3);
 	this.midpointX = Math.round((startX+endX)/2);
 	this.midpointY = Math.round((startY+endY)/2);
 	this.length = distance(startX, startY, endX, endY);
 	this.id = Curves.length;
 	this.intersections = [];
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

		// Check for intersections
		var temp = [];
		for (let i = 0; i < Curves.length; i++) {
			if (i === this.id || Curves[i].intersections.indexOf(this.id) != -1) continue;
			let result = checkLineIntersection(this.startX, this.startY, this.endX, this.endY, Curves[i].startX, Curves[i].startY, Curves[i].endX, Curves[i].endY);
			if (result.onLine1 && result.onLine2) {
				temp.push(i);
				ctx.beginPath();
				ctx.arc(result.x, result.y, (this.length+Curves[i].length)/50, 0, 2*Math.PI);
				ctx.stroke();
			}
		}
		this.intersections = temp;

		this.startX += this.startVX;
		this.startY += this.startVY;
		this.endX += this.endVX;
		this.endY += this.endVY;
		this.midpointX = (this.endX+this.startX)/2;
		this.midpointY = (this.endY+this.startY)/2;
		this.slope = (this.endY-this.startY)/(this.endX-this.startX);
		this.b = this.startY - this.slope * this.startX;
		this.length = distance(this.startX, this.startY, this.endX, this.endY);

		if (this.startX > canvas.width || this.startX < 0) this.startVX = -this.startVX;
		if (this.endX > canvas.width || this.endX < 0) this.endVX = -this.endVX;
		if (this.startY > canvas.height || this.startY < 0) this.startVY = -this.startVY;
		if (this.endY > canvas.height || this.endY < 0) this.endVY = -this.endVY;

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


function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
		/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

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
	new Curve(startX, startY, startX+1, startY+1);
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