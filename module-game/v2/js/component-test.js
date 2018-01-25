var isRunning = true;
var isMuted = false;
var timeCurrent = 0;
var starCurrent = 0;
var fuelCurrent = 0;

var backgroundSound, hitSound, starSound, finishSound;

var Component = {
    Cloud: {
        init: function (isInit) {
            isInit = isInit ? isInit : false;
            var elm = document.createElement('span');
            var obj = $(elm);
            var left = GAME_AREA_WIDTH;
            var top = Helper.randomPosition().top;
            var imageIndex = Helper.randomNumber(CLOUD_QUANTITY);
            if (isInit) left = Helper.randomPosition().left;

            if (top >= CLOUD_HEIGHT)
                top -= CLOUD_HEIGHT;

            obj.addClass('elm-cloud').css({
                background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            }).appendTo(GAME_AREA);

            function run() {
                if (isRunning) {
                    var leftCurrent = obj.offset().left;
                    if (leftCurrent <= GAME_AREA_LEFT - CLOUD_WIDTH) {
                        obj.remove();
                        return;
                    }
                    obj.offset({left: leftCurrent - CLOUD_SPEED});
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },
    Bird: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            var left = GAME_AREA_WIDTH;
            var top = Helper.randomPosition().top;
            var imageIndex = Helper.randomNumber(BIRD_QUANTITY);
            if (top >= BIRD_HEIGHT)
                top -= BIRD_HEIGHT;

            obj.addClass('elm-bird').css({
                background: 'url(images/bird/bird-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            }).appendTo(GAME_AREA);

            function run() {
                if (isRunning) {
                    // Xử lý va chạm
                    // if (Helper.isCollision(AIRPLANE, obj)) {
                    //     if (!isMuted) {
                    //         hitSound.play();
                    //         backgroundSound.pause();
                    //         finishSound.play();
                    //         finishSound.loop();
                    //     }
                    //     isRunning = false;
                    // }
                    // Xử lý di chuyển
                    var leftCurrent = obj.offset().left;
                    if (leftCurrent <= GAME_AREA_LEFT - BIRD_WIDTH) {
                        obj.remove();
                        return;
                    }
                    obj.offset({left: leftCurrent - BIRD_SPEED}).css('animation-play-state', 'running');
                }
                else {
                    obj.css('animation-play-state', 'paused')
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },
    Star: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            var left = Helper.randomPosition().left;
            var top = -STAR_HEIGHT;
            if (left >= STAR_WIDTH)
                left -= STAR_WIDTH;

            obj.addClass('elm-star').css({
                left: left + 'px',
                top: top + 'px'
            }).appendTo(GAME_AREA);

            function run() {
                if (isRunning) {
                    // Xử lý va cham
                    if (Helper.isCollision(AIRPLANE, obj)) {
                        if (!isMuted) starSound.play();
                        obj.remove();
                        starCurrent++;
                        return;
                    }
                    // Xử lý di chuyển
                    var topCurrent = obj.offset().top;
                    if (topCurrent >= GAME_AREA_HEIGHT + GAME_AREA_TOP) {
                        obj.remove();
                        return;
                    }
                    obj.offset({top: topCurrent + STAR_SPEED}).css('animation-play-state', 'running');
                } else {
                    obj.css('animation-play-state', 'paused')
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },
    Parachute: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            var left = Helper.randomPosition().left;
            var top = -PARACHUTE_HEIGHT;
            if (left >= PARACHUTE_WIDTH)
                left -= PARACHUTE_WIDTH;

            obj.addClass('elm-parachute').css({
                left: left + 'px',
                top: top + 'px'
            }).appendTo(GAME_AREA);

            function run() {
                if (isRunning) {
                    // Xử lý va chạm
                    if (Helper.isCollision(AIRPLANE, obj)) {
                        obj.remove();
                        Helper.changeFuelValue(FUEL_ADD);
                        FUEL_COUNTER_NUMBER.text(Helper.fuelFormat(fuelCurrent));
                        return;
                    }
                    // Xử lý di chuyển
                    var topCurrent = obj.offset().top;
                    if (topCurrent >= GAME_AREA_HEIGHT + GAME_AREA_TOP) {
                        obj.remove();
                        return;
                    }
                    obj.offset({top: topCurrent + PARACHUTE_SPEED}).css('animation-play-state', 'running');
                } else {
                    obj.css('animation-play-state', 'paused');
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },
    Airplane: {
        keyState: {},
        init: function () {
            var keyState = this.keyState;
            $(window).keydown(function (e) {
                keyState[e.keyCode] = true;
            });
            $(window).keyup(function (e) {
                keyState[e.keyCode] = false;
            })
        },
        goX: function (distance) {
            var leftCurrent = AIRPLANE.offset().left;
            var left = leftCurrent + distance;

            if (left <= GAME_AREA_LEFT)
                left = GAME_AREA_LEFT;
            else if (left >= GAME_AREA_LEFT + GAME_AREA_WIDTH - AIRPLANE_WIDTH)
                left = GAME_AREA_LEFT + GAME_AREA_WIDTH - AIRPLANE_WIDTH;
            AIRPLANE.offset({left: left});
        },
        goY: function (distance) {
            var topCurrent = AIRPLANE.offset().top;
            var top = topCurrent + distance;

            if (top <= GAME_AREA_TOP)
                top = GAME_AREA_TOP;
            else if (top >= GAME_AREA_TOP + GAME_AREA_HEIGHT - AIRPLANE_HEIGHT)
                top = GAME_AREA_TOP + GAME_AREA_HEIGHT - AIRPLANE_HEIGHT;
            AIRPLANE.offset({top: top});
        },
        control: function () {
            if (this.keyState[37]) this.goX(-AIRPLANE_SPEED);
            if (this.keyState[38]) this.goY(-AIRPLANE_SPEED);
            if (this.keyState[39]) this.goX(AIRPLANE_SPEED);
            if (this.keyState[40]) this.goY(AIRPLANE_SPEED);
        }
    },
    Timer: {
        init: function () {
            function run() {
                if (isRunning) {
                    timeCurrent++;
                    TIMER.text(Helper.timeFormat(timeCurrent));
                }
                setTimeout(run, 1000);
            }

            run();
        }
    },
    StarCounter: {
        init: function () {
            function update() {
                STAR_COUNTER.text(starCurrent);
                setTimeout(update, 1000 / FPS);
            }

            update();
        }
    },
    FuelCounter: {
        init: function () {
            fuelCurrent = FUEL_COUNTER_INIT;
            FUEL_COUNTER_NUMBER.text(Helper.fuelFormat(fuelCurrent));
            Helper.changeFuelValue(0);

            function update() {
                if (fuelCurrent > 0 && isRunning) {
                    Helper.changeFuelValue(-FUEL_COUNTER_REDUCE);
                    FUEL_COUNTER_NUMBER.text(Helper.fuelFormat(fuelCurrent));
                }
                setTimeout(update, FUEL_COUNTER_TIME_CHANGED);
            }

            setTimeout(update, FUEL_COUNTER_TIME_CHANGED);
        }
    },
    SoundControl: {
        init: function () {
            // background
            backgroundSound = new Sound('background');
            backgroundSound.autoplay();
            backgroundSound.loop();
            // star
            starSound = new Sound('star');
            // hit
            hitSound = new Sound('hit');
            // finish
            finishSound = new Sound('finish');
            GAME_AREA.append(backgroundSound).append(starSound).append(hitSound).append(finishSound);

            BTN_MUTE.click(function () {
                isMuted = !isMuted;
                muteSound(isMuted);

                if(isRunning) {
                    muteSound(true);
                }
                // Change text
                var text = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                var strHtml = '<span class="wave"></span>' + text;
                BTN_MUTE.html(strHtml);
            });
            
            function muteSound(isMuted) {
               backgroundSound.mute(isMuted);
               hitSound.mute(isMuted);
               starSound.mute(isMuted);
               finishSound.mute(isMuted);
            }
        }
    },
    PauseControl: {
        init: function () {
            BTN_PAUSE.click(function () {
                isRunning = !isRunning;
                BTN_MUTE.click();

                if(!isRunning) BTN_MUTE.attr('disabled', true);
                else BTN_MUTE.removeAttr('disabled');
            })
        }
    }
};