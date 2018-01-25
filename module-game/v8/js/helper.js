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
    fuelFormat: function (fuel) {
        return fuel < 10 ? '0' + fuel : fuel;
    },
    fuelChange: function (value) {
        fuelCurrent += value;
        if (fuelCurrent >= FUEL_MAX) fuelCurrent = FUEL_MAX;
        var percent = (fuelCurrent * 100) / FUEL_MAX;
        var deg = -50 + percent;
        FUEL_NUMBER.html(this.fuelFormat(fuelCurrent));
        FUEL_GAUGE.css({transform: 'rotate(' + deg + 'deg)'});
    },
    isCollision: function (other) {
        var airplaneLeft = AIRPLANE[0].offsetLeft;
        var airplaneTop = AIRPLANE[0].offsetTop;
        var airplaneWidth = AIRPLANE.width();
        var airplaneHeight = AIRPLANE.height();

        var otherLeft = other[0].offsetLeft;
        var otherTop = other[0].offsetTop;
        var otherWidth = other.width();
        var otherHeight = other.height();
        if (otherLeft + otherWidth >= airplaneLeft + STANDARD_ERROR
            && otherLeft <= airplaneLeft + (airplaneWidth * 0.5) - STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + (airplaneHeight * 0.5)- STANDARD_ERROR)
            return true;
        else if (otherLeft + otherWidth >= airplaneLeft + (airplaneWidth * 0.5) + STANDARD_ERROR
            && otherLeft <= airplaneLeft + airplaneWidth- STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + airplaneHeight - STANDARD_ERROR)
            return true;
        return false;
    },
    sortRanking: function (data) {
        var dataResult = data.slice().sort(function (a, b) {
            var starA = parseInt(a.stars);
            var starB = parseInt(b.stars);
            var timeA = parseInt(a.time);
            var timeB = parseInt(b.time);
            var compare = 0;
            if(starA > starB) compare = 1;
            else if(starA < starB) compare = -1;
            else {
                if(timeA < timeB) compare = 1;
                else if(timeA > timeB) compare = -1;
            }
            return compare * -1;
        });
        return this.sortPosition(dataResult);
    },
    sortPosition: function (data) {
        var length = data.length;
        var position = 1;
        data[0]['position'] = position;
        for (var i = 1; i < length; i++) {
            if(data[i - 1]['stars'] === data[i]['stars'] && data[i - 1]['time'] === data[i]['time']) {
                data[i]['position'] = data[i - 1]['position'];
                position++;
            } else {
                data[i]['position'] = ++position;
            }
        }
        return data;
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