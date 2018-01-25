var Helper = {
    randomNumber: function (number) {
        return Math.floor(Math.random() * number) + 1;
    },
    randomPosition: function () {
        return {
            left: this.randomNumber(GAME_AREA_WIDTH),
            top: this.randomNumber(GAME_AREA_HEIGHT)
        }
    },
    timeFormat: function (time) {
        var second = time % 60;
        var minute = Math.floor(time / 60);
        var strSecond = second < 10 ? '0' + second : second;
        var strMinute = minute < 10 ? '0' + minute : minute;
        return strMinute + ':' + strSecond;
    },
    fuelChange: function (value) {
        var percent = (fuelCurrent + value) / (fuelCurrent + value + 100) * 100;
        fuelCurrent += value;
        var fuel = -50 + percent;
        FUEL_NUMBER.html(fuelCurrent);
        FUEL_GAUGE.css({transform: 'rotate(' + fuel + 'deg)'})
    },
    isCollision: function (otherObj) {
        var airplaneLeft = AIRPLANE[0].offsetLeft;
        var airplaneTop = AIRPLANE[0].offsetTop;

        var otherLeft = otherObj[0].offsetLeft;
        var otherTop = otherObj[0].offsetTop;
        var otherWidth = otherObj.width();
        var otherHeight = otherObj.height();

        if (otherLeft + otherWidth >= airplaneLeft
            && otherLeft <= airplaneLeft + AIRPLANE_WIDTH
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + AIRPLANE_HEIGHT)
            return true;
        return false;
    },
    sortRanking: function (data) {
        return data.slice().sort(function (a, b) {
            var compare = 0;
            var starA = a.stars;
            var timeA = a.time;
            var starB = b.stars;
            var timeB = b.time;
            if(starA > starB) compare = 1;
            else if(starA < starB) compare = -1;
            else {
                if(timeA < timeB) compare = 1;
                else if (timeA < timeB) compare = -1;
            }
            return compare * -1;
        });
    }
};

function Sound(soundName) {
    this.elm = document.createElement('audio');
    this.elm.src = 'sound/' + soundName + '.mp3';
    this.elm.setAttribute('controls', 'none');
    this.elm.style.display = 'none';

    this.autoplay = function () {
        this.elm.autoplay = true;
        return this;
    };
    this.loop = function () {
        this.elm.loop = true;
    };
    this.play = function () {
        this.elm.play();
        return this;
    };
    this.pause = function () {
        this.elm.pause();
    };
    this.muted = function (isMute) {
        this.elm.muted = isMute;
    }
}