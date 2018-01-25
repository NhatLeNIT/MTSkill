$(document).ready(function () {
    $('#btn-start').click(function () {
        window.location.href = 'play.html';
    });

    $('#btn-guide').click(function () {
        step.dialog('open');
    });

    var stepCurrent = 0;
    var strGuide = [
        '1. Move the airplane using the arrows keys.',
        '2. The timer present the time lapsed.',
        '3. The fuel counter show the remain fuel.',
        '4. During the flight, the aircraft need to avoid the birds that are presented in the sky. If the airplane hit a bird, the game is over.',
        '5. During the flight, the aircraft need to collect fuel and stars in the sky',
        '6. You can pause the game clicking in a button pause, or pressing the space bar.',
        '7. Go beyond all limits. <br> Flight in Sky Angel Challenge...'
    ];

    var step = $('#dialog-step').dialog({
        autoOpen: false,
        height: 180,
        modal: true,
        width: 350,
        show: {
            effect: "blind",
            duration: 400
        },
        open: function () {
            var contentObj = $('#dialog-step p');
            var btnObj = $('#dialog-step button');
            contentObj.html(strGuide[stepCurrent]);
            btnObj.html('<span class="wave"> </span> Next Step').unbind('click');

            $('.btnNext').click(function () {
                contentObj.html(strGuide[++stepCurrent]);
                btnObj.html('<span class="wave"> </span> Next Step');

                if(stepCurrent === strGuide.length - 1) {
                    stepCurrent = 0;
                    btnObj.html('<span class="wave"> </span> Star Game')
                        .click(function () {
                            window.location.href = 'play.html';
                            step.dialog('close');
                        });
                }
            })
        },
        close: function () {
            stepCurrent = 0;
        }
    })
});