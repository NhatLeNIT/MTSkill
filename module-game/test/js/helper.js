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
        var strSecond, strMinute;
        strSecond = second < 10 ? '0' + second : second;
        strMinute = minute < 10 ? '0' + minute : minute;
        return strMinute + ':' + strSecond;
    },
    isCollision: function (otherObj) {
        var leftAirplane = AIRPLANE.position().left;
        var topAirplane = AIRPLANE.position().top;

        var leftOther = otherObj.position().left;
        var topOther = otherObj.position().top;
        var widthOther = otherObj.width();
        var heightOther = otherObj.height();

        if ((leftOther + widthOther >= leftAirplane + STANDARD_ERROR)
            && (leftOther <= leftAirplane + (AIRPLANE_WIDTH * 0.65)- STANDARD_ERROR)
            && (topOther + heightOther >= topAirplane + STANDARD_ERROR)
            && (topOther <= topAirplane + (AIRPLANE_HEIGHT * 0.5) - STANDARD_ERROR))
            return true;
        else if ((leftOther + widthOther >= leftAirplane + (AIRPLANE_WIDTH * 0.65) + STANDARD_ERROR)
            && (leftOther <= leftAirplane + AIRPLANE_WIDTH - STANDARD_ERROR)
            && (topOther + heightOther >= topAirplane + STANDARD_ERROR)
            && (topOther <= topAirplane + AIRPLANE_HEIGHT - STANDARD_ERROR))
            return true;
        return false;
    },
    fuelFormat: function (fuel) {
        return fuel < 10 ? '0' + fuel : fuel;
    },
    changeFuelValue: function (fuelAdd) {
        var fuelPercent = (fuelCurrent + fuelAdd) / (100 + fuelCurrent + fuelAdd) * 100;
        fuelCurrent += fuelAdd;
        var fuelGauge = -50 + fuelPercent;
        FUEL_COUNTER_GAUGE.css({transform: 'rotate(' + fuelGauge + 'deg)'})
    },
    sortRanking: function (data) {
        return data.slice().sort(function (a, b) {
            var compare = 0;
            var starA = parseInt(a.stars);
            var starB = parseInt(b.stars);
            var timeA = parseInt(a.time);
            var timeB = parseInt(b.time);
            if (starA > starB) compare = 1;
            else if (starA < starB) compare = -1;
            else {
                if (timeA < timeB) compare = 1;
                else if (timeA < timeB) compare = -1;
            }
            return compare * -1;
        });
    },
    getHash: function () {
        var strHash = window.location.hash.substr(1);
        var params = strHash.split('&');
        var param = {};
        $.each(params, function (i, val) {
            var temp = val.split('=');
            param[temp[0]] = temp[1];
        });
        return param;
    },
    setHash: function (sizeTimer, sizeStar, sizeFuel, sizeRanking, isMuted) {
        window.location.hash = 'sizeTimer='+ sizeTimer +'&sizeStar='+ sizeStar +'&sizeFuel='+ sizeFuel +'&sizeRanking='+ sizeRanking +'&isMuted='+ isMuted;
    }
};

function Sound(soundName) {
    this.elmSound = document.createElement('audio');
    this.elmSound.src = 'sound/' + soundName + '.mp3';
    this.elmSound.setAttribute('controls', 'none');
    this.elmSound.style.display = 'none';

    this.autoplay = function () {
        this.elmSound.autoplay = true;
        return this;
    };
    this.loop = function () {
        this.elmSound.loop = true;
    };
    this.play = function () {
        this.elmSound.play();
        return this;
    };
    this.pause = function () {
        this.elmSound.pause();
    };
    this.mute = function (isMuted) {
        this.elmSound.muted = isMuted;
    }
}