$(document).ready(function () {
    var i;
//    CLOUD
    for (i = 0; i < CLOUD_INIT; i++) {
        Component.Cloud.init(true);
    }

    function createCloud() {
        if (isRunning)
            Component.Cloud.init();
        setTimeout(createCloud, CLOUD_TIME_CREATED);
    }

    setTimeout(createCloud, CLOUD_TIME_CREATED);

//    BIRD
    for (i = 0; i < BIRD_INIT; i++) {
        Component.Bird.init();
    }

    function createBird() {
        if (isRunning)
            Component.Bird.init();
        setTimeout(createBird, BIRD_TIME_CREATED);
    }

    setTimeout(createBird, BIRD_TIME_CREATED);

//    STAR
    for (i = 0; i < STAR_INIT; i++) {
        Component.Star.init();
    }

    function createStar() {
        if (isRunning)
            Component.Star.init();
        setTimeout(createStar, STAR_TIME_CREATED);
    }

    setTimeout(createStar, STAR_TIME_CREATED);

//    PARACHUTE
    for (i = 0; i < PARACHUTE_INIT; i++) {
        Component.Parachute.init();
    }

    function createParachute() {
        if (isRunning)
            Component.Parachute.init();
        setTimeout(createParachute, PARACHUTE_TIME_CREATED);
    }

    setTimeout(createParachute, PARACHUTE_TIME_CREATED);

//    AIRPLANE
    Component.Airplane.init();

    function airplaneControl() {
        if (isRunning)
            Component.Airplane.control();
        setTimeout(airplaneControl, AIRPLANE_LOCATION_REFRESH);
    }
    airplaneControl();

//    TIMER
    Component.Timer.init();

//    STAR COUNTER
    Component.StarCounter.init();

//    FUEL COUNTER
    Component.FuelCounter.init();

//    SOUND CONTROL
    Component.SoundControl.init();

//    PAUSE CONTROL
    Component.PauseControl.init();

//    SIZE CONTROL
    Component.SizeControl.init();
//    RUNNING
    Component.Running.init();
//    DIALOG
    Component.Dialog.init();
});