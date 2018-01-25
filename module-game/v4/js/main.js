
// INIT
for (var i = 0; i < CLOUD_INIT; i++)
    Component.Cloud.init(true);
for (i = 0; i < BIRD_INIT; i++)
    Component.Bird.init();
for (i = 0; i < STAR_INIT; i++)
    Component.Star.init();
for (i = 0; i < PARACHUTE_INIT; i++)
    Component.Parachute.init();
Component.Airplane.init();
Component.Timer.init();
Component.FuelCounter.init();
Component.StarCounter.init();
Component.SoundControl.init();
Component.PauseControl.init();
Component.SizeControl.init();
Component.Dialog.init();

// CREATE
function createCloud() {
    if (isRunning)
        Component.Cloud.init();
    setTimeout(createCloud, CLOUD_TIME_CREATED);
}

function createBird() {
    if (isRunning)
        Component.Bird.init();
    setTimeout(createBird, BIRD_TIME_CREATED);
}

function createStar() {
    if (isRunning)
        Component.Star.init();
    setTimeout(createStar, STAR_TIME_CREATED);
}

function createParachute() {
    if (isRunning)
        Component.Parachute.init();
    setTimeout(createParachute, PARACHUTE_TIME_CREATED);
}

setTimeout(createCloud, CLOUD_TIME_CREATED);
setTimeout(createBird, BIRD_TIME_CREATED);
setTimeout(createStar, STAR_TIME_CREATED);
setTimeout(createParachute, PARACHUTE_TIME_CREATED);

// CONTROL
function airplaneControl() {
    if (isRunning)
    Component.Airplane.control();
    setTimeout(airplaneControl, AIRPLANE_LOCATION_REFRESH);
}

airplaneControl();

// RUNNING
Component.Running.init();