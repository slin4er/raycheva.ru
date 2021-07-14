const disabledDate = ['23.07.2021','24.07.2021','25.07.2021','26.07.2021','27.07.2021','28.07.2021','29.07.2021','30.07.2021','31.07.2021','01.08.2021','02.08.2021'];
$('#datetimepicker').datetimepicker({
    format:'d.m.Y H:i',
    allowTimes:[
        '9:00', '9:30', '10:00', '10:30', '11:00',
        '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ],
    minDate: 0,
    defaultTime: '9:00',
    disabledDates: disabledDate, formatDate:'d.m.Y'
});
$('#datetimepicker1').datetimepicker({
    format:'d.m.Y',
    timepicker: false,
    minDate: 0,
    disabledDates: disabledDate, formatDate:'d.m.Y'
});
$.datetimepicker.setLocale('ru');
$(document).ready(function() {
    function validateForms(form) {
        $(form).validate({
            rules: {
                name: {
                    required: true,
                    minlength: 4
                },
                phone: "required",
                check: "required"
            },
            messages: {
                name: {
                    required: "Введите свое имя",
                    minlength: jQuery.validator.format("Введите {0} символа!")
                },
                phone: "Введите свой номер телефона",
                check: "Вы не согласились!"
            }
        });
    }
    validateForms('#reg-form');
    /* маска ввода , этот плагин не воспринимает type в html*/
    $('input[name=phone]').mask("+373(999)99-999");
});


