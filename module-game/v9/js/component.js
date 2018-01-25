var objects = [];
var isRunning = true;
var isMute = false;

var timeCurrent = 0, starCurrent = 0, fuelCurrent = 0;
var backgroundSound, hitSound, starSound, finishSound;
var formDialog, rankingDialog;
var sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking;
/**
 * Chứa tất cả các thành phần của game
 * @type {{Cloud: {init: Component.Cloud.init}, Bird: {init: Component.Bird.init}, Star: {init: Component.Star.init}, Parachute: {init: Component.Parachute.init}, Airplane: {keyState: {}, init: Component.Airplane.init, goX: Component.Airplane.goX, goY: Component.Airplane.goY, control: Component.Airplane.control}, Running: {init: Component.Running.init}, Counter: {init: Component.Counter.init}, SoundControl: {init: Component.SoundControl.init}, PauseControl: {init: Component.PauseControl.init}, Dialog: {init: Component.Dialog.init}, SizeControl: {init: Component.SizeControl.init}}}
 */
var Component = {
    /**
     * Quản lý đối tương đám mây
     */
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
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: CLOUD_SPEED, width: obj.width()});
        }
    },
    /**
     * Quản lý đối tương chim
     */
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
            objects.push({obj: obj, direction: DIRECTION_HORIZONTAL, speed: BIRD_SPEED, width: obj.width()});
        }
    },
    /**
     * Quản lý đối tương bird
     */
    Star: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-star').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = - obj.height();
            if (left >= obj.width()) left -= obj.width();

            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: STAR_SPEED, height: obj.height()});
        }
    },
    /**
     * Quản lý đối tương bình nhiên liệu
     */
    Parachute: {
        init: function () {
            var elm = document.createElement('span');
            var obj = $(elm);
            obj.addClass('elm-parachute').appendTo(GAME_AREA);
            var left = Helper.randomPosition().left;
            var top = - obj.height();
            if (left >= obj.width()) left -= obj.width();

            obj.css({
                left: left + 'px',
                top: top + 'px'
            });
            objects.push({obj: obj, direction: DIRECTION_VERTICAL, speed: PARACHUTE_SPEED, height: obj.height()});
        }
    },
    /**
     * Quản lý đối tương máy bay
     */
    Airplane: {
        keyState : {},
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
            var currentLeft = AIRPLANE[0].offsetLeft;
            var left = currentLeft + distance;
            if(left <= 0) left = 0;
            else if(left >= GAME_AREA_WIDTH - AIRPLANE_WIDTH) left = GAME_AREA_WIDTH - AIRPLANE_WIDTH;
            AIRPLANE.css({left: left + 'px'});
        },
        goY: function (distance) {
            var currentTop = AIRPLANE[0].offsetTop;
            var top = currentTop + distance;
            if(top <= STANDARD_ERROR) top = STANDARD_ERROR;
            else if(top >= GAME_AREA_HEIGHT - AIRPLANE_HEIGHT) top = GAME_AREA_HEIGHT - AIRPLANE_HEIGHT;
            AIRPLANE.css({top: top + 'px'});
        },
        control: function () {
            if(this.keyState[37]) this.goX(-AIRPLANE_SPEED);
            if(this.keyState[38]) this.goY(-AIRPLANE_SPEED);
            if(this.keyState[39]) this.goX(AIRPLANE_SPEED);
            if(this.keyState[40]) this.goY(AIRPLANE_SPEED);
        }
    },
    /**
     * Quản lý chuyển động của các đối tượng mây, chim, bình nhiên liệu, ngôi sao
     */
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
                if(isRunning) {
                    for (var i = 0; i < length; i++) {
                        var object = objects[i];
                        var objectJq = object.obj;
                        // HORIZONTAL
                        if(object.direction === DIRECTION_HORIZONTAL) {
                        //    Va cham
                            if(Helper.isCollision(objectJq) && objectJq.hasClass('elm-bird')) {
                                isRunning = false;
                                backgroundSound.pause();
                                hitSound.play();
                                finishSound.play().loop();
                                formDialog.dialog('open');
                            }
                        //    Di chuyen
                            var currentLeft = objectJq[0].offsetLeft;
                            var left = currentLeft - object.speed;
                            if(left <= -objectJq.width())
                                remove(i);
                            else
                                objectJq.css({left: left + 'px'});
                        }
                        // VERTICAL
                        else {
                            //    Va cham
                            if(Helper.isCollision(objectJq)) {
                                if(objectJq.hasClass('elm-star')) {
                                    starSound.play();
                                    STAR_COUNTER.html(++starCurrent);
                                    remove(i);
                                } else {
                                    Helper.fuelChange(FUEL_ADD);
                                    remove(i);
                                }
                            }
                            //    Di chuyen
                            var currentTop = objectJq[0].offsetTop;
                            var top = currentTop + object.speed;
                            if(top >= GAME_AREA_HEIGHT)
                                remove(i);
                            else
                                objectJq.css({top: top + 'px'});
                        }
                        objectJq.css({'animation-play-state': 'running'});
                        AIRPLANE.removeClass('animation-pause');
                    }
                }
                // PAUSE
                else {
                    for (i = 0; i < length; i++)
                        objects[i].obj.css({'animation-play-state': 'paused'});
                    AIRPLANE.addClass('animation-pause');
                }
                setTimeout(run, FPS);
            }
            run();
        }
    },
    /**
     * Quản lý đối tượng timer và fuel counter
     */
    Counter: {
        init: function () {
            fuelCurrent = FUEL_INIT;
            Helper.fuelChange(0);
            function run() {
                if(isRunning) {
                    // TIMER
                    TIMER.html(Helper.timeFormat(++timeCurrent));
                    // FUEL COUNTER
                    Helper.fuelChange(-FUEL_REDUCE);
                }

                setTimeout(run, 1000);
            }
            setTimeout(run, 1000);
        }
    },
    /**
     * Quản lý âm thanh trong game
     */
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
                muteSound(isMute);
               var txt = BTN_MUTE.text().trim() === 'Mute' ? 'Unmute' : 'Mute';
                BTN_MUTE.html(txt);

               if(!isRunning) muteSound(true);
            });
            function muteSound(isMuted) {
                backgroundSound.muted(isMuted);
                hitSound.muted(isMuted);
                starSound.muted(isMuted);
                finishSound.muted(isMuted);
            }
        }
    },
    /**
     * Quản lý pause and continue game
     */
    PauseControl: {
        init: function () {
            BTN_PAUSE.click(function () {
                isRunning = !isRunning;
                BTN_MUTE.click();
                if(isRunning) BTN_MUTE.removeAttr('disabled');
                else BTN_MUTE.attr('disabled', true);
            });
            $(window).keydown(function (e) {
                if(e.keyCode === 32) BTN_PAUSE.click();
            })
        }
    },
    /**
     * Quản lý dialog ranking and dialog khi game over
     */
    Dialog: {
        init: function () {
            formDialog = $('#form-dialog').dialog({
                autoOpen: false,
                modal: true,
                closeOnEscape: false,
                width: 350,
                height: 150,
                show: {effect: 'blind', duration: 400},
                open: function () {
                    var name;
                    $('#name').keyup(function () {
                        name = $(this).val();
                       if(validate(name)) {
                           $('#btn-continue').removeAttr('disabled');
                       } else {
                           $('#btn-continue').attr('disabled', true);
                       }
                    });
                    $('#btn-continue').click(function () {
                        ajax(name);
                        rankingDialog.dialog('open');
                    })
                }
            });
            rankingDialog = $('#ranking-dialog').dialog({
                autoOpen: false,
                width: 500,
                height: 530,
                modal: true,
                show: {effect: 'blind', duration:400},
                closeOnEscape: false,
                open: function () {
                    formDialog.dialog('close');
                    $('#btn-reload').click(function () {
                        window.location.reload();
                    })
                }
            });

            function validate(name) {
               return name.trim().length > 0;
            }
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
            function showData(data) {
                console.log(data);
                var str = '';
                $.each(data, function (i, val) {
                    str += '               <tr>\n' +
                        '                    <td>'+ val.position +'</td>\n' +
                        '                    <td>'+ val.name +'</td>\n' +
                        '                    <td>'+ val.stars +'</td>\n' +
                        '                    <td>'+ Helper.timeFormat(val.time) +'</td>\n' +
                        '                </tr>';
                });
                $('#ranking-dialog tbody').html(str);
            }
        }
    },
    /**
     * Quản lý size trong game
     */
    SizeControl: {
        init: function () {
            sizeTimer = parseInt(TIMER.css('fontSize'));
            sizeStarCounter = parseInt(STAR_COUNTER.css('fontSize'));
            sizeFuelCounter = parseInt(FUEL_NUMBER.css('fontSize'));
            sizeRanking = parseInt($('#ranking-dialog table').css('fontSize'));

            BTN_SIZE_UP.click(function () {
                changeSize(1);
            });
            BTN_SIZE_DOWN.click(function () {
                changeSize(-1);
            });
            function changeSize(size) {
                sizeTimer += size;
                sizeStarCounter += size;
                sizeFuelCounter += size;
                sizeRanking += size;
                
                TIMER.css('fontSize', sizeTimer + 'px');
                STAR_COUNTER.css('fontSize', sizeStarCounter);
                FUEL_NUMBER.css('fontSize', sizeFuelCounter);
                $('#ranking-dialog table').css('fontSize', sizeRanking);
            }
        }
    }
};