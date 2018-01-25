$(document).ready(function () {
   $('#btn-start').click(function () {
      window.location.href = 'play.html';
   });
   $('#btn-help').click(function () {
      helpDialog.dialog('open');
   });
   var helpDialog = $('#help-dialog').dialog({
       width: 500,
       height: 320,
       modal: true,
       autoOpen: false,
       show: {effect: 'blind', duration: 400},
       open: function () {
           $('#btn-dialog-start').click(function () {
               window.location.href = 'play.html';
           });
           $('#btn-dialog-close').click(function () {
               helpDialog.dialog('close');
           })
       }
   });
});