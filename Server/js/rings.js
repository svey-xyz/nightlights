/******** VARIABLE DECLARATION ********/
const PASS = 'dnl.';
const ver = '0.0.2';

var ringGraphics = [
	centreRings = [
		"./Rings/Centre/Blue-Centre.png",
		"./Rings/Centre/Grey-Centre.png",
		"./Rings/Centre/Red-Centre.png",
	],
	InnerRings1 = [
		"./Rings/Inner-1/Blue-Inner-1.png",
		"./Rings/Inner-1/Grey-Inner-1.png",
		"./Rings/Inner-1/Red-Inner-1.png",
	],
	InnerRings2 = [
		"./Rings/Inner-2/Blue-Inner-2.png",
		"./Rings/Inner-2/Grey-Inner-2.png",
		"./Rings/Inner-2/Red-Inner-2.png",
	],
	OutterRings1 = [
		"./Rings/Outter-1/Blue-Outter-1.png",
		"./Rings/Outter-1/Grey-Outter-1.png",
		"./Rings/Outter-1/Red-Outter-1.png",
	],
	OutterRings2 = [
		"./Rings/Outter-2/Blue-Outter-2.png",
		"./Rings/Outter-2/Grey-Outter-2.png",
		"./Rings/Outter-2/Red-Outter-2.png",
	],

]

var artistPicks = []

//ringGraphics passed from PHP
var ringNames

/******** INITIALIZATION ********/
; (function () {
	console.log('JS Ver: ' + ver);
})();

$(document).ready(function () {
	ringNames = Object.keys(ringGraphics);
	preloadImages();

	createRings();
	checkContainer();
	
});

function checkContainer() {
	console.log("checking")
	if ($('.scanner-holder').is(':visible')) { //if the container is visible on the page
		initializeHTML();
	} else {
		setTimeout(checkContainer, 50); //wait 50 ms, then try again
	}
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
	var srcLoc = ring;

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
			var srcLoc = ring;
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
		// console.log(img);
	}
}
