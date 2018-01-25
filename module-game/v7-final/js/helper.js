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
        return value < 10 ? '0' + value : value
    },
    fuelChange: function (value) {
		fuelCurrent += value;
		if(fuelCurrent > 30) fuelCurrent = 30;
        var percent = (fuelCurrent * 100) / 30 ;
        
        var fuel = -50 + percent;
        FUEL_NUMBER.html(this.fuelFormat(fuelCurrent));
        FUEL_GAUGE.css({transform: 'rotate(' + fuel + 'deg)'})
    },
    isCollision: function (otherObj) {
        var airplaneLeft = AIRPLANE[0].offsetLeft;
        var airplaneTop = AIRPLANE[0].offsetTop;

        var otherLeft = otherObj[0].offsetLeft;
        var otherTop = otherObj[0].offsetTop;
        var otherWidth = otherObj.width();
        var otherHeight = otherObj.height();

        if (otherLeft + otherWidth >= airplaneLeft + STANDARD_ERROR
            && otherLeft <= airplaneLeft + (AIRPLANE_WIDTH * 0.5)- STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + (AIRPLANE_HEIGHT * 0.5) - STANDARD_ERROR)
            return true;
        else if (otherLeft + otherWidth >= airplaneLeft + (AIRPLANE_WIDTH * 0.5) + STANDARD_ERROR
            && otherLeft <= airplaneLeft + AIRPLANE_WIDTH - STANDARD_ERROR
            && otherTop + otherHeight >= airplaneTop
            && otherTop <= airplaneTop + AIRPLANE_HEIGHT - STANDARD_ERROR)
            return true;
        return false;
    },
    sortRanking: function (data) {
        var dataResult =  data.slice().sort(function (a, b) {
            var compare = 0;
            var starA = parseInt(a.stars);
            var timeA = parseInt(a.time);
            var starB = parseInt(b.stars);
            var timeB = parseInt(b.time);
            if(starA > starB) compare = 1;
            else if(starA < starB) compare = -1;
            else {
                if(timeA < timeB) compare = 1;
                else if (timeA > timeB) compare = -1;
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
            if (data[i - 1].stars === data[i].stars && data[i - 1].time === data[i].time){
                data[i]['position'] = data[i - 1]['position'];
                position++;
            }
            else
                data[i]['position'] =  ++position;
        }
        return data;
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
    setHash: function (sizeTimer, sizeStarCounter, sizeFuelCounter, sizeRanking, isMuted) {
        window.location.hash = 'sizeTimer='+ sizeTimer +'&sizeStarCounter='+ sizeStarCounter +'&sizeFuelCounter='+ sizeFuelCounter +'&sizeRanking='+ sizeRanking +'&isMuted='+ isMuted;
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