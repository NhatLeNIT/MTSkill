$(document).ready(function () {
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
    Component.StarCounter.init();
    Component.FuelCounter.init();
    Component.SoundControl.init();
    Component.PauseControl.init();
    Component.SizeControl.init();
    Component.Dialog.init();
    // Create
    function createCloud() {
        if(isRunning)
        Component.Cloud.init();
        setTimeout(createCloud, CLOUD_TIME_CREATE);
    }
    function createBird() {
        if(isRunning)
        Component.Bird.init();
        setTimeout(createBird, BIRD_TIME_CREATE);
    }
    function createStar() {
        if(isRunning)
        Component.Star.init();
        setTimeout(createStar, STAR_TIME_CREATE);
    }
    function createParachute() {
        if(isRunning)
        Component.Parachute.init();
        setTimeout(createParachute, PARACHUTE_TIME_CREATE);
    }
    function controlAirplane() {
        if(isRunning)
        Component.Airplane.control();
        setTimeout(controlAirplane, AIRPLANE_LOCATION_REFRESH);
    }
    setTimeout(createCloud, CLOUD_TIME_CREATE);
    setTimeout(createBird, BIRD_TIME_CREATE);
    setTimeout(createStar, STAR_TIME_CREATE);
    setTimeout(createParachute, PARACHUTE_TIME_CREATE);
    controlAirplane();

    // Running
    Component.Running.init();

});