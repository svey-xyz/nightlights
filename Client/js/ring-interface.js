/******** VARIABLE DECLARATION ********/
const QRSIZE = 256;

/******** INITIALIZATION ********/
function initializeHTML() {
	var popup = jQuery('#popupContainer');
	var btn = jQuery('#qrButton');
	var close = jQuery('#qrClose');

	btn.on("click", function (event) {
		generateQRCode();
		popup.css('display', 'block');
	});
	close.on("click", function (event) {
		popup.css('display', 'none');
	});
	jQuery(window).on("click", function (event) {
		var target = jQuery(event.target);
		if (target.get(0) == popup.get(0)) {
			popup.css('display', 'none');
		}
	});
}

/******** QR Code Generation ********/
/*
	This is made possible thanks to a library by jeromeetienne on github, licensed under the MIT license
	https://github.com/jeromeetienne/jquery-qrcode
*/
function generateQRCode() {
	var artistsValue = PASS;

	var artistArray = Object.values(artistPicks);
	for (a = 0; a < artistArray.length; a++) {

		artistsValue += artistArray[a].toString();
		if (a < artistArray.length - 1) artistsValue += '.'
	}

	// console.log(artistsValue.split('.'));

	jQuery(function () {
		let size;
		var windowShort = Math.min(getWinWidth(), getWinHeight());

		if (windowShort < QRSIZE) {
			size = windowShort * 0.9;
		} else {
			size = QRSIZE;
		}

		jQuery('#qrcodeCanvas').children().remove();
		jQuery('#qrcodeCanvas').qrcode({
			text: artistsValue,
			width: size,
			height: size
		});
	});
}

/******** ALLOW TRANSPARENCY CLICK THROUGH ********/
const ctx = document.createElement("canvas").getContext("2d");
let stack = [];

function pngClickThrough(ev, target) {
	if (jQuery(target).attr('class') != 'ring') clickThroughRelease(target);
	if (!target.offsetParent) return;

	// Get click coordinates
	const isImage = /img/i.test(target.tagName),
		x = ev.pageX - target.offsetParent.offsetLeft,
		y = ev.pageY - target.offsetParent.offsetTop;

	ctx.canvas.width = getWinWidth();
	ctx.canvas.height = getWinHeight();
	let alpha;

	// Draw image to canvas and read Alpha channel value
	if (isImage) {
		var rect = target.getBoundingClientRect();
		ctx.drawImage(target, rect.left, rect.top, target.width, target.height);		
		alpha = ctx.getImageData(x, y, 1, 1).data[3]; // [0]R [1]G [2]B [3]A
	}

	if (alpha === 0) {
		target.style.pointerEvents = "none";
		stack.push(target);
		return pngClickThrough(ev, document.elementFromPoint(ev.clientX, ev.clientY)); // REPEAT
	} else { 
		clickThroughRelease(target);
	}
}

function clickThroughRelease(target) {
	stack.forEach(el => (el.style.pointerEvents = "auto")); // Show all hidden elements
	stack = [];               // Reset stack
	
	if (jQuery(target).attr('class') != 'ring') return;
	var ringPos = target.id;
	if (ringPos) addRing(ringPos, pickArtist(ringPos));
}

/******** MATHS ********/
function getWinWidth() {
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	);
}

function getWinHeight() {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
}

