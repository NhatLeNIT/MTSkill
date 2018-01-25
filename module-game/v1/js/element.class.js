/**
 * @desc Class Helper
 */
var Helper = {
    randomNumber: function (number) {
        return Math.floor(Math.random() * number) + 1;
    },
    randomPosition: function () {
        var width = $(GAME_AREA).outerWidth();
        var height = $(GAME_AREA).outerHeight();
        return {
            left: this.randomNumber(width),
            top: this.randomNumber(height)
        };
    },
    /**
     * @desc Thay đổi giá trị của fuel counter và cập nhật image fuel counter
     */
    changeFuelValue: function (value) {
        var percentFuel = (fuelCounterCurrent + value) / (100 + fuelCounterCurrent + value) * 100; // Tính phần trăm so với tổng hiện tại
        fuelCounterCurrent += value;
        var imageIndex = 0;

        if (percentFuel < 10) imageIndex = 0;
        else if (percentFuel < 20) imageIndex = 1;
        else if (percentFuel < 30) imageIndex = 2;
        else if (percentFuel < 40) imageIndex = 3;
        else if (percentFuel < 50) imageIndex = 4;
        else if (percentFuel < 60) imageIndex = 5;
        else if (percentFuel < 70) imageIndex = 6;
        else if (percentFuel < 80) imageIndex = 7;
        else if (percentFuel < 90) imageIndex = 8;
        else if (percentFuel < 100) imageIndex = 9;
        else imageIndex = 10;

        $(FUEL_COUNTER).css({
            background: 'url(images/fuel-counter/fuel-counter-' + imageIndex + '.png)',
            backgroundSize: 'cover'
        })
    },
    /**
     * @desc Định dạng thời gian
     */
    timeFormat: function (time) {
        var minute = Math.floor(time / 60);
        var second = time % 60;
        var strMinute, strSecond;
        strSecond = second < 10 ? "0" + second : second;
        strMinute = minute < 10 ? "0" + minute : minute;
        return strMinute + ":" + strSecond;
    }
}

/**
 * @desc Class Cloud
 * @param {number} imageIndex số thứ tự của hình

 */
function Cloud(imageIndex) {
    var elementCloud;

    /**
     * @desc tạo một đám mây (thẻ span) ở vị trí ngẫu nhiên
     * @param {*} isCreate nếu không có giá trị là tạo mây ở vị trí ngẫu nhiên, ngược lại tạo sát mây ở sát lề phải
     * @return {HTMLElement} đối tượng HTML chứa đám mây
     */
    this.init = function (isCreate) {
        this.elementCloud = document.createElement('span');
        var top = Helper.randomPosition().top;
        var left = Helper.randomPosition().left;
        if (typeof isCreate === 'undefined') isCreate = false;
        if (isCreate) // Nếu isCreate = true; thì cloud sẽ nằm sát lề phải
            left = $(GAME_AREA).outerWidth();

        // if(top >= CLOUD_HEIGHT)
        //     top -= CLOUD_HEIGHT;
        // if(left >= CLOUD_WIDTH)
        // left -= CLOUD_WIDTH;

        $(this.elementCloud).addClass('elm-cloud')
            .css({
                background: 'url(images/cloud/cloud-' + imageIndex + '.png)',
                backgroundSize: 'cover',
                top: top + 'px',
                left: left + 'px'
            });

        return this.elementCloud;
    }

    /**
     * @desc di chuyển vị trí đám mây theo hướng từ phải sang trái với tốc độ di chuyển SPEED_CLOUD
     */
    this.run = function () {
        var cloud = $(this.elementCloud);
        var currentLeft = cloud.offset().left;
        // Nếu vị trí hiện tại của đám mây nhỏ hơn kích thước của đám mây thì xóa đám mây đó và dừng
        if (currentLeft <= -CLOUD_WIDTH) {
            cloud.remove();
            return;
        }
        // Giảm left của đám mây theo tốc độ quy định trước
        cloud.offset({
            left: currentLeft - CLOUD_SPEED
        });
    }
}

/**
 * @desc Class Bird
 * @param {number} imageIndex số thứ tự của hình
 * @param {string} direction hướng bay của chim
 */
function Bird(imageIndex, direction) {
    var elementBird;
    /**
     * @desc Tạo một con chim. Nếu direction là left thì xuất phát từ bên trái và ngược lại
     */
    this.init = function () {
        this.elementBird = document.createElement('span');
        var left = -BIRD_WIDTH;
        var top = Helper.randomPosition().top;

        if (direction === 'right') left = $(GAME_AREA).outerWidth();

        if (top >= BIRD_HEIGHT)
            top -= BIRD_HEIGHT;
        $(this.elementBird).addClass('elm-bird')
            .css({
                width: BIRD_WIDTH + 'px',
                height: BIRD_HEIGHT + 'px',
                background: 'url(images/bird/bird-' + imageIndex + '.gif)',
                backgroundSize: 'cover',
                left: left + 'px',
                top: top + 'px'
            });

        if (typeof direction === 'undefined') direction = 'left';
        if (direction === 'right') $(this.elementBird).addClass('flip-x');
        return this.elementBird;
    }

    this.run = function () {
        var bird = $(this.elementBird);
        var currentLeft = bird.offset().left;

        // Nếu vị trí hiện tại của con chim <= kích thước của con chim hoặc >= kích thước của GAME AREA thì xóa con chim đó và dừng
        if ((currentLeft <= -CLOUD_WIDTH && direction === 'right') || (currentLeft >= $(GAME_AREA).outerWidth() && direction === 'left')) {
            bird.remove();
            return;
        }

        // Di chuyển vị trí của con chim theo tốc độ quy định trước
        if (direction === 'right')
            bird.offset({
                left: currentLeft - BIRD_SPEED
            });
        else
            bird.offset({
                left: currentLeft + BIRD_SPEED
            });
    }
}

