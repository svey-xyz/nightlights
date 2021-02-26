/******** VARIABLE DECLARATION ********/
const PASS = 'dnl.';

var artistPicks = []

//ringGraphics passed from PHP
var ringNames

/******** VARIABLES ********/
var ver = '0.0.3';
var mobile = false;
var height;
var vh;
const prevPage = document.referrer;
/******** INITIALIZATION ********/
;

/******** INITIALIZATION ********/
; (function () {
	if (/Mobi|Android/i.test(navigator.userAgent)) {
		mobile = true;
	}
	height = window.innerHeight;
	vh = height * 0.01;
	window.addEventListener("resize", resize);
	resize();
	console.log(`JS Version is: ${ver}`);
})();

jQuery(document).ready(function () {
	ringNames = Object.keys(ringGraphics);
	console.log(ringGraphics)
	preloadImages();

	jQuery('#htmlContainer').load(loadedHTML, function () {
		createRings();
		initializeHTML();
	});
});

function resize() {
	if (!mobile) {
		height = window.innerHeight;
		vh = height * 0.01;
	}
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/******** RING CREATION ********/
function createRings() {
	for (i = 0; i < ringNames.length; i++) {
		addRing(ringNames[i], pickArtist(ringNames[i]));
	}
}

function pickArtist(ringPos) {
	var artistInt = 0;
	if (!document.getElementById(ringPos)) {
		artistInt = Math.floor(Math.random() * ringGraphics[ringPos].length);
	} else {
		artistInt = parseInt(jQuery('#' + ringPos).attr('artist'));
		artistInt = (artistInt + 1 < ringGraphics[ringPos].length) ? (artistInt + 1) : 0;
	}
	return artistInt;
}

function addRing(ringPos, artistInt) {
	artistPicks[ringPos] = artistInt;

	var ring = ringGraphics[ringPos][artistInt];
	var srcLoc = "/wp-content/" + ring.split("/wp-content/").pop();

	if (!document.getElementById(ringPos)) return newRing(ringPos, artistInt, srcLoc);
	console.log('ring replace img')

	var imgDOM = jQuery('#' + ringPos);

	imgDOM.attr("src", srcLoc);
	imgDOM.attr('artist', artistInt);
}

function newRing(ringPos, artistInt, srcLoc) {
	var ringImg = jQuery('<img />', {
		id: ringPos,
		src: srcLoc,
		class: 'ring',
		artist: artistInt
	});

	jQuery("#ringContainer").prepend(ringImg);
	jQuery('#' + ringPos).on("click", function (event) {
		pngClickThrough(event, event.target)
	});
}

/******** PreCache images for better responsiveness ********/
function getImageLocs() {
	var imgLocs = [];
	for (p = 0; p < ringNames.length; p++) {
		var artists = ringGraphics[ringNames[p]];

		for (a = 0; a < artists.length; a++) {
			var ring = ringGraphics[ringNames[p]][a];
			var srcLoc = "/wp-content/" + ring.split("/wp-content/").pop();
			imgLocs.push(srcLoc);
			
		}
	}
	return imgLocs;
}

function preloadImages() {
	var imgLocs = getImageLocs();

	if (!preloadImages.list) {
		preloadImages.list = [];
	}

	var list = preloadImages.list;
	for (var i = 0; i < imgLocs.length; i++) {
		var img = new Image();
		img.onload = function () {
			var index = list.indexOf(this);
			if (index !== -1) {
				// remove image from the array once it's loaded
				// for memory consumption reasons
				list.splice(index, 1);
			}
		}
		list.push(img);
		img.src = imgLocs[i];
		console.log(img);
	}
}