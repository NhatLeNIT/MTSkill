var Helper = {
    /**
     * Dùng để random số từ 1 đến number
     * @param number
     * @returns {number}
     */
    randomNumber: function (number) {
        return Math.floor(Math.random() * number) + 1;
    },
    /**
     * Dùng để random vị trí
     * @returns {{left: (*|number), top: (*|number)}}
     */
    randomPosition: function () {
        return {
            left: this.randomNumber(GAME_AREA_WIDTH),
            top: this.randomNumber(GAME_AREA_HEIGHT)
        }
    },
    /**
     * Dùng để đinh dạng thời gian theo format II:SS
     * @param time
     * @returns {string}
     */
    timeFormat: function (time) {
        var second = time % 60;
        var minute = Math.floor(time / 60);
        var strSecond = second < 10 ? '0' + second : time;
        var strMinute = minute < 10 ? '0' + minute : time;
        return strMinute + ':' + strSecond;
    },
    /**
     * Dùng để định dạng số lượng fuel
     * @param fuel
     * @returns {string}
     */
    fuelFormat: function (fuel) {
        return fuel < 10 ? '0' + fuel : fuel;
    },
    /**
     * Dùng để thay đối fuel khi thu thập được nhiên liệu và điều chỉnh kim xăng
     * @param value
     */
    fuelChange: function (value) {
        fuelCurrent += value;
        if (fuelCurrent > 30) fuelCurrent = 30;
        var percent = (fuelCurrent * 100) / 30;
        var deg = -50 + percent;
        FUEL_NUMBER.html(this.fuelFormat(fuelCurrent));
        FUEL_GAUGE.css({transform: 'rotate(' + deg + 'deg)'});
        if (fuelCurrent <= 0) {
            isRunning = false;
            backgroundSound.pause();
            finishSound.play().loop();
            formDialog.dialog('open');
        }
    },
    /**
     * Kiểm tra xem máy bay có va chạm với đối tượng khác không
     * @param otherObj
     * @returns {boolean}
     */
    isCollision: function (otherObj) {
        var airplaneLeft = AIRPLANE[0].offsetLeft;
        var airplaneTop = AIRPLANE[0].offsetTop;

        var otherLeft = otherObj[0].offsetLeft;
        var otherTop = otherObj[0].offsetTop;
        var otherWidth = otherObj.width();
        var otherHeight = otherObj.height();

        if (otherLeft + otherWidth >= airplaneLeft
            && otherLeft <= airplaneLeft + (AIRPLANE_WIDTH * 0.5)
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + (AIRPLANE_HEIGHT * 0.5) )
            return true;
        else if (otherLeft + otherWidth >= airplaneLeft + (AIRPLANE_WIDTH * 0.5)
            && otherLeft <= airplaneLeft + AIRPLANE_WIDTH
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + AIRPLANE_HEIGHT)
            return true;
        return false;
    },
    /**
     * Sort dữ liệu xếp hạng
     * @param data
     * @returns {*}
     */
    sortRanking: function (data) {
        var dataResult = data.slice().sort(function (a, b) {
            var starA = parseInt(a.stars);
            var starB = parseInt(b.stars);
            var timeA = parseInt(a.time);
            var timeB = parseInt(b.time);
            var compare = 0;
            if(starA > starB) compare = 1;
            else if( starA < starB) compare = -1;
            else {
                if(timeA < timeB) compare = 1;
                else if(timeA > timeB) compare = -1;
            }
            return compare * -1;
        });
        return this.sortPosition(dataResult);
    },
    /**
     * Sắp xếp vị trí của các người chơi
     * @param data
     * @returns {*}
     */
    sortPosition: function (data) {
        var length = data.length;
        var position = 1;
        data[0]['position'] = position;
        for (var i = 1; i < length; i++) {
            if(data[i - 1]['stars'] === data[i]['stars'] && data[i - 1]['time'] === data[i]['time']) {
                data[i]['position'] = data[i - 1]['position'];
                position++;
            } else data[i]['position'] = ++position;
        }
        return data;
    }
};

/**
 * Dùng để quản lý đối tượng âm thanh trong game
 * @param soundName
 * @constructor
 */
function Sound(soundName) {
    this.elm = document.createElement('audio');
    this.elm.src = 'sound/' + soundName + '.mp3';
    this.elm.setAttribute('controls', 'none');
    this.elm.style.display = 'none';

    this.autoplay = function () {
        this.elm.autoplay = true;
        return this;
    };
    this.play = function () {
        this.elm.play();
        return this;
    };
    this.loop = function () {
        this.elm.loop = true;
    };
    this.pause = function () {
        this.elm.pause();
    };
    this.muted = function (isMuted) {
        this.elm.muted = isMuted;
    }
}