var objects = [];
var isRunning = true;
var isMuted = false;
var params = Helper.getHash();

var timeCurrent = 0, starCurrent = 0, fuelCurrent = 0;
var backgroundSound, starSound, hitSound, finishSound;
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
            if (top > obj.height()) top -= obj.height();
            isInit = isInit ? isInit : false;
            if (isInit) left = Helper.randomPosition().left;
            var imageIndex = Helper.randomNumber(BIRD_QTY);
            obj.css({
                background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: CLOUD_SPEED, width: obj.width()});
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
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: BIRD_SPEED, width: obj.width()});
        }
    },
    Star: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-star').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = -obj.height();
            if (left > obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: STAR_SPEED});
        }
    },
    Parachute: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-parachute').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = -obj.height();
            if (left > obj.width()) left -= obj.width();
            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: STAR_SPEED});
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
            else if (left >= GAME_AREA_WIDTH - AIRPLANE.width())
                left = GAME_AREA_WIDTH - AIRPLANE.width();
            AIRPLANE.css({left: left + 'px'});
        },
        goY: function (distance) {
            var topCurrent = AIRPLANE[0].offsetTop;
            var top = topCurrent + distance;
            if (top <= 0) top = 0;
            else if (top >= GAME_AREA_HEIGHT - AIRPLANE.height())
                top = GAME_AREA_HEIGHT - AIRPLANE.height();
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
                // RUNNING
                if (isRunning) {
                    length = objects.length;
                    for (var i = 0; i < length; i++) {
                        var object = objects[i];
                        var objectJq = object.obj;
                        // HORIZONTAL
                        if (object.direction === DIRECTION_HORIZONTAL) {
                            // Va cham
                            if (Helper.isCollision(objectJq) && objectJq.hasClass('elm-bird')) {
                                backgroundSound.pause();
                                hitSound.play();
                                finishSound.play().loop();
                                isRunning = false;
                                formDialog.dialog('open');
                            }
                            // Di chuyen
                            var leftCurrent = objectJq[0].offsetLeft;
                            if (leftCurrent <= -object.width) remove(i);
                            else
                                objectJq.css({left: leftCurrent - object.speed + 'px'});
                        }
                        // VERTICAL
                        else {
                            // Va cham
                            if (Helper.isCollision(objectJq)) {
                                if (objectJq.hasClass('elm-star')) {
                                    starSound.play();
                                    starCurrent++;
                                } else {
                                    Helper.fuelChange(FUEL_ADD);
                                }
                                remove(i);
                            } else {
                                // Di chuyen
                                var topCurrent = objectJq[0].offsetTop;
                                if (topCurrent >= GAME_AREA_HEIGHT) remove(i);
                                else objectJq.css({top: topCurrent + object.speed + 'px'});
                            }

                        }
                        objectJq.css('animation-play-state', 'running');
                    }
                }
                // PAUSE
                else {
                    for (i = 0; i < length; i++)
                        objects[i].obj.css('animation-play-state', 'paused');
                }
                setTimeout(run, FPS);
            }

            run();
        }
    },
    Timer: {
        init: function () {
            function run() {
                if (isRunning) {
                    TIMER.html(Helper.timeFormat(++timeCurrent));
                }
                setTimeout(run, 1000);
            }

            setTimeout(run, 1000);
        }
    },
    FuelCounter: {
        init: function () {
            fuelCurrent = FUEL_INIT;
            Helper.fuelChange(0);

            function update() {
                if (isRunning && fuelCurrent > 0) {
                    Helper.fuelChange(-FUEL_REDUCE);
                    if (fuelCurrent === 0) {
                        finishSound.play().loop();
                        formDialog.dialog('open');
                    }
                }
                setTimeout(update, 1000);
            }

            setTimeout(update, 1000);
        }
    },
    StarCounter: {
        init: function () {
            function update() {
                START_COUNTER.html(starCurrent);
                setTimeout(update, FPS);
            }

            update();
        }
    },
    SoundControl: {
        init: function () {
            backgroundSound = new Sound('background');
            starSound = new Sound('star');
            hitSound = new Sound('hit');
            finishSound = new Sound('finish');
            backgroundSound.autoplay().loop();
            GAME_AREA.append(backgroundSound, starSound, hitSound, finishSound);
            isMuted = params.isMuted ? eval(params.isMuted) : false;
            if (isMuted) {
                var txt = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                var strHTML = '<span class="wave"></span>' + txt;
                BTN_MUTE.html(strHTML);
                mutedSound(isMuted);
            }
            BTN_MUTE.click(function () {
                isMuted = !isMuted;
                var txt = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                var strHTML = '<span class="wave"></span>' + txt;
                BTN_MUTE.html(strHTML);
                mutedSound(isMuted);
                Helper.setHash(sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking, isMuted);
            });

            function mutedSound(isMuted) {
                backgroundSound.muted(isMuted);
                starSound.muted(isMuted);
                hitSound.muted(isMuted);
                finishSound.muted(isMuted);
            }
        }
    },
    PauseControl: {
        init: function () {
            BTN_PAUSE.click(function () {
                isRunning = !isRunning;
                var txt = BTN_PAUSE.text().trim() === 'Pause' ? 'Continue' : 'Pause';
                var strHTML = '<span class="wave"></span>' + txt;
                BTN_PAUSE.html(strHTML);
                BTN_MUTE.click();
                if (isRunning) BTN_MUTE.removeAttr('disabled');
                else BTN_MUTE.attr('disabled', true);
            });
        }
    },
    SizeControl: {
        init: function () {
            sizeTimer = params.sizeTimer ? parseInt(params.sizeTimer) : parseInt($('#timer').css('fontSize'));
            sizeStarCounter = params.sizeStarCounter ? parseInt(params.sizeStarCounter) : parseInt($('#star-counter').css('fontSize'));
            sizeFuelCounter = params.sizeFuelCounter ? parseInt(params.sizeFuelCounter) : parseInt($('#fuel-number').css('fontSize'));
            sizeRanking = params.sizeRanking ? parseInt(params.sizeRanking) : parseInt($('#ranking-dialog').css('fontSize'));

            BTN_SIZE_DOWN.click(function () {
                setSize(-1);
                Helper.setHash(sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking, isMuted);
            });
            BTN_SIZE_UP.click(function () {
                setSize(1);
                Helper.setHash(sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking, isMuted);
            });

            function setSize(size) {
                sizeTimer += size;
                sizeStarCounter += size;
                sizeFuelCounter += size;
                sizeRanking += size;
                $('#timer').css('fontSize', sizeTimer);
                $('#star-counter').css('fontSize', sizeStarCounter);
                $('#fuel-number').css('fontSize', sizeFuelCounter);
                $('#ranking-dialog').css('fontSize', sizeRanking);
            }
        }
    },
    Dialog: {
        init: function () {
            formDialog = $('#form-dialog').dialog({
                width: 350,
                autoOpen: false,
                modal: true,
                closeOnEscape: false,
                show: {effect: 'blind', duration: 400},
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    var btn = $('#btn-continue');
                    $('#name').keyup(function () {
                        var name = $(this).val().trim();
                        if (validate(name)) {
                            btn.removeAttr('disabled');
                        } else {
                            btn.attr('disabled', true);
                        }
                    });

                    btn.click(function () {
                        var name = $('#name').val().trim();
                        ajax(name);
                        rankingDialog.dialog('open');
                    });

                    function validate(name) {
                        return name.length !== 0;
                    }

                    function ajax(name) {
                        $.ajax({
                            url: 'register.php',
                            type: 'POST',
                            data: {name: name, stars: starCurrent, time: timeCurrent},
                            dataType: 'json'
                        }).done(function (data) {
                            showData(Helper.sortRanking(data));
                        })
                    }
                    function showData(data) {
                        var str = '';
                        $.each(data, function (i, val) {
                            str += '<tr>\n' +
                                '                        <td>'+ (i+1) +'</td>\n' +
                                '                        <td>'+ val.name +'</td>\n' +
                                '                        <td>'+ val.stars +'</td>\n' +
                                '                        <td>'+ Helper.timeFormat(val.time) +'</td>\n' +
                                '                    </tr>';
                        });
                        $('#list table tbody').html(str);
                    }
                }
            });
            rankingDialog = $('#ranking-dialog').dialog({
                width: 500,
                autoOpen: false,
                modal: true,
                closeOnEscape: false,
                show: {effect: 'blind', duration: 400},
                open: function () {
                    $('.ui-dialog-titlebar-close').hide();
                    $('#btn-start').click(function () {
                        window.location.reload();
                    })
                }
            });
        }
    }
};