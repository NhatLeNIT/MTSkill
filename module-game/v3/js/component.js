var objects = [];
var param = Helper.getHash();

var isRunning = true;
var isMuted = param.isMuted ? eval(param.isMuted) : false;
var timeCurrent = 0, starCurrent = 0, fuelCurrent = 0;

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
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: CLOUD_SPEED, width: CLOUD_WIDTH})
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
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: BIRD_SPEED, width: BIRD_WIDTH})
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
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: STAR_SPEED, height: STAR_HEIGHT})
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
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: PARACHUTE_SPEED, height: PARACHUTE_HEIGHT})
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
            var leftCurrent = AIRPLANE[0].offsetLeft;
            var left = leftCurrent + distance;

            if (left <= 0) left = 0;
            else if (left >= GAME_AREA_WIDTH - AIRPLANE_WIDTH)
                left = GAME_AREA_WIDTH - AIRPLANE_WIDTH;
            AIRPLANE.css({left: left + 'px'});
        },
        goY: function (distance) {
            var topCurrent = AIRPLANE[0].offsetTop;
            var top = topCurrent + distance;

            if (top <= 0) top = 0;
            else if (top >= GAME_AREA_HEIGHT - AIRPLANE_HEIGHT)
                top = GAME_AREA_HEIGHT - AIRPLANE_HEIGHT;
            AIRPLANE.css({top: top + 'px'});
        },
        control: function () {
            if (this.keyState[37]) this.goX(-AIRPLANE_SPEED);
            if (this.keyState[38]) this.goY(-AIRPLANE_SPEED);
            if (this.keyState[39]) this.goX(AIRPLANE_SPEED);
            if (this.keyState[40]) this.goY(AIRPLANE_SPEED);
        }
    },
    Running: {
        init: function () {
            var length = 0;

            function remove(position) {
                objects[position].obj.remove();
                objects.splice(position, 1);
                length = objects.length;
            }

            function run() {
                length = objects.length;
                // Running
                if (isRunning) {
                    for (var i = 0; i < length; i++) {
                        var object = objects[i];
                        var objectJq = object.obj;
                        //    Horizontal
                        if (object.direction === DIRECTION_HORIZONTAL) {
                            // Xử lý va chạm
                            // if (Helper.isCollision(objectJq) && objectJq.hasClass('elm-bird')) {
                            //     if (!isMuted) {
                            //         hitSound.play();
                            //         backgroundSound.pause();
                            //         finishSound.play();
                            //         finishSound.loop();
                            //     }
                            //     isRunning = false;
                            //     dialogForm.dialog('open');
                            // } else {
                                var leftCurrent = objectJq[0].offsetLeft;
                                if (leftCurrent <= -object.width) {
                                    remove(i);
                                } else {
                                    objectJq.css({
                                        left: leftCurrent - object.speed + 'px',
                                        'animation-play-state': 'running'
                                    })
                                }
                            // }
                        }
                        //    Vertical
                        else {
                            // Xử lý va cham
                            if (Helper.isCollision(objectJq)) {
                                if (objectJq.hasClass('elm-star')) {
                                    if (!isMuted) starSound.play();
                                    starCurrent++;
                                }
                                else {
                                    Helper.changeFuelValue(FUEL_ADD);
                                    FUEL_COUNTER_NUMBER.text(Helper.fuelFormat(fuelCurrent));
                                }
                                remove(i);
                            } else {
                                var topCurrent = objectJq[0].offsetTop;
                                if (topCurrent >= GAME_AREA_HEIGHT) {
                                    remove(i);
                                } else {
                                    objectJq.css({
                                        top: topCurrent + object.speed + 'px',
                                        'animation-play-state': 'running'
                                    });
                                }
                            }
                        }
                    }
                }
                //    Pause
                else {
                    for (i = 0; i < length; i++)
                        objects[i].obj.css('animation-play-state', 'paused');
                }
                setTimeout(run, 1000 / FPS);
            }

            run();
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
                    if (fuelCurrent === 0) {
                        // isRunning = false;
                        // backgroundSound.pause();
                        // finishSound.play().loop();
                        // dialogForm.dialog('open');
                    }
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
            backgroundSound.autoplay().loop();
            // star
            starSound = new Sound('star');
            // hit
            hitSound = new Sound('hit');
            // finish
            finishSound = new Sound('finish');
            GAME_AREA.append(backgroundSound).append(starSound).append(hitSound).append(finishSound);
            // Lúc vừa vào game
            if (isMuted) {
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
            sizeRanking = param.sizeRanking ? parseInt(param.sizeRanking) : parseInt($('#dialog-ranking').css('fontSize'));
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
                var str = '';
                $.each(data, function (i, val) {
                    str += '<tr class="border-bottom">\n' +
                        '                        <td class="text-center">' + (i + 1) + '</td>\n' +
                        '                        <td>' + val.name + '</td>\n' +
                        '                        <td class="text-center">' + val.stars + '</td>\n' +
                        '                        <td class="text-center">' + Helper.timeFormat(val.time) + '</td>\n' +
                        '                    </tr>';
                });
                $('#list table tbody').html(str);
            }
        }
    }
};