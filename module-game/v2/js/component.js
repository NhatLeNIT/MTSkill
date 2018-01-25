var clouds = [];
var birds = [];
var stars = [];
var parachutes = [];
var param = Helper.getHash();

var isRunning = true;
var isMuted = param.isMuted ? eval(param.isMuted) : false;
var timeCurrent = 0;
var starCurrent = 0;
var fuelCurrent = 0;

var backgroundSound, hitSound, starSound, finishSound;
var sizeTimer, sizeStar, sizeFuel, sizeRanking;
var dialogForm, dialogRanking;
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
            clouds.push(obj);
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
            birds.push(obj);
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
            stars.push(obj);
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
            parachutes.push(obj);
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

            setTimeout(run, 1000);
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
                    //    Xử lý hết xăng
                    // if (fuelCurrent === 0) {
                    //     isRunning = false;
                    //     backgroundSound.pause();
                    //     finishSound.play();
                    //     finishSound.loop();
                    //     dialogForm.dialog('open');
                    // }
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
            // Lúc vừa vào game
            if(isMuted) {
                var strHtml = '<span class="wave"></span>' + 'Unmute';
                BTN_MUTE.html(strHtml);
                muteSound(isMuted);
            }
            BTN_MUTE.click(function () {
                isMuted = !isMuted;
                muteSound(isMuted);
                // Khi pause thì tắt tiếng
                if (!isRunning) {
                    muteSound(true);
                }
                // Change text
                var text = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                var strHtml = '<span class="wave"></span>' + text;
                BTN_MUTE.html(strHtml);
                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMuted);
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

                if (!isRunning) BTN_MUTE.attr('disabled', true);
                else BTN_MUTE.removeAttr('disabled');

                // Change text
                var text = BTN_PAUSE.text().trim() === 'Pause' ? 'Continue' : 'Pause';
                var strHtml = '<span class="wave"></span>' + text;
                BTN_PAUSE.html(strHtml);
            });
            // Pause by space bar
            $(window).keydown(function (e) {
                if (e.keyCode === 32) BTN_PAUSE.click();
            })
        }
    },
    SizeControl: {
        init: function () {
            sizeTimer = param.sizeTimer ? parseInt(param.sizeTimer) : parseInt(TIMER.css('fontSize'));
            sizeStar = param.sizeStar ? parseInt(param.sizeStar) : parseInt(STAR_COUNTER.css('fontSize'));
            sizeFuel = param.sizeFuel ? parseInt(param.sizeFuel) : parseInt(FUEL_COUNTER_NUMBER.css('fontSize'));
            sizeRanking = param.sizeRanking ? parseInt(param.sizeRanking ): parseInt($('#dialog-ranking').css('fontSize'));
            //set size on start game
            setSize();
            BTN_SIZE_UP.click(function () {
                changeSize(1);
                setSize();
                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMuted);
            });
            BTN_SIZE_DOWN.click(function () {
                changeSize(-1);
                setSize();
                Helper.setHash(sizeTimer, sizeStar, sizeFuel, sizeRanking, isMuted);
            });

            function changeSize(value) {
                sizeTimer += value;
                sizeStar += value;
                sizeFuel += value;
                sizeRanking += value;
            }

            function setSize() {
                TIMER.css('fontSize', sizeTimer);
                STAR_COUNTER.css('fontSize', sizeStar);
                FUEL_COUNTER_NUMBER.css('fontSize', sizeFuel);
                $('#dialog-ranking').css('fontSize', sizeRanking);
            }
        }
    },
    Dialog: {
        init: function () {
            dialogForm = $('#dialog-form').dialog({
                autoOpen: false,
                height: 150,
                modal: true,
                width: 350,
                closeOnEscape: false,
                show: {
                    effect: "blind",
                    duration: 400
                },
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    validateInput();
                    $('#btn-continue').click(function () {
                        ajax();
                    })
                }
            });
            dialogRanking = $('#dialog-ranking').dialog({
                autoOpen: false,
                modal: true,
                width: 440,
                closeOnEscape: false,
                show: {
                    effect: "blind",
                    duration: 400
                },
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    $('#btn-start').click(function () {
                        window.location.reload();
                    })
                }
            });

            function validateInput() {
                $('#name').keyup(function () {
                    if ($(this).val().trim().length > 0) $('#btn-continue').removeAttr('disabled');
                    else $('#btn-continue').attr('disabled', true);
                })
            }

            function ajax() {
                var name = $('#name').val();
                $.ajax({
                    url: 'register.php',
                    type: 'POST',
                    data: {
                        name: name,
                        time: timeCurrent,
                        stars: starCurrent
                    },
                    dataType: 'json'
                }).done(function (data) {
                    showData(Helper.sortRanking(data));
                    dialogRanking.dialog('open');
                })
            }

            function showData(data) {
                var str = '<table>\n' +
                    '                    <tr>\n' +
                    '                        <th>#</th>\n' +
                    '                        <th>Name</th>\n' +
                    '                        <th>Start</th>\n' +
                    '                        <th>Time</th>\n' +
                    '                    </tr>';
                $.each(data, function (i, val) {
                    str += '<tr class="border-bottom">\n' +
                        '                        <td class="text-center">' + (i + 1) + '</td>\n' +
                        '                        <td>' + val.name + '</td>\n' +
                        '                        <td class="text-center">' + val.stars + '</td>\n' +
                        '                        <td class="text-center">' + Helper.timeFormat(val.time) + '</td>\n' +
                        '                    </tr>';
                });
                str += '</table>';
                $('#list').html(str);
            }
        }
    },
    Running: {
        init: function () {
            function start() {
                if (isRunning) {
                    // Cloud
                    for (var i = 0; i < clouds.length; i++) {
                        var leftCurrent = clouds[i].offset().left;
                        if (leftCurrent <= GAME_AREA_LEFT - CLOUD_WIDTH) {
                            clouds[i].remove();
                            clouds.splice(i, 1);
                            // return;
                        } else
                            clouds[i].offset({left: leftCurrent - CLOUD_SPEED});
                    }
                    // Bird
                    for (i = 0; i < birds.length; i++) {
                        // Xử lý va chạm
                        // if (Helper.isCollision(AIRPLANE, birds[i])) {
                        //     if (!isMuted) {
                        //         hitSound.play();
                        //         backgroundSound.pause();
                        //         finishSound.play();
                        //         finishSound.loop();
                        //     }
                        //     isRunning = false;
                        //     dialogForm.dialog('open');
                        // } else {
                            // Xử lý di chuyển
                            var leftCurrent = birds[i].offset().left;
                            if (leftCurrent <= GAME_AREA_LEFT - BIRD_WIDTH) {
                                birds[i].remove();
                                birds.splice(i, 1);
                            } else
                                birds[i].offset({left: leftCurrent - BIRD_SPEED}).css('animation-play-state', 'running');
                        // }
                    }
                    // Star
                    for (i = 0; i < stars.length; i++) {
                        // Xử lý va cham
                        if (Helper.isCollision(AIRPLANE, stars[i])) {
                            if (!isMuted) starSound.play();
                            stars[i].remove();
                            starCurrent++;
                            stars.splice(i, 1);
                        } else {
                            // Xử lý di chuyển
                            var topCurrent = stars[i].offset().top;
                            if (topCurrent >= GAME_AREA_HEIGHT + GAME_AREA_TOP) {
                                stars[i].remove();
                                stars.splice(i, 1);
                            } else
                                stars[i].offset({top: topCurrent + STAR_SPEED}).css('animation-play-state', 'running');
                        }
                    }
                    // Parachute
                    for (i = 0; i < parachutes.length; i++) {
                        // Xử lý va chạm
                        if (Helper.isCollision(AIRPLANE, parachutes[i])) {
                            parachutes[i].remove();
                            Helper.changeFuelValue(FUEL_ADD);
                            FUEL_COUNTER_NUMBER.text(Helper.fuelFormat(fuelCurrent));
                            parachutes.splice(i, 1);
                        } else {
                            // Xử lý di chuyển
                            var topCurrent = parachutes[i].offset().top;
                            if (topCurrent >= GAME_AREA_HEIGHT + GAME_AREA_TOP) {
                                parachutes[i].remove();
                                parachutes.splice(i, 1);
                            } else
                                parachutes[i].offset({top: topCurrent + PARACHUTE_SPEED}).css('animation-play-state', 'running');
                        }
                    }
                }
                else {
                    for (i = 0; i < birds.length; i++)
                        birds[i].css('animation-play-state', 'paused');
                    for (i = 0; i < stars.length; i++)
                        stars[i].css('animation-play-state', 'paused');
                    for (i = 0; i < parachutes.length; i++)
                        parachutes[i].css('animation-play-state', 'paused');
                }
                setTimeout(start, 1000 / FPS);
            }

            start();
        }
    }
};