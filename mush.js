var canvas = document.getElementsByTagName('canvas')[0],
	   ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;
canvas.style.left = (window.innerWidth - canvas.width)/2+'px';

if (window.innerHeight > canvas.height) {
	canvas.style.top = (window.innerHeight - canvas.height)/2+'px';
}