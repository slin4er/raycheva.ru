const disabledDate = ['01.09.2021', '02.09.2021', '03.09.2021', '04.09.2021', '05.09.2021', '06.09.2021', '07.09.2021', '08.09.2021', '09.09.2021', '10.09.2021'];
$('#datetimepicker').datetimepicker({
    format:'d.m.Y H:i',
    allowTimes:[
        '9:00', '9:30', '10:00', '10:30', '11:00',
        '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ],
    minDate: 0,
    dayOfWeekStart: 1,
    defaultTime: '9:00',
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


