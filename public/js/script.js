const disabledDate = ['12.09.2021', '19.09.2021', '26.09.2021', '3.10.2021',
                      '10.10.2021', '17.10.2021', '24.10.2021', '31.10.2021',
                      '07.11.2021', '14.11.2021', '21.11.2021', '28.11.2021',
                      '05.12.2021', '12.12.2021', '19.12.2021', '26.12.2021'];
$('#datetimepicker').datetimepicker({
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
                    minlength: 4,
                    trim: true
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


