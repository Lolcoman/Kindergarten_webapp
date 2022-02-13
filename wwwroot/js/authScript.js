$(function () {
    $('input[name="AdminKey"]').hide();
    $('label[name="AdminLabel"]').hide();

    //show it when the checkbox is clicked
    $('input[name="AdminCheckbox"]').on('click', function () {
        if ($(this).prop('checked')) {
            $('input[name="AdminKey"]').fadeIn();
            $('label[name="AdminLabel"]').fadeIn();
        } else {
            $('input[name="AdminKey"]').hide();
            $('label[name="AdminLabel"]').hide
            $('span[id="AdminKey-error"]').hide();
        }
    });
});