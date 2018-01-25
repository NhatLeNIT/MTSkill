// Main Program - Start Game
$(document).ready(function () {

    // ======== AIRPLANE
    Component.airplane.init();
    
        function airplaneControl() {
            if (isRunning)
            Component.airplane.control();
            setTimeout(airplaneControl, AIRPLANE_LOCATION_REFRESH);
        }
        airplaneControl();
    // ========= CLOUD
    for (var i = 0; i < CLOUD_INIT; i++)
        Component.cloud.init();

        function createCloud() {
            if (isRunning)
            Component.cloud.init(true);
            setTimeout(createCloud, CLOUD_TIME_CREATED * 1000);
        }
        setTimeout(createCloud, CLOUD_TIME_CREATED * 1000);

    // ========= BIRD
    for (var i = 0; i < BIRD_INIT; i++)
        Component.bird.init();

    // Tạo một con chim sau một khoảng thời gian quy định trước
    function createBird() {
        if (isRunning)
        Component.bird.init();
        setTimeout(createBird, BIRD_TIME_CREATED * 1000);
    }
    setTimeout(createBird, BIRD_TIME_CREATED * 1000);

    // ========= PARACHUTE
    for (var i = 0; i < PARACHUTE_INIT; i++)
        Component.parachute.init();
    // Tạo một bình xăng sau một khoảng thời gian quy định trước
    function createParachute() {
        if (isRunning)
        Component.parachute.init();
        setTimeout(createParachute, PARACHUTE_TIME_CREATED * 1000);
    }
    setTimeout(createParachute, PARACHUTE_TIME_CREATED * 1000);

    // ========= STAR
    for (var i = 0; i < STAR_INIT; i++)
        Component.star.init();
    // Tạo một ngôi sao sau một khoảng thời gian quy định trước
    function createStar() {
        if (isRunning)
        Component.star.init();
        setTimeout(createStar, STAR_TIME_CREATED * 1000);
    }
    setTimeout(createStar, STAR_TIME_CREATED * 1000);

    

    // FUEL COUNTER
    Component.fuelCounter.init();

    // STAR
    Component.starCounter.init();
    // TIMER
    Component.timer.init();

    // SOUND
    Component.soundControl.init();

    // PAUSE/RESUME
    Component.pauseControl.init();

    //FONT SIZE BUTTON
    Component.sizeControl.init();


    Component.dialog.init();
});