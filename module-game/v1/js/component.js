//Global variable
var fuelCounterCurrent = 0;
var starCounterCurrent = 0;
var timerCurrent = 0;
var paramObj = Helper.getHash();
var isRunning = true;
var isMute;

var gameAreaObj = $(GAME_AREA);
var leftOfGameArea = GAME_AREA_OFFSET.left;
var topOfGameArea = GAME_AREA_OFFSET.top;
var airplaneObj;
var backgroundSound;
var starSound;
var hitSound;
var finishSound;
var dialogFormObj;
var dialogRankingObj;
var sizeTimer; // Size sẽ được tăng thêm
var sizeFuel; 
var sizeStar;
var sizeRanking; 

if (typeof paramObj.isMute === 'undefined') isMute = false;
else isMute = eval(paramObj.isMute);

// Set size
if (typeof paramObj.sizeTimer === 'undefined') sizeTimer =  parseInt($('#timer').css('fontSize'));
else sizeTimer = parseInt(paramObj.sizeTimer);

if (typeof paramObj.sizeFuel === 'undefined') sizeFuel =  parseInt($('#fuel-counter').css('fontSize'));
else sizeFuel = parseInt(paramObj.sizeFuel);

if (typeof paramObj.sizeStar === 'undefined') sizeStar =  parseInt($('#star-counter').css('fontSize'));
else sizeStar = parseInt(paramObj.sizeStar);

if (typeof paramObj.sizeRanking === 'undefined') sizeRanking =  parseInt($('#list-rank').css('fontSize'));
else sizeRanking = parseInt(paramObj.sizeRanking);

/**
 * @desc Class Sound
 * @param {string} soundName Tên file âm thanh
 */
function Sound(soundName) {
    var elementSound;

    this.init = function () {
        this.elementSound = document.createElement('audio');
        this.elementSound.src = 'sounds/' + soundName + '.mp3';
        this.elementSound.setAttribute("controls", "none");
        this.elementSound.style.display = "none";
        return this.elementSound;
    };
    /**
     * @desc Tự động phát âm thanh
     */
    this.autoplay = function () {
        this.elementSound.autoplay = true;
    };
    /**
     * @desc Lặp âm thânh
     */
    this.loop = function () {
        this.elementSound.loop = true;
    };
    /**
     * @desc Phát âm thanh
     */
    this.play = function () {
        this.elementSound.play();
    };
    /**
     * @desc Dừng âm thanh
     */
    this.pause = function () {
        this.elementSound.pause();
    };
    /**
     * @desc Tắt tiếng âm thanh
     */
    this.mute = function (isMute) {
        this.elementSound.muted = isMute;
    }
}

/**
 * @desc Component in game
 */
