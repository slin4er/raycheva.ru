const disabledDate = ['13.01.2022'];
$('#datetimepicker').datetimepicker({
    disabledWeekDays: [0],
    format:'d.m.Y H:i',
    allowTimes:[
        '9:00', '9:30', '10:00', '10:30', '11:00',
        '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00'
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
                check: "required",
                phoneCheck: "required"
            },
            messages: {
                name: {
                    required: "Введите свое имя",
                    minlength: jQuery.validator.format("Введите {0} символа!")
                },
                phone: "Введите свой номер телефона",
                check: "Вы не согласились!",
                phoneCheck: "Введите свой номер телефона"
            }
        });
    }
    validateForms('#reg-form');
    /* маска ввода , этот плагин не воспринимает type в html*/
    // $('input[name=phone]').mask("+373(999)99-999");
});


