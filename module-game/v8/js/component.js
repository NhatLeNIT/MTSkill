var objects = [];
var isRunning = true, isMuted = false;
var timeCurrent = 0, starCurrent = 0, fuelCurrent = 0;
var backgroundSound, hitSound, starSound, finishSound;
var formDialog, rankingDialog;
var sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking;

var Component = {
    Cloud: {
        init: function (isInit) {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-cloud').appendTo(GAME_AREA);
            var left = GAME_AREA_WIDTH;
            var top = Helper.randomPosition().top;
            if (top >= obj.height()) top -= obj.height();
            if (isInit) left = Helper.randomPosition().left;
            var imageIndex = Helper.randomNumber(CLOUD_QTY);
            obj.css({
                background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, speed: CLOUD_SPEED, direction: DIRECTION_HORIZONTAL, width: obj.width()});
        }
    },
    Bird: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-bird').appendTo(GAME_AREA);
            var left = GAME_AREA_WIDTH;
            var top = Helper.randomPosition().top;
            if (top >= obj.height()) top -= obj.height();
            var imageIndex = Helper.randomNumber(BIRD_QTY);
            obj.css({
                background: 'url(images/bird/bird-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, speed: BIRD_SPEED, direction: DIRECTION_HORIZONTAL, width: obj.width()});
        }
    },
    Star: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-star').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = -obj.height();
            if (left >= obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, speed: STAR_SPEED, direction: DIRECTION_VERTICAL, height: obj.height()});
        }
    },
    Parachute: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-parachute').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = -obj.height();
            if (left >= obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, speed: PARACHUTE_SPEED, direction: DIRECTION_VERTICAL, height: obj.height()});
        }
    },
    Airplane: {
        keyStatus: {},
        init: function () {
            var keyStatus = this.keyStatus;
            $(window).keyup(function (e) {
                keyStatus[e.keyCode] = false;
            });
            $(window).keydown(function (e) {
                keyStatus[e.keyCode] = true;
            });
        },
        goX: function (distance) {
            var currentLeft = AIRPLANE[0].offsetLeft;
            var left = currentLeft + distance;
            if (left <= 0) left = 0;
            else if (left >= GAME_AREA_WIDTH - AIRPLANE.width()) left = GAME_AREA_WIDTH - AIRPLANE.width();
            AIRPLANE.css({left: left + 'px'});
        },
        goY: function (distance) {
            var currentTop = AIRPLANE[0].offsetTop;
            var top = currentTop + distance;
            if (top <= 0) top = STANDARD_ERROR;
            else if (top >= GAME_AREA_HEIGHT - AIRPLANE.height()) top = GAME_AREA_HEIGHT - AIRPLANE.height();
            AIRPLANE.css({top: top + 'px'});
        },
        control: function () {
            if (this.keyStatus[37]) this.goX(-AIRPLANE_SPEED);
            if (this.keyStatus[38]) this.goY(-AIRPLANE_SPEED);
            if (this.keyStatus[39]) this.goX(AIRPLANE_SPEED);
            if (this.keyStatus[40]) this.goY(AIRPLANE_SPEED);
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
                            //    Va cham
                            if (Helper.isCollision(objectJq) && objectJq.hasClass('elm-bird')) {
                                isRunning = false;
                                backgroundSound.pause();
                                hitSound.play();
                                finishSound.play().loop();
                                formDialog.dialog('open');
                            }
                            //    Di chuyen
                            var currentLeft = objectJq[0].offsetLeft;
                            var left = currentLeft - object.speed;
                            if (left <= -object.width)
                                remove(i);
                            objectJq.css({left: left + 'px'});

                        }
                        // VERTICAL
                        else {
                            //    Va cham
                            if (Helper.isCollision(objectJq)) {
                                if (objectJq.hasClass('elm-star')) {
                                    starSound.play();
                                    starCurrent++;
                                }
                                else {
                                    Helper.fuelChange(FUEL_ADD);
                                }
                                remove(i);
                            } else {
                                //    Di chuyen
                                var currentTop = objectJq[0].offsetTop;
                                var top = currentTop + object.speed;
                                if (top >= GAME_AREA_HEIGHT)
                                    remove(i);
                                objectJq.css({top: top + 'px'});
                            }


                        }
                        objectJq.css({'animation-play-state': 'running'});
                        AIRPLANE.removeClass('animation-pause');
                    }
                }
                //    PAUSE
                else {
                    for (i = 0; i < length; i++) {
                        objects[i].obj.css({'animation-play-state': 'paused'});
                    }
                    AIRPLANE.addClass('animation-pause');
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

            setTimeout(run, 1000);
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
                if (isRunning && fuelCurrent > 0) {
                    Helper.fuelChange(-FUEL_REDUCE);
                    if(fuelCurrent === 0) {
                        // isRunning = false;
                        finishSound.play().loop();
                        formDialog.dialog('open');
                    }
                }
                setTimeout(update, FUEL_TIME_CHANGE);
            }

            setTimeout(update, FUEL_TIME_CHANGE);
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
                isMuted = !isMuted;
                muteSound(isMuted);
                var txt = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                BTN_MUTE.html(txt);
                if (!isRunning) muteSound(true);
            });

            function muteSound(isMuted) {
                backgroundSound.muted(isMuted);
                hitSound.muted(isMuted);
                finishSound.muted(isMuted);
                starSound.muted(isMuted);
            }
        }
    },
    PauseControl: {
        init: function () {
            BTN_PAUSE.click(function (e) {
                isRunning = !isRunning;
                BTN_MUTE.click();
                if (isRunning) BTN_MUTE.removeAttr('disabled');
                else BTN_MUTE.attr('disabled', true);
                var txt = BTN_PAUSE.text().trim() === 'Pause' ? 'Continue' : 'Pause';
                BTN_PAUSE.html(txt);
            });
            $(window).keydown(function (e) {
                if (e.keyCode === 32)
                    BTN_PAUSE.click();
            });
        }
    },
    SizeControl: {
        init: function () {
            sizeTimer = parseInt(TIMER.css('fontSize'));
            sizeStarCounter = parseInt(STAR_COUNTER.css('fontSize'));
            sizeFuelCounter = parseInt(FUEL_NUMBER.css('fontSize'));
            sizeRanking = parseInt($('#ranking-dialog table').css('fontSize'));
            BTN_SIZE_DOWN.click(function () {
               changeSize(-1);
            });
            BTN_SIZE_UP.click(function () {
                changeSize(1);
            });
            function changeSize(size) {
                sizeTimer += size;
                sizeStarCounter += size;
                sizeFuelCounter += size;
                sizeRanking += size;
                TIMER.css('fontSize', sizeTimer);
               STAR_COUNTER.css('fontSize', sizeStarCounter);
                FUEL_NUMBER.css('fontSize', sizeFuelCounter);
               $('#ranking-dialog table').css('fontSize', sizeRanking);
            }
        }
    },
    Dialog: {
        init: function () {
            formDialog = $('#form-dialog').dialog({
                autoOpen: false,
                modal: true,
                width: 350,
                height: 150,
                closeOnEscape: false,
                show: {effect: 'blind', duration: 400},
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    $('#name').keyup(function () {
                        if (validate($(this).val())) {
                            $('#btn-continue').removeAttr('disabled');
                        } else {
                            $('#btn-continue').attr('disabled', true);
                        }
                    });
                    $('#btn-continue').click(function () {
                        ajax($('#name').val());
                        rankingDialog.dialog('open');
                    });
                }
            });
            rankingDialog = $('#ranking-dialog').dialog({
                autoOpen: false,
                modal: true,
                width: 550,
                height: 520,
                closeOnEscape: false,
                show: {effect: 'blind', duration: 400},
                open: function () {
                    formDialog.dialog('close');
                    $('.ui-dialog-titlebar-close').hide();
                    $('#btn-start').click(function () {
                        window.location.reload();
                    })
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
                });
            }

            function validate(data) {
                return data.trim().length > 0;
            }
            function showData(data) {
                var str = '';
                $.each(data, function (i, val) {
                    str+= '<tr>\n' +
                        '                    <td>'+ val.position +'</td>\n' +
                        '                    <td>'+ val.name +'</td>\n' +
                        '                    <td>'+ val.stars +'</td>\n' +
                        '                    <td>'+ Helper.timeFormat(val.time) +'</td>\n' +
                        '                </tr>'
                });
                $('#ranking-dialog tbody').html(str);
            }
        }
    }
};