var    canvas = document.getElementsByTagName('canvas')[0],
	   	  ctx = canvas.getContext('2d'),
 defaultWidth = 600,
defaultHeight = 400,


function init() {
	canvas.height = defaultHeight;
	canvas.width = defaultWidth;
	window.addEventListener('resize', resize);
	resize();
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





















init();
