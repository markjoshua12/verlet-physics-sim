
function initSettingsUI() {

	let settingsCont = select('.settings-container');
	settingsCont.mouseOver(function() {
		mouseInsideSketch = false;
	});
	settingsCont.mouseOut(function() {
		mouseInsideSketch = true;
	});

	// Sliders and input
	// Gravity
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

	// Cloth Width
	let clothWidthSlider = select('#cloth-width-range').value(clothWidth);
	let clothWidthInput = select('#cloth-width-input').value(clothWidth);

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

	// Cloth Height
	let clothHeightSlider = select('#cloth-height-range').value(clothHeight);
	let clothHeightInput = select('#cloth-height-input').value(clothHeight);

	clothHeightSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			clothHeightInput.value(clothHeightSlider.value());
			clothHeight = clothHeightSlider.value();
		}
	});
	clothHeightInput.changed(function() {
		clothHeightSlider.value(clothHeightInput.value());
		clothHeight = clothHeightSlider.value();
	});

	// Cloth Height
	let clothSpacingSlider = select('#cloth-spacing-range').value(clothSpacing);
	let clothSpacingInput = select('#cloth-spacing-input').value(clothSpacing);

	clothSpacingSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			clothSpacingInput.value(clothSpacingSlider.value());
			clothSpacing = clothSpacingSlider.value();
		}
	});
	clothSpacingInput.changed(function() {
		clothSpacingSlider.value(clothSpacingInput.value());
		clothSpacing = clothSpacingSlider.value();
	});

	// Attached points
	let attachedPointsSlider = select('#attached-points-range').value(clothAttachPoints);
	let attachedPointsInput = select('#attached-points-input').value(clothAttachPoints);

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

	// Constraint Length
	let constLengthSlider = select('#constraint-length-range').value(clothConstraintLength);
	let constLengthInput = select('#constraint-length-input').value(clothConstraintLength);

	constLengthSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			constLengthInput.value(constLengthSlider.value());
			clothConstraintLength = constLengthSlider.value();
		}
	});
	constLengthInput.changed(function() {
		constLengthSlider.value(constLengthInput.value());
		clothConstraintLength = constLengthSlider.value();
	});

	// Tear Strength
	let tearStrSlider = select('#tear-str-range').value(tearStr);
	let tearStrInput = select('#tear-str-input').value(tearStr);

	tearStrSlider.mouseMoved(function() {
		if (mouseIsPressed) {
			tearStrInput.value(tearStrSlider.value());
			tearStr = tearStrSlider.value();
			tearStrSq = tearStr * tearStr;
		}
	});
	tearStrInput.changed(function() {
		tearStrSlider.value(tearStrInput.value());
		tearStr = tearStrSlider.value();
		tearStrSq = tearStr * tearStr;
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

	let containerHider = select('#container-hider');
	select('.inside').toggleClass('hidden');
	containerHider.toggleClass('active');
	containerHider.mousePressed(function() {
		select('.inside').toggleClass('hidden');
		containerHider.toggleClass('active');

		if (containerHider.hasClass('active'))
			containerHider.html('Show Controls');
		else
			containerHider.html('Hide');
	});

	let toolTypeButtons = selectAll('.tool-type-btn');
	toolTypeButtons.forEach(function(e, i) {
		if (i != toolType)
			e.addClass('inactive');
	});

	let toolTypeDrag = toolTypeButtons[0];
	toolTypeDrag.mousePressed(function() {
		toolTypeButtons[toolType].addClass('inactive');
		toolTypeDrag.removeClass('inactive');
		toolType = TTYPE_DRAG;
	});

	let toolTypeTriangle = toolTypeButtons[1];
	toolTypeTriangle.mousePressed(function() {
		toolTypeButtons[toolType].addClass('inactive');
		toolTypeTriangle.removeClass('inactive');
		toolType = TTYPE_TRIANGLE;
	});

	let toolTypeSquare = toolTypeButtons[2];
	toolTypeSquare.mousePressed(function() {
		toolTypeButtons[toolType].addClass('inactive');
		toolTypeSquare.removeClass('inactive');
		toolType = TTYPE_SQUARE;
	});
}