var Component = {
    /**
     * @desc Cloud Component
     */
    cloud: {
        /**
         * @desc tạo một đám mây (thẻ span) ở vị trí ngẫu nhiên
         * @param {boolean} isCreate nếu không có giá trị là tạo mây ở vị trí ngẫu nhiên, true: tạo sát mây ở sát lề phải
         * @return {HTMLElement} đối tượng HTML chứa đám mây
         */
        init: function (isCreate) {
            this.elementCloud = document.createElement('span');
            var cloudObj = $(this.elementCloud);

            var top = Helper.randomPosition().top;
            var left = Helper.randomPosition().left;
            if (typeof isCreate === 'undefined') isCreate = false;
            if (isCreate) // Nếu isCreate = true; thì cloud sẽ nằm sát lề phải
                left = GAME_AREA_WIDTH;
            var imageIndex = Helper.randomNumber(CLOUD_QUANTITY);

            // Đám mây không sinh ra bên ngoài vùng GAME AREA
            if (top >= CLOUD_HEIGHT)
                top -= CLOUD_HEIGHT;

            cloudObj.addClass('elm-cloud')
                .css({
                    background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                    backgroundSize: 'cover',
                    top: top + 'px',
                    left: left + 'px'
                })
                .appendTo(gameAreaObj);

            /**
             * @desc di chuyển vị trí đám mây theo hướng từ phải sang trái với tốc độ di chuyển SPEED_CLOUD
             */
            function run() {
                if (isRunning) {
                    var currentLeft = cloudObj.offset().left;

                    // Nếu đám mây đi ra khỏi vùng GAME AREA thì xóa đi và dừng di chuyển
                    if (currentLeft <= leftOfGameArea - CLOUD_WIDTH) {
                        cloudObj.remove();
                        delete cloudObj;
                        return;
                    }
                    // Giảm left của đám mây theo tốc độ quy định trước
                    cloudObj.offset({
                        left: currentLeft - CLOUD_SPEED
                    });
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },

    /**
     * @desc Bird Component
     */
    bird: {
        /**
         * @desc Tạo một con chim. Nếu direction là left thì xuất phát từ bên trái và ngược lại
         */
        init: function () {
            this.elementBird = document.createElement('span');
            var birdObj = $(this.elementBird);

            var left = -BIRD_WIDTH;
            var top = Helper.randomPosition().top;

            var imageIndex = Helper.randomNumber(BIRD_QUANTITY);
            var directionNum = Helper.randomNumber(2); // 1: left, 2: right
            var direction = 'left';

            if (directionNum === 2) direction = 'right';

            if (direction === 'right') left = GAME_AREA_WIDTH;

            // Chim không sinh ra ngoài vùng GAME AREA
            if (top >= BIRD_HEIGHT)
                top -= BIRD_HEIGHT;

            birdObj.addClass('elm-bird')
                .css({
                    width: BIRD_WIDTH + 'px',
                    height: BIRD_HEIGHT + 'px',
                    background: 'url(images/bird/bird-' + imageIndex + '.gif)',
                    backgroundSize: 'cover',
                    left: left + 'px',
                    top: top + 'px'
                })
                .appendTo(gameAreaObj);

            if (direction === 'right') birdObj.addClass('flip-x');

            /**
             * @desc di chuyển vị trí con chim theo hướng direction random với tốc độ di chuyển SPEED_BIRD
             */
            function run() {
                if (isRunning) {

                    if (Helper.isCollision(airplaneObj, birdObj)) {
                        if (!isMute) {
                            hitSound.play();
                            backgroundSound.pause();
                            finishSound.play();
                            finishSound.loop();
                        }

                        isRunning = false;
                        dialogFormObj.dialog("open");
                    }

                    var currentLeft = birdObj.offset().left;

                    // Nếu vị trí hiện tại của con chim <= kích thước của con chim hoặc >= kích thước của GAME AREA thì xóa con chim đó và dừng
                    if ((currentLeft <= leftOfGameArea - BIRD_WIDTH && direction === 'right') || (currentLeft >= leftOfGameArea + GAME_AREA_WIDTH && direction === 'left')) {
                        birdObj.remove();
                        delete birdObj;
                        return;
                    }

                    // Di chuyển vị trí của con chim theo tốc độ quy định trước
                    if (direction === 'right')
                        birdObj.offset({
                            left: currentLeft - BIRD_SPEED
                        });
                    else
                        birdObj.offset({
                            left: currentLeft + BIRD_SPEED
                        });
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
        }
    },

    /**
     * @desc Parachute Component
     */
    parachute: {
        init: function () {
            this.elementParachute = document.createElement('span');
            var parachuteObj = $(this.elementParachute);
            var left = Helper.randomPosition().left;
            var top = -PARACHUTE_HEIGHT;

            // Bình xăng không sinh ra ngoài vùng GAME AREA
            if (left > PARACHUTE_WIDTH)
                left -= PARACHUTE_WIDTH;

            parachuteObj.addClass('elm-parachute')
                .css({
                    width: PARACHUTE_WIDTH + 'px',
                    height: PARACHUTE_HEIGHT + 'px',
                    left: left + 'px',
                    top: top + 'px'
                })
                .appendTo(gameAreaObj);

            /**
             * @desc di chuyển vị trí bình xăng theo hướng từ từ trên xuống với tốc độ di chuyển SPEED_PARACHUTE
             */
            function run() {
                if (isRunning) {
                    // Xử lý chạm bình xăng
                    if (Helper.isCollision(airplaneObj, parachuteObj)) {
                        parachuteObj.remove();
                        fuelCounterCurrent += 10;
                    }

                    var currentTop = parachuteObj.offset().top;

                    if (currentTop >= GAME_AREA_HEIGHT + topOfGameArea) {
                        parachuteObj.remove();
                        delete parachuteObj;
                        return;
                    }

                    parachuteObj.offset({
                        top: currentTop + PARACHUTE_SPEED
                    });
                }
                setTimeout(run, 1000 / FPS);
            }

            setTimeout(run, PARACHUTE_DELAY * 1000);
        }
    },

    /**
     * @desc Star Component
     */
    star: {
        init: function () {
            this.elementStar = document.createElement('span');
            var starObj = $(this.elementStar);
            var left = Helper.randomPosition().left;
            var top = -STAR_HEIGHT;

            // Bình xăng không sinh ra ngoài vùng GAME AREA
            if (left > STAR_WIDTH)
                left -= STAR_WIDTH;

            $(this.elementStar).addClass('elm-star')
                .css({
                    width: STAR_WIDTH + 'px',
                    height: STAR_HEIGHT + 'px',
                    left: left + 'px',
                    top: top + 'px'
                })
                .appendTo(gameAreaObj);

            /**
             * @desc di chuyển vị trí ngôi sao theo hướng từ từ trên xuống với tốc độ di chuyển SPEED_STAR
             */
            function run() {
                if (isRunning) {
                    // Xử lý chạm bình xăng
                    if (Helper.isCollision(airplaneObj, starObj)) {
                        starObj.remove();
                        if (!isMute)
                            starSound.play();
                        starCounterCurrent += 1;
                    }

                    var currentTop = starObj.offset().top;

                    if (currentTop >= GAME_AREA_HEIGHT + topOfGameArea) {
                        starObj.remove();
                        delete starObj;
                        return;
                    }

                    starObj.offset({
                        top: currentTop + STAR_SPEED
                    });
                }
                setTimeout(run, 1000 / FPS);
            }

            setTimeout(run, STAR_DELAY * 1000);
        }
    },

    /**
     * @desc Airplane Component
     */
    airplane: {
        keyState: {},
        init: function () {
            this.elementAirplane = document.createElement('span');
            airplaneObj = $(this.elementAirplane);
            var left = 100;
            var top = 300;
            airplaneObj.addClass('elm-airplane')
                .css({
                    width: AIRPLANE_WIDTH + 'px',
                    height: AIRPLANE_HEIGHT + 'px',
                    left: left + 'px',
                    top: top + 'px'
                })
                .appendTo(gameAreaObj);
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
         * @desc Di chuyển theo chiều ngang
         * @param {number} distance Khoảng cách cần di chuyển
         */
        goX: function (distance) {
            var airplaneObj = $(this.elementAirplane);
            var currentLeft = airplaneObj.offset().left;

            // console.log(leftOfGameArea + " - " + currentLeft);

            var leftGoal = currentLeft + distance;

            if (leftGoal < leftOfGameArea)
                leftGoal = leftOfGameArea;
            else if (leftGoal > (GAME_AREA_WIDTH + leftOfGameArea - AIRPLANE_WIDTH))
                leftGoal = GAME_AREA_WIDTH + leftOfGameArea - AIRPLANE_WIDTH;

            // if (leftGoal < 0)
            //     leftGoal = 0;
            // else if (leftGoal > $(GAME_AREA).outerWidth())
            //     leftGoal = $(GAME_AREA).outerWidth() - AIRPLANE_WIDTH;

            airplaneObj.offset({
                left: leftGoal
            });
        },
        /**
         * @desc Di chuyển theo chiều dọc
         * @param {number} distance Khoảng cách cần di chuyển
         */
        goY: function (distance) {
            var airplaneObj = $(this.elementAirplane);
            var currentTop = airplaneObj.offset().top;
            var topOfGameArea = GAME_AREA_OFFSET.top;

            var topGoal = currentTop + distance;
            if (topGoal < topOfGameArea)
                topGoal = topOfGameArea;
            else if (currentTop + distance > (GAME_AREA_HEIGHT + topOfGameArea - AIRPLANE_HEIGHT))
                topGoal = GAME_AREA_HEIGHT + topOfGameArea - AIRPLANE_HEIGHT;

            // if (currentTop + distance < 0)
            //     topGoal = 0;
            // else if (currentTop + distance > $(GAME_AREA).outerHeight())
            //     topGoal = $(GAME_AREA).outerHeight() - AIRPLANE_HEIGHT;

            airplaneObj.offset({
                top: topGoal
            });
        },
        /**
         * @desc Xử lý di chuyển theo key control
         */
        control: function () {
            if (this.keyState[37]) this.goX(-AIRPLANE_SPEED);
            if (this.keyState[38]) this.goY(-AIRPLANE_SPEED);
            if (this.keyState[39]) this.goX(AIRPLANE_SPEED);
            if (this.keyState[40]) this.goY(AIRPLANE_SPEED);
        }
    },

    /**
     * @desc Fuel Counter Component
     */
    fuelCounter: {
        init: function () {
            fuelCounterCurrent = FUEL_COUNTER_INIT;
            $(FUEL_COUNTER).text(fuelCounterCurrent);

            /**
             * @desc Cập nhật fuel counter sau 1s
             */
            function update() {
                if (fuelCounterCurrent > 0 && isRunning) {
                    Helper.changeFuelValue(-FUEL_COUNTER_REDUCE);
                    $(FUEL_COUNTER).text(fuelCounterCurrent);
                    // if (fuelCounterCurrent === 0) {
                    //     // Chờ 1 xíu để hiển thị fuel counter
                    //     setTimeout(function () {
                    //         // Xử lý khi hết fuel
                    //         console.log('Hết Fuel');
                    //         isRunning = false;
                    //         backgroundSound.pause();
                    //         finishSound.play();
                    //         finishSound.loop();
                    //         dialogFormObj.dialog("open");
                    //     }, 50)

                    // }
                }
                setTimeout(update, FUEL_COUNTER_TIME_CHANGED * 1000);
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

    /**
     * @desc Star Counter Component
     */
    starCounter: {
        init: function () {
            $(STAR_COUNTER).text(starCounterCurrent);

            function update() {
                $(STAR_COUNTER).text(starCounterCurrent);
                setTimeout(update, 1000 / FPS);
            }

            update();
        }
    },

    /**
     * @desc Timer Component
     */
    timer: {
        init: function () {
            $(TIMER).text(Helper.timeFormat(timerCurrent));

            // Run timer
            function run() {
                if (isRunning) {
                    timerCurrent++;
                    $(TIMER).text(Helper.timeFormat(timerCurrent));
                }
                setTimeout(run, 1000);
            }

            setTimeout(run, 1000);
        }
    },

    /**
     * @desc Sound Control Component
     */
    soundControl: {
        init: function () {
            // Background
            backgroundSound = new Sound('background');
            gameAreaObj.append(backgroundSound.init());
            backgroundSound.autoplay();
            backgroundSound.loop();
            // Star
            starSound = new Sound('star');
            gameAreaObj.append(starSound.init());
            // Hit
            hitSound = new Sound('hit');
            gameAreaObj.append(hitSound.init());
            // Finish
            finishSound = new Sound('finish');
            gameAreaObj.append(finishSound.init());

            if (isMute) {
                $(BTN_VOLUME + ' #btn-volume-text').text("Unmute");
                backgroundSound.mute(isMute);
            }

          
            $(BTN_VOLUME).click(function () {

                if (isMute) {
                    isMute = false;
                    mute(isMute);
                    // checkVolumeButtonClick = isMute;
                } else {
                    isMute = true;
                    mute(isMute);
                    // checkVolumeButtonClick = isMute;
                }

                // Change text
                var text = $(BTN_VOLUME + ' #btn-volume-text').text().trim();
                $(BTN_VOLUME + ' #btn-volume-text').text(
                    text === "Mute" ? "Unmute" : "Mute");

                // Khi tạm dừng thì âm thanh tắt
                if (!isRunning) {
                    mute(true);
                }
                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMute);

            });

            /**
             * @desc Tắt/Mở toàn bộ âm thanh có trong game
             * @param {boolean} isMute
             */
            function mute(isMute) {
                backgroundSound.mute(isMute);
                starSound.mute(isMute);
                hitSound.mute(isMute);
                finishSound.mute(isMute);
            }
        }
    },

    /**
     * @desc Pause/Resume Control Component
     */
    pauseControl: {
        init: function () {
            // Pause by click button
            $(BTN_PAUSE).click(function () {
                isRunning = !isRunning;
                // Gọi tới button volume để tắt/mở tiếng
                if(!isRunning) $(BTN_VOLUME).attr('disabled', true);
                else $(BTN_VOLUME).removeAttr('disabled');
                $(BTN_VOLUME).click();
                // Change text
                var text = $(BTN_PAUSE + " #btn-pause-text").text().trim();
                $(BTN_PAUSE + " #btn-pause-text").text(text === "Pause" ? "Continue" : "Pause");
            });

            // Pause by space bar
            $(window).keydown(function (e) {
                if (e.keyCode === 32) $(BTN_PAUSE).click();
            })
        }
    },

    /**
     * @desc Change Font Size Control Component
     */
    sizeControl: {
        init: function () {
            // Set size khi mới load lần đầu
            Helper.setSize(sizeTimer, sizeStar, sizeFuel, sizeRanking);

            $(BTN_SIZE_UP).click(function () {
                sizeTimer++;
                sizeStar++;
                sizeFuel++;
                sizeRanking++;
                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMute);
                Helper.setSize(sizeTimer, sizeStar, sizeFuel, sizeRanking);
            });

            $(BTN_SIZE_DOWN).click(function () {
                if(--sizeTimer < 0) sizeTimer = 0;
                if(--sizeStar < 0) sizeStar = 0;
                if(--sizeFuel < 0) sizeFuel = 0;
                if(--sizeRanking < 0) sizeRanking = 0;

                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMute);
                Helper.setSize(sizeTimer, sizeStar, sizeFuel, sizeRanking);
                
            });
        }
    },

    /**
     * @desc Dialog Finish Game And Ranking
     */
    dialog: {
        init: function () {

            // Dialog is displayed when game finish
            dialogFormObj = $("#dialog-form").dialog({
                autoOpen: false,
                height: 155,
                width: 350,
                modal: true,
                closeOnEscape: false,
                show: {
                    effect: "blind",
                    duration: 800
                },
                open: function () {
                    $(".ui-dialog-titlebar-close").hide();
                    validateInput();
                    // 
                    $('#btnContinue').click(function () {
                        var name = $('#name').val();
                        $.ajax({
                            url: 'register.php',
                            type: 'POST',
                            data: {
                                name: name,
                                time: timerCurrent,
                                stars: starCounterCurrent
                            },
                            dataType: 'json'
                        }).done(function (data) {
                            
                            dialogFormObj.dialog("close");

                            var dataSort = Helper.sortRanking(data);
                            showData(dataSort);

                            dialogRankingObj.dialog("open");
                        })

                    })
                }
            });

            // dialog show ranking
            dialogRankingObj = $("#dialog-ranking").dialog({
                autoOpen: false,
                height: 440,
                width: 400,
                modal: true,
                closeOnEscape: false,
                show: {
                    effect: "blind",
                    duration: 800
                },
                open: function () {
                    $(".ui-dialog-titlebar-close").hide();

                    $('#btnStartGame').click(function () {
                        window.location.reload();
                    });
                }
            });

            // validate name
            function validateInput() {
                $('#name').keyup(function () {
                    if ($(this).val().trim().length > 0) {
                        $('#btnContinue').removeAttr('disabled');
                    } else $('#btnContinue').attr('disabled', true);
                });
            }

            // show data in ranking list
            function showData(data) {
                var str = '<table>\n' +
                    '         <tr>\n' +
                    '             <th>#</th>\n' +
                    '             <th>Name</th>\n' +
                    '             <th>Start</th>\n' +
                    '             <th>Time</th>\n' +
                    '         </tr>\n';
                $.each(data, function (i, val) {
                    str += '         <tr class="border-bottom">\n' +
                        '             <td class="text-center">' + (i + 1) + '</td>\n' +
                        '             <td>' + val.name + '</td>\n' +
                        '             <td class="text-center">' + val.stars + '</td>\n' +
                        '             <td class="text-center">' + Helper.timeFormat(val.time) + '</td>\n' +
                        '         </tr>\n';
                });

                str += ' </table>';

                // append html
                $('#list-rank').html(str);
            }
        }
    }

};