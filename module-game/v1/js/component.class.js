//Global
var fuelCounterCurrent = 0;
var starCounterCurrent = 0;
var timerCurrent = 0;
var isMute = false;
var isRunning = true;
/**
 * @desc Class quản lý các component trong game
 */
var Component = {
    // Cloud
    cloud: {
        init: function (isCreate) {
            var imageIndex = Helper.randomNumber(CLOUD_QUANTITY);
            var cloudObj = new Cloud(imageIndex);
            $(GAME_AREA).append(cloudObj.init(isCreate));
            // Đám mây chạy
            function run() {
                cloudObj.run();
                setTimeout(run, 1000 / FPS);
            }
            run();
        }
    },
    // Bird
    bird: {
        init: function () {
            var imageIndex = Helper.randomNumber(BIRD_QUANTITY);
            var directionNum = Helper.randomNumber(2); // 1: left, 2: right
            var direction = 'left';
            if (directionNum === 2) direction = 'right';

            var birdObj = new Bird(imageIndex, direction);
            $(GAME_AREA).append(birdObj.init());

            // Chim bay
            function run() {
                birdObj.run();
                setTimeout(run, 1000 / FPS);
            }
            run();
        }
    },
    // Parachute
    parachute: {
        init: function () {
            var parachuteObj = new Parachute();
            $(GAME_AREA).append(parachuteObj.init());
            // Bình xăng rơi từ trên xuống
            function run() {
                parachuteObj.run();
                setTimeout(run, 1000 / FPS);
            }
            setTimeout(run, PARACHUTE_DELAY * 1000);
        }
    },
    // Star
    star: {
        init: function () {
            var starObj = new Star();
            $(GAME_AREA).append(starObj.init());
            // Ngôi sao rơi từ trên xuống
            function run() {
                starObj.run();
                setTimeout(run, 1000 / FPS);
            }
            setTimeout(run, STAR_DELAY * 1000);
        }
    },
    // Airplane
    airplane: {
        airplane: new Airplane(),
        keyState: {}, // Đối tượng chứa trạng thái của các key
        init: function () {
            $(GAME_AREA).append(this.airplane.init());

            var keyState = this.keyState;
            // Bắt sự kiện khi nhấn phím cập nhật keyState
            $(window).keydown(function (e) {
                keyState[e.keyCode] = true;
            });

            $(window).keyup(function (e) {
                keyState[e.keyCode] = false;
            });
        },
        /**
         * @desc Xử lý di chuyển theo key control
         */
        control: function () {
            if (this.keyState[37]) this.airplane.goX(-AIRPLANE_SPEED);
            if (this.keyState[38]) this.airplane.goY(-AIRPLANE_SPEED);
            if (this.keyState[39]) this.airplane.goX(AIRPLANE_SPEED);
            if (this.keyState[40]) this.airplane.goY(AIRPLANE_SPEED);
        }
    },
    // Fuel Counter
    fuelCounter: {
        init: function () {
            fuelCounterCurrent = FUEL_COUNTER_INIT;
            $(FUEL_COUNTER).text(fuelCounterCurrent);
            /**
             * @desc Cập nhật fuel counter sau 1s
             */
            function update() {
                if (fuelCounterCurrent > 0) {
                    Helper.changeFuelValue(-FUEL_COUNTER_REDUCE);
                    $(FUEL_COUNTER).text(fuelCounterCurrent);
                    if (fuelCounterCurrent == 0) {
                        // Chờ 1 xíu để hiển thị fuel counter
                        setTimeout(function () {
                            // Xử lý khi hết fuel
                            console.log('Hết Fuel');

                        }, 50)

                    }
                    setTimeout(update, FUEL_COUNTER_TIME_CHANGED * 1000);
                }
                //  else {
                //     // Xử lý khi hết fuel
                //     alert('Hết Fuel');
                // }
            }
            setTimeout(update, FUEL_COUNTER_TIME_CHANGED * 1000);
        },

        /**
         * @desc Thay đổi giá trị khi nhặt được parachute
         */
        change: function (value) {
            Helper.changeFuelValue(value);
        }
    },
    // Star Counter
    starCounter: {
        init: function () {
            $(STAR_COUNTER).text(starCounterCurrent);
        },
        change: function () {
            starCounterCurrent++;
            $(STAR_COUNTER).text(starCounterCurrent);
        }
    },
    // Timer
    timer: {
        init: function () {
            $(TIMER).text(Helper.timeFormat(timerCurrent));
            // Run timer
            function run() {
                timerCurrent++;
                $(TIMER).text(Helper.timeFormat(timerCurrent));
                setTimeout(run, 1000);
            }
            setTimeout(run, 1000);
        }
    },
    // Sound
    sound: {
        init: function () {
            // Background
            var backgroundSound = new Sound('background');
            $(GAME_AREA).append(backgroundSound.init());
            backgroundSound.autoplay();
            backgroundSound.loop();
            // Star
            var starSound = new Sound('star');
            $(GAME_AREA).append(starSound.init());
            // Hit
            var hitSound = new Sound('hit');
            $(GAME_AREA).append(hitSound.init());
            // Finish
            var finishSound = new Sound('finish');
            $(GAME_AREA).append(finishSound.init());

            $(BTN_VOLUME).click(function () {
                if (isMute) {
                    mute(false);
                    isMute = false;
                    $(BTN_VOLUME).attr('title', 'Volume off');
                    
                    
                } else {
                    mute(true);
                    isMute = true;
                    $(BTN_VOLUME).attr('title', 'Volume on');
                }

                $(BTN_VOLUME + ' #btn-volume-state').toggleClass('btn-volume-on').toggleClass('btn-volume-off');
            });

            function mute(isMute) {
                backgroundSound.mute(isMute);
                starSound.mute(isMute);
                hitSound.mute(isMute);
                finishSound.mute(isMute);
            }
        }
    },
    // Size
    size: {
        init: function () {
            $(BTN_SIZE_UP).click(function () {
                var selector = GAME_WRAPPER + ' *';
                $(selector).each(function () {
                    var sizeCurrent = parseInt($(this).css('fontSize'));
                    sizeCurrent++;
                    $(this).css('fontSize', sizeCurrent)
                });
            });
            $(BTN_SIZE_DOWN).click(function () {
                var selector = GAME_WRAPPER + ' *';
                $(selector).each(function () {
                    var sizeCurrent = parseInt($(this).css('fontSize'));
                    sizeCurrent--;
                    $(this).css('fontSize', sizeCurrent)
                });
            });
        }
    },
    // Play
    play: {
        init() {
            $(BTN_PAUSE).click(function() {
                isRunning = !isRunning;
            });
        }
    }
}