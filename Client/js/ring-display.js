/******** VARIABLE DECLARATION ********/
var prevTime = 0;

/******** MAIN LOOP ********/
function mainLoop() {

	setTimeout(function () { window.requestAnimationFrame(mainLoop); }, 1000);

	var dt = new Date();
	rotateRings(dt.getSeconds(), dt.getMinutes(), dt.getHours());
	
}

	// Start the cycle

function rotateRings(seconds, minutes, hours) {
	var time = hours + ":" + minutes + ":" + seconds;
	console.log(time);

	var rotSixtyAmt = 360 / 60;
	var rotTwelveAmt = 360 / 12;

	jQuery('#' + ringNames[0]).css({ 'transform': 'rotate(' + seconds * rotSixtyAmt + 'deg) translate(-50%, -50%)' });

	jQuery('#' + ringNames[1]).css({ 'transform': 'rotate(' + minutes * rotSixtyAmt + 'deg) translate(-50%, -50%)' });
	jQuery('#' + ringNames[2]).css({ 'transform': 'rotate(' + minutes * rotSixtyAmt + 'deg) translate(-50%, -50%)' });

	jQuery('#' + ringNames[3]).css({ 'transform': 'rotate(' + hours * rotTwelveAmt + 'deg) translate(-50%, -50%)' });
	jQuery('#' + ringNames[4]).css({ 'transform': 'rotate(' + hours * rotTwelveAmt + 'deg) translate(-50%, -50%)' });
}

function initializeHTML() {
	mainLoop();
	initializeScanning();
}

/******** Handle QR Code Scanning ********/
/*
	This is made possible thanks to a library by mebjas on github, licensed under the Apache 2.0 license
	https://github.com/mebjas/html5-qrcode
*/
function initializeScanning() {
	// This method will trigger user permissions
	Html5Qrcode.getCameras().then(devices => {
		/**
		 * devices would be an array of objects of type:
		 * { id: "id", label: "label" }
		 */
		if (devices && devices.length) {
			var cameraId = devices[0].id;

			const html5QrCode = new Html5Qrcode("reader");
			html5QrCode.start(
				cameraId,
				{
					fps: 2,
					qrbox: 1000
				},
				qrCodeMessage => {
					loadRingsFromQR(qrCodeMessage);
				},
				errorMessage => {
					// console.log(errorMessage)
				})
				.catch(err => {
					// Start failed, handle it.
				});
		}
	}).catch(err => {
		// handle err
	});
}

function loadRingsFromQR(qrCodeMessage) {
	var rings = qrCodeMessage.split('.');
	if (rings[0] == PASS.split('.')[0]) {
		rings.shift()

		if (Object.values(artistPicks) == rings.toString()) {
			console.log('ring already active')
			return;
		}

		for (i = 0; i < ringNames.length; i++) {
			addRing(ringNames[i], rings[i]);
		}
	}
}