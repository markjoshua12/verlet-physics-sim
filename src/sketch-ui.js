
function initSettingsUI() {

	let settingsCont = select('.settings-container');
	settingsCont.mouseOver(function() {
		mouseInsideSketch = false;
	});
	settingsCont.mouseOut(function() {
		mouseInsideSketch = true;
	});

	// Sliders and input
	gravityXSlider = select('#wind-range').value(initGravityX);
	gravityXInput = select('#wind-input').value(initGravityX);

	gravityYSlider = select('#gravity-range').value(initGravityY);
	gravityYInput = select('#gravity-input').value(initGravityY);

	gravityXSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			gravityXInput.value(gravityXSlider.value());
			gravity.x = gravityXSlider.value();
		}
	});
	gravityXInput.changed(function() {
		gravityXSlider.value(gravityXInput.value());
		gravity.x = gravityXSlider.value();
	});

	gravityYSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			gravityYInput.value(gravityYSlider.value());
			gravity.y = gravityYSlider.value();
		}
	});
	gravityYInput.changed(function() {
		gravityYSlider.value(gravityYInput.value());
		gravity.y = gravityYSlider.value();
	});

	let clothWidthSlider = select('#cloth-width-range').value(clothWidth);
	let clothWidthInput = select('#cloth-width-input').value(clothWidth);

	let attachedPointsSlider = select('#attached-points-range').value(clothAttachPoints);
	let attachedPointsInput = select('#attached-points-input').value(clothAttachPoints);

	clothWidthSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			clothWidthInput.value(clothWidthSlider.value());
			clothWidth = clothWidthSlider.value();
		}
	});
	clothWidthInput.changed(function() {
		clothWidthSlider.value(clothWidthInput.value());
		clothWidth = clothWidthSlider.value();
	});

	attachedPointsSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			attachedPointsInput.value(attachedPointsSlider.value());
			clothAttachPoints = attachedPointsSlider.value();
		}
	});
	attachedPointsInput.changed(function() {
		attachedPointsSlider.value(attachedPointsInput.value());
		clothAttachPoints = attachedPointsSlider.value();
	});

	// Buttons
	let drawPointsBtn = select('#draw-points');
	if (!drawPoints) drawPointsBtn.addClass('inactive');
	drawPointsBtn.mousePressed(function() {
		drawPoints = !drawPoints;
		drawPointsBtn.toggleClass('inactive');
	});

	let showDebugBtn = select('#show-debug');
	if (!showDebugText) showDebugBtn.addClass('inactive');
	showDebugBtn.mousePressed(function() {
		showDebugText = !showDebugText;
		showDebugBtn.toggleClass('inactive');
	});

	let pauseBtn = select('#pause');
	pauseBtn.mousePressed(function() {
		if (isPaused)
			loop();
		else
			noLoop();
		isPaused = !isPaused;
	});

	let resetBtn = select('#reset');
	resetBtn.mousePressed(function() {
		init();
		if (isPaused) {
			redraw();
		}
	});

	let canTearBtn = select('#can-tear');
	if (!canTear) canTearBtn.addClass('inactive');
	canTearBtn.mousePressed(function() {
		canTear = !canTear;
		canTearBtn.toggleClass('inactive');
	});
}