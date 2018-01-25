$(document).ready(function () {
    $('#btn-start').click(function () {
        window.location.href = 'play.html';
    });
    $('#btn-help').click(function () {
        helpDialog.dialog('open');
    });
    var helpDialog = $('#help-dialog').dialog({
        autoOpen: false,
        modal: true,
        width: 600,
        height: 320,
        show: {effect: 'blind', duration:400},
        open: function () {
            $('#btn-help-start').click(function () {
                window.location.href = 'play.html';
            });
            $('#btn-help-close').click(function () {
                helpDialog.dialog('close');
            })
        }
    })
});