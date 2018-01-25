$(document).ready(function () {
    $('#btn-start').click(function () {
        window.location.href = 'play.html';
    });
    $('#btn-help').click(function () {
        stepDialog.dialog('open');
    });
    var stepCurrent = 0;
    var strGuide = [
        '1. Move the airplane using the arrows keys',
        '2. The timer present the time lapsed',
        '3. The fuel counter show the remain fuel',
        '4. During the flight, the aircraft need to avoid the birds that are presented in the sky. If the airplane hit a bird, the game is over',
        '5. During the flight, the aircraft need to collect fuel and stars in the sky',
        '6. You can pause the game clicking in a button pause, or pressing the space bar.',
        '7. Go beyond all limits <br/> Flight in Sky Angel Challenge...'
    ];
    var stepDialog = $('#dialog-help').dialog({
        autoOpen: false,
        width: 350,
        height: 180,
        modal: true,
        show: {effect: 'blind', duration: 400},
        open: function () {
            var content = $('#help-content');
            var btnNext = $('#btn-next');
            content.html(strGuide[stepCurrent]);
            btnNext.html('<span class="wave"></span> Continue').unbind('click');
            btnNext.click(function () {
                content.html(strGuide[++stepCurrent]);
                if (stepCurrent === strGuide.length - 1) {
                    btnNext.html('<span class="wave"></span> Start Game')
                        .click(function () {
                            window.location.href = 'play.html';
                        })
                }
            })
        },
        close: function () {
            stepCurrent = 0;
        }
    });
});