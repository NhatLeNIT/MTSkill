/**
 * @desc Helper Object chứa các function giúp xử lý trong quá trình xây dựng các component
 */
var Helper = {
    /**
     * @desc Random number from 1 to number
     * @param {number} number số giới hạn khoảng random
     */
    randomNumber: function (number) {
        return Math.floor(Math.random() * number) + 1;
    },

    /**
     * @desc Random vị trí bất kỳ nằm trong khoảng của game area
     * @return {Object} đối tượng chứa left và top
     */
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
     * @param {number} value số fuel cần thay đổi
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

        // Thay background của fuel counter theo percent fuel
        $(FUEL_COUNTER).css({
            background: 'url(images/fuel-counter/fuel-counter-' + imageIndex + '.png)',
            backgroundSize: 'cover'
        })
    },

    /**
     * @desc Định dạng thời gian
     * @param {number} time số giây cần format
     * @return {string} chuỗi định dạng ii:ss
     */
    timeFormat: function (time) {
        var minute = Math.floor(time / 60);
        var second = time % 60;
        var strMinute, strSecond;
        strSecond = second < 10 ? "0" + second : second;
        strMinute = minute < 10 ? "0" + minute : minute;
        return strMinute + ":" + strSecond;
    },

    /**
     * @desc Kiểm tra xem 2 đối tượng va chạm nhau không
     * @param {Object} airplane Đối tượng airplane
     * @param {Object} otherObj Đối tượng cần kiểm tra với airplane
     * @return {boolean} va cham = true và ngược lại
     */
    isCollision: function (airplane, otherObj) {
        var airplaneObj = $(airplane);
        var otherObj = $(otherObj);

        // Object 1
        var leftAirplane = airplaneObj.offset().left;
        var topAirplane = airplaneObj.offset().top;
        var widthAirplane = airplaneObj.width();
        var heightAirplane = airplaneObj.height();


        // Object 2
        var leftOtherObj = otherObj.offset().left;
        var topOtherObj = otherObj.offset().top;
        var widthOtherObj = otherObj.width();
        var heightOtherObj = otherObj.height();

        // console.log("Airplane " + leftAirplane + " - " + topAirplane + " - " + widthAirplane + " - " + heightAirplane);
        // console.log(otherObj);
        // console.log(leftOtherObj + " - " + topOtherObj + " - " + widthOtherObj + " - " + heightOtherObj);

        // Tuowng đối
        // if (leftOtherObj + widthOtherObj - STANDARD_ERROR >= leftAirplane && leftOtherObj <= leftAirplane + widthAirplane - STANDARD_ERROR && topOtherObj + heightOtherObj - STANDARD_ERROR >= topAirplane && topOtherObj <= topAirplane + heightAirplane - STANDARD_ERROR)
        //     return true;

        // Nửa máy bay bên trái
        if (leftOtherObj + widthOtherObj - STANDARD_ERROR >= leftAirplane + STANDARD_ERROR && leftOtherObj <= leftAirplane + (widthAirplane / 2) - STANDARD_ERROR && topOtherObj + heightOtherObj - STANDARD_ERROR >= topAirplane + STANDARD_ERROR && topOtherObj <= topAirplane + (heightAirplane * 3 / 5) - STANDARD_ERROR)
            return true;
        // Nửa máy bay bên phải
        if (leftOtherObj + widthOtherObj - STANDARD_ERROR >= leftAirplane + (widthAirplane / 2) && leftOtherObj <= leftAirplane + widthAirplane - STANDARD_ERROR && topOtherObj + heightOtherObj - STANDARD_ERROR >= topAirplane && topOtherObj <= topAirplane + heightAirplane - STANDARD_ERROR)
            return true;
        return false;
    },

    /**
     * @desc Sắp xếp ranking theo số sao và thời gian giảm dần
     */
    sortRanking: function (arrayRanking) {
        var arrResult = arrayRanking.slice().sort(function (a, b) {
            var compare = 0;
            var starsA = parseInt(a.stars);
            var starsB = parseInt(b.stars);
            var timeA = parseInt(a.time);
            var timeB = parseInt(b.time);

            if (starsA > starsB) compare = 1;
            else if (starsA < starsB) compare = -1;
            else {
                if (timeA < timeB) compare = 1;
                else if (timeA > timeB) compare = -1;
            }
            return compare * -1;
        })
        return arrResult;
    },

    /**
     * @desc Lấy tham số cấu hình trên url
     */
    getHash: function () {
        var strParam = location.hash.substr(1); // lấy argument trên url xuống
        var arrParam = strParam.split('&'); // tách thành mảng theo dấu &
        var obj = {};
        $.each(arrParam, function (i, val) {
            var data = val.split('=');
            obj[data[0]] = data[1];
        });
        return obj;
    },

    /**
     * @desc Set tham số cấu hình trên url
     */
    setHash: function (sizeTimer, sizeStar, sizeFuel, sizeRanking, isMuted) {
        window.location.hash = 'sizeTimer=' + sizeTimer + '&sizeStar=' + sizeStar + '&sizeFuel=' + sizeFuel + '&sizeRanking=' + sizeRanking + '&isMuted=' + isMuted;
    },

    /**
     * @desc Set font size cho timer, fuel counter, star counter, list ranking
     */
    setSize: function(sizeTimer, sizeStar, sizeFuel, sizeRanking) {
        $('#timer').css('fontSize',sizeTimer);
        $('#fuel-counter').css('fontSize',sizeStar);
        $('#star-counter').css('fontSize',sizeFuel);
        $('#list-rank').css('fontSize',sizeRanking);
    }
}