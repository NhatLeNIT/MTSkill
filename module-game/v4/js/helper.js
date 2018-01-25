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
    fuelFormat: function (value) {
        return value < 10 ? '0' + value : value;
    },
    fuelChange: function (value) {
        var percent = (value + fuelCurrent) / (100 + value + fuelCurrent) * 100;
        fuelCurrent += value;
        var fuelGauge = -50 + percent;
        FUEL_GAUGE.css('transform', 'rotate(' + fuelGauge + 'deg)');
        FUEL_NUMBER.html(this.fuelFormat(fuelCurrent));
    },
    isCollision: function (otherObj) {
        var airplaneLeft = AIRPLANE[0].offsetLeft;
        var airplaneTop = AIRPLANE[0].offsetTop;
        var airplaneWidth = AIRPLANE.width();
        var airplaneHeight = AIRPLANE.height();

        var otherLeft = otherObj[0].offsetLeft;
        var otherTop = otherObj[0].offsetTop;
        var otherWidth = otherObj.width();
        var otherHeight = otherObj.height();

        if (otherLeft + otherWidth >= airplaneLeft + STANDARD_ERROR
            && otherLeft <= airplaneLeft + (airplaneWidth * 0.65)- STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop + STANDARD_ERROR
            && otherTop <= airplaneTop + (airplaneHeight * 0.5) - STANDARD_ERROR)
            return true;
        else if (otherLeft + otherWidth >= airplaneLeft + (airplaneWidth * 0.65) + STANDARD_ERROR
            && otherLeft <= airplaneLeft + airplaneWidth - STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop + STANDARD_ERROR
            && otherTop <= airplaneTop + airplaneHeight - STANDARD_ERROR)
            return true;
        return false;
    },
    getHash: function () {
        var hash = location.hash.substr(1);
        var params = hash.split('&');
        var param = {};
        $.each(params, function (i, val) {
            var temp = val.split('=');
            param[temp[0]] = temp[1];
        });
        return param;
    },
    setHash: function (sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking, isMuted) {
        location.hash = 'sizeTimer=' + sizeTimer + '&sizeStarCounter=' + sizeStarCounter + '&sizeFuelCounter=' + sizeFuelCounter + '&sizeRanking=' + sizeRanking + '&isMuted=' + isMuted;
    },
    sortRanking: function (data) {
        return data.slice().sort(function (a, b) {
            var starA = a.stars;
            var starB = b.stars;
            var timeA = a.time;
            var timeB = b.time;
            var compare = 0;
            if(starA > starB) compare = 1;
            else if(starA < starA) compare = -1;
            else {
                if(timeA < timeB) compare = 1;
                else if(timeA > timeB) compare = -1;
            }
                return compare * -1;
        })
    }
};
function Sound(soundName) {
    this.elm = document.createElement('audio');
    this.elm.src = 'sound/'+ soundName + '.mp3';
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
    this.muted = function (isMuted) {
        this.elm.muted = isMuted;
    }
}