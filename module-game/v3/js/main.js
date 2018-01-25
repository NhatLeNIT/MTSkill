$(document).ready(function () {
    //    CLOUD
    for (var i = 0; i < CLOUD_INIT; i++) {
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

    // AIRPLANE
    Component.Airplane.init();

    function airplaneControl() {
        if (isRunning)
            Component.Airplane.control();
        setTimeout(airplaneControl, AIRPLANE_LOCATION_REFRESH);
    }
    airplaneControl();

    // RUNNING
    Component.Running.init();

    // COUNTER
    Component.Timer.init();
    Component.StarCounter.init();
    Component.FuelCounter.init();

    // OPTION
    Component.SoundControl.init();
    Component.PauseControl.init();
    Component.SizeControl.init();
    // DIALOG
    Component.Dialog.init();
});