/**
 * @desc class Parachute
 */
function Parachute() {
    var elementParachute;

    this.init = function () {
        this.elementParachute = document.createElement('span');
        var left = Helper.randomPosition().left;
        var top = -PARACHUTE_HEIGHT;

        $(this.elementParachute).addClass('elm-parachute')
            .css({
                width: PARACHUTE_WIDTH + 'px',
                height: PARACHUTE_HEIGHT + 'px',
                left: left + 'px',
                top: top + 'px'
            });
        return this.elementParachute;

    }

    this.run = function () {
        var parachute = $(this.elementParachute);
        var currentTop = parachute.offset().top;

        if (currentTop >= $(GAME_AREA).outerHeight()) {
            parachute.remove();
            return;
        }

        parachute.offset({
            top: currentTop + PARACHUTE_SPEED
        });
    }
}

/**
 * @desc Class Star
 */
function Star() {
    var elementStar;
    this.init = function () {
        this.elementStar = document.createElement('span');
        var left = Helper.randomPosition().left;
        var top = -STAR_HEIGHT;

        $(this.elementStar).addClass('elm-star')
            .css({
                width: STAR_WIDTH + 'px',
                height: STAR_HEIGHT + 'px',
                left: left + 'px',
                top: top + 'px'
            });
        return this.elementStar;
    }
    this.run = function () {
        var star = $(this.elementStar);
        var currentTop = star.offset().top;

        if (currentTop >= $(GAME_AREA).outerHeight()) {
            star.remove();
            return;
        }

        star.offset({
            top: currentTop + STAR_SPEED
        });
    }
}
/**
 * @desc Class Airplane
 */
function Airplane() {
    var elementAirplane;
    this.init = function () {
        this.elementAirplane = document.createElement('span');
        var left = 100;
        var top = 300;
        $(this.elementAirplane).addClass('elm-airplane')
            .css({
                width: AIRPLANE_WIDTH + 'px',
                height: AIRPLANE_HEIGHT + 'px',
                left: left + 'px',
                top: top + 'px'
            });
        return this.elementAirplane;
    }

    /**
     * @desc Di chuyển theo chiều ngang
     * @param {number} distance Khoảng cách cần di chuyển
     */
    this.goX = function (distance) {
        var airplane = $(this.elementAirplane);
        var currentLeft = airplane.offset().left;
        var leftOfGameArea = $(GAME_AREA).offset().left;

        // console.log(leftOfGameArea + " - " + currentLeft);

        var leftGoal = currentLeft + distance;

        if (leftGoal < leftOfGameArea)
            leftGoal = leftOfGameArea;
        else if (leftGoal > ($(GAME_AREA).outerWidth() + leftOfGameArea - AIRPLANE_WIDTH))
            leftGoal = $(GAME_AREA).outerWidth() + leftOfGameArea - AIRPLANE_WIDTH;

        // if (leftGoal < 0)
        //     leftGoal = 0;
        // else if (leftGoal > $(GAME_AREA).outerWidth())
        //     leftGoal = $(GAME_AREA).outerWidth() - AIRPLANE_WIDTH;

        airplane.offset({
            left: leftGoal
        });
    }
    /**
     * @desc Di chuyển theo chiều dọc
     * @param {number} distance Khoảng cách cần di chuyển
     */
    this.goY = function (distance) {
        var airplane = $(this.elementAirplane);
        var currentTop = airplane.offset().top;
        var topOfGameArea = $(GAME_AREA).offset().top;

        var topGoal = currentTop + distance;
        if (topGoal < topOfGameArea)
            topGoal = topOfGameArea;
        else if (currentTop + distance > ($(GAME_AREA).outerHeight() + topOfGameArea - AIRPLANE_HEIGHT))
            topGoal = $(GAME_AREA).outerHeight() + topOfGameArea - AIRPLANE_HEIGHT;

        // if (currentTop + distance < 0)
        //     topGoal = 0;
        // else if (currentTop + distance > $(GAME_AREA).outerHeight())
        //     topGoal = $(GAME_AREA).outerHeight() - AIRPLANE_HEIGHT;

        airplane.offset({
            top: topGoal
        });
    }
}
/**
 * @desc Class Sound
 * @param {string} soundName Tên file âm thanh
 */
function Sound(soundName) {
    var elementSound;

    this.init = function () {
        this.elementSound = document.createElement('audio')
        this.elementSound.src = 'sounds/' + soundName + '.mp3';
        this.elementSound.setAttribute("controls", "none");
        this.elementSound.style.display = "none";
        return this.elementSound;
    }
    /**
     * @desc Tự động phát âm thanh
     */
    this.autoplay = function () {
        this.elementSound.autoplay = true;
    }
    /**
     * @desc Lặp âm thânh
     */
    this.loop = function () {
        this.elementSound.loop = true;
    }
    /**
     * @desc Phát âm thanh
     */
    this.play = function () {
        this.elementSound.play();
    }
    /**
     * @desc Dừng âm thanh
     */
    this.stop = function () {
        this.elementSound.pause();
    }
    /**
     * @desc Tắt tiếng âm thanh
     */
    this.mute = function(isMute) {
        this.elementSound.muted = isMute;
    }
}