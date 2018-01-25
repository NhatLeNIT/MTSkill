var objects = [];
var isRunning = true;
var isMute = false;
var timeCurrent = 0, starCurrent = 0, fuelCurrent = 0;
var backgroundSound, hitSound, starSound, finishSound;
var sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking;
var formDialog, rankingDialog;
var Component = {
    Cloud: {
        init: function (isInit) {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-cloud').appendTo(GAME_AREA);
            var left = GAME_AREA_WIDTH;

            var top = Helper.randomPosition().top;
            if (isInit) left = Helper.randomPosition().left;
            if (top > obj.height()) top -= obj.height();

            var imageIndex = Helper.randomNumber(CLOUD_QTY);
            obj.css({
                background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });

            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: CLOUD_SPEED, width: obj.width()})
        }
    },
    Bird: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-bird').appendTo(GAME_AREA);
            var left = GAME_AREA_WIDTH;

            var top = Helper.randomPosition().top;
            if (top > obj.height()) top -= obj.height();
            var imageIndex = Helper.randomNumber(BIRD_QTY);
            obj.css({
                background: 'url(images/bird/bird-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: BIRD_SPEED, width: obj.width()})
        }
    },
    Star: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-star').appendTo(GAME_AREA);
            var top = -obj.height();

            var left = Helper.randomPosition().left;
            if (left > obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: STAR_SPEED, height: obj.height()})
        }
    },
    Parachute: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-parachute').appendTo(GAME_AREA);
            var top = -obj.height();

            var left = Helper.randomPosition().left;
            if (left > obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: PARACHUTE_SPEED, height: obj.height()})
        }
    },
    Airplane: {
        keyState: {},
        init: function () {
            var keyState = this.keyState;
            $(window).keyup(function (e) {
                keyState[e.keyCode] = false;
            });
            $(window).keydown(function (e) {
                keyState[e.keyCode] = true;
            });
        },
        goX: function (distance) {
            var leftCurrent = AIRPLANE[0].offsetLeft;
            var left = leftCurrent + distance;
            if (left <= 0) left = 0;
            else if (left >= GAME_AREA_WIDTH - AIRPLANE_WIDTH) left = GAME_AREA_WIDTH - AIRPLANE_WIDTH;
            AIRPLANE.css({left: left + 'px'});
        },
        goY: function (distance) {
            var topCurrent = AIRPLANE[0].offsetTop;
            var top = topCurrent + distance;
            if (top <= 0) top = 0;
            else if (top >= GAME_AREA_HEIGHT - AIRPLANE_HEIGHT) top = GAME_AREA_HEIGHT - AIRPLANE_HEIGHT;
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

            function remove(i) {
                objects[i].obj.remove();
                objects.splice(i, 1);
                length = objects.length;
            }

            function run() {
                length = objects.length;
                // RUNNING
                if (isRunning) {
                    for (var i = 0; i < length; i++) {
                        var object = objects[i];
                        var objectJq = object.obj;
                        // HORIZONTAL
                        if (object.direction === DIRECTION_HORIZONTAL) {
                            // Va cham
                            if (Helper.isCollision(objectJq)) {
                                if (objectJq.hasClass('elm-bird')) {
                                    isRunning = false;
                                    backgroundSound.pause();
                                    hitSound.play();
                                    finishSound.play().loop();
                                    formDialog.dialog('open');
                                }
                            }
                            // Di chuyen
                            var leftCurrent = objectJq[0].offsetLeft;
                            var left = leftCurrent - object.speed;
                            if (left <= -object.width) {
                                remove(i);
                            } else {
                                objectJq.css({left: left + 'px'})
                            }
                        }
                        // VERTICAL
                        else {
                            // Va cham
                            if (Helper.isCollision(objectJq)) {
                                if (objectJq.hasClass('elm-star')) {
                                    starCurrent++;
                                    starSound.play();
                                }
                                else {
                                    Helper.fuelChange(FUEL_ADD);
                                }
                                remove(i);
                            }
                            // Di chuyen
                            var topCurrent = objectJq[0].offsetTop;
                            var top = topCurrent + object.speed;
                            if (top >= GAME_AREA_HEIGHT) {
                                remove(i);
                            } else {
                                objectJq.css({top: top + 'px'})
                            }
                        }
                        objectJq.css({'animation-play-state': 'running'})
                    }
                }
                // PAUSE
                else {
                    for (i = 0; i < length; i++) {
                        objects[i].obj.css({'animation-play-state': 'paused'})
                    }
                }

                setTimeout(run, FPS);
            }

            run();
        }
    },
    Timer: {
        init: function () {
            function run() {
                if (isRunning)
                    TIMER.html(Helper.timeFormat(++timeCurrent));
                setTimeout(run, 1000);
            }

            run();
        }
    },
    StarCounter: {
        init: function () {
            function update() {
                STAR_COUNTER.html(starCurrent);
                setTimeout(update, FPS);
            }

            update();
        }
    },
    FuelCounter: {
        init: function () {
            fuelCurrent = FUEL_INIT;
            Helper.fuelChange(0);

            function update() {
                if (fuelCurrent > 0 && isRunning) {
                    Helper.fuelChange(-FUEL_REDUCE);
                    if(fuelCurrent === 0) {
                        isRunning = false;
                        backgroundSound.pause();
                        finishSound.play().loop();
                        formDialog.dialog('open');
                    }
                }
                setTimeout(update, 1000);
            }

            update();
        }
    },
    SoundControl: {
        init: function () {
            backgroundSound = new Sound('background');
            hitSound = new Sound('hit');
            starSound = new Sound('star');
            finishSound = new Sound('finish');
            backgroundSound.autoplay().loop();
            GAME_AREA.append(backgroundSound, hitSound, starSound, finishSound);

            BTN_MUTE.click(function () {
                isMute = !isMute;
                var txt = $(this).text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                BTN_MUTE.html('<span class="wave"></span>' + txt);
                muteSound(isMute);
            });

            function muteSound(isMute) {
                backgroundSound.muted(isMute);
                hitSound.muted(isMute);
                starSound.muted(isMute);
                finishSound.muted(isMute);
            }
        }
    },
    SizeControl: {
        init: function () {
            sizeTimer = parseInt(TIMER.css('fontSize'));
            sizeStarCounter = parseInt(STAR_COUNTER.css('fontSize'));
            sizeFuelCounter = parseInt(FUEL_NUMBER.css('fontSize'));
            // sizeRanking = parseInt(FUEL_NUMBER.css('fontSize'));

            BTN_SIZE_UP.click(function () {
                setSize(1);
            });
            BTN_SIZE_DOWN.click(function () {
                setSize(-1);
            });
            function setSize(value) {
                sizeTimer += value;
                sizeStarCounter += value;
                sizeFuelCounter += value;
                // sizeRanking += value;
                TIMER.css('fontSize', sizeTimer);
                STAR_COUNTER.css('fontSize', sizeStarCounter);
                FUEL_NUMBER.css('fontSize', sizeFuelCounter);
            }
            // sizeTimer = parseInt(TIMER.css('fontSize'));
        }
    },
    PauseControl: {
        init: function () {
            BTN_PAUSE.click(function () {
                isRunning = !isRunning;
                var txt = $(this).text().trim() === 'Pause' ? 'Continue' : 'Pause';
                BTN_PAUSE.html('<span class="wave"></span>' + txt);
                BTN_MUTE.click();
                if (isRunning)
                    BTN_MUTE.removeAttr('disabled');
                else BTN_MUTE.attr('disabled', true);
            });
        }
    },
    Dialog: {
        init: function () {
            formDialog = $('#form-dialog').dialog({
                width: 400,
                height: 150,
                modal: true,
                autoOpen: false,
                closeOnEscape: false,
                show: {effect: 'blind',duration: 400},
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    $('#name').keyup(function () {
                        if(validate($(this).val())) {
                            $('#btn-continue').removeAttr('disabled');
                        } else $('#btn-continue').attr('disabled', true);
                    });
                    $('#btn-continue').click(function () {
                        var name = $('#name').val();
                        ajax(name);
                        rankingDialog.dialog('open');
                    });
                    function validate(name) {
                        return name.length > 0;
                    }
                }
            });
            rankingDialog = $('#ranking-dialog').dialog({
                width: 500,
                height: 400,
                modal: true,
                autoOpen: false,
                closeOnEscape: false,
                show: {effect: 'blind',duration: 400},
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    $('#btn-start').click(function () {
                        window.location.reload();
                    });
                }
            });
            function ajax(name) {
                $.ajax({
                    url: 'register.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {name: name, stars: starCurrent, time: timeCurrent}
                }).done(function (data) {
                    showData(Helper.sortRanking(data));
                })
            }
            function showData(data) {
                var str = '';
                $.each(data, function (i, val) {
                    str += '<tr>\n' +
                        '                        <td>'+ i +'</td>\n' +
                        '                        <td>'+ val.name +'</td>\n' +
                        '                        <td>'+ val.stars +'</td>\n' +
                        '                        <td>'+ Helper.timeFormat(val.time) +'</td>\n' +
                        '                    </tr>';
                });
                $('#ranking-dialog table tbody').html(str);
            }
        }
    }
};