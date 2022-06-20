$(document).ready(function() {
    $.getJSON('/rest/users', function (json_data) {

        var table_obj = $('#usersTable');
        $.each(json_data, function (index, result) {
            var table_row = generatetr(result);
            table_obj.append(table_row);
        })
    });
});


function generatetr(result) {
    var table_row = $('<tr id="truser' + result.id + '">', {});
    var table_cell1 = $('<td>', {html: result.id});
    var table_cell2 = $('<td>', {html: result.username});
    var table_cell3 = $('<td>', {html: result.surname});
    var table_cell4 = $('<td>', {html: result.age});
    var table_cell5 = $('<td>', {html: result.email});
    var table_cell6 = $('<td>', {html: result.roleString});
    var table_cell7 = $('<td>', {html: '<a href="#" id="editUser'   + result.id + '" data-index="' + result.id + '" class="btn btn-primary">Edit</a>'});
    var table_cell8 = $('<td>', {html: '<a href="#" id="deleteUser' + result.id + '" data-index="' + result.id + '" class="btn btn-danger">Delete</a>'});

    table_row.append(table_cell1, table_cell2, table_cell3, table_cell4, table_cell5, table_cell6, table_cell7, table_cell8);
    return table_row;
}
function resetForm($form)
{
    $form.find('input:text, input:password, select').val('');
}

function populateForm($form, data)
{
    resetForm($form);
    $.each(data, function(key, value) {

        if(key == "roles") {
            $('#userrole').prop('selected', false);
            $.each(value, function(key1, value1) {
                $('#' + value1.name).prop('selected', true);
            });
        }

        var $ctrl = $form.find('[name='+key+']');
        if ($ctrl.is('select')){
            $('option', $ctrl).each(function() {
                if (this.value == value)
                    this.selected = true;
            });
        } else {
            switch($ctrl.attr("type")) {
                case "text":
                case "hidden":
                case "number":
                case "email":
                    $ctrl.val(value);
                    break;
                case "password":
                    $ctrl.val('default_pass');
                    break;
            }
        }
    });
}

$('#usersTable').on('click', "a[id*='deleteUser']", function(e) {

    $('#form-label').text("Delete user");
    $('#modal-method').attr("value","");

    $('#modal-form').find("select, input").each(function() {
        $(this).attr('disabled', true);
    });

    var number = parseInt(e.target.getAttribute('data-index'), 10);

    $('#modal-form-button').text('Delete').addClass('btn-danger').removeClass('btn-success').removeClass('btn-primary');

    $.getJSON('/rest/users/'+number, function (json_data) {
        populateForm($('#modal-form'), json_data);
        $('#modal-window').modal('show');
    });

    $('#modal-window').on('click','#modal-form-button', function () {
            $.ajax({
                url: '/users/'+number,
                type: 'post',
                data: { id: number, _method: 'delete' },
                dataType : "json",
                success: function(result) {
                    $('#truser' + number).closest('tr').remove();
                    $('#modal-window').modal('hide');
                }
        })
    });

}).on('click', "a[id*='editUser']", function(e) {

    $('#form-label').text("Edit user");
    $('#modal-method').attr("value","PATCH");
    $('#modal-form').find("select, input").each(function() {
        $(this).attr('disabled', false);});
    $('#userid').attr('disabled', true);

    var number = parseInt(e.target.getAttribute('data-index'), 10);

    $('#modal-form-button').text('Edit').addClass('btn-primary').removeClass('btn-success').removeClass('btn-danger');

    $.getJSON('/rest/users/'+number, function (json_data) {
        populateForm($('#modal-form'), json_data);
        $('#modal-window').modal('show');
    });

    $('#modal-window').on('click','#modal-form-button', function () {
        $.ajax({
            url: '/rest/' + number,
            type: 'post',
            data: $("#modal-form").serialize(),
            dataType : "json",
            success: function(result) {
                $('#modal-window').modal('hide');
                var gentr = generatetr(result);
                $('#truser' + number).replaceWith(gentr);
            }
        })
    });
});


$('#new-user-div').on('click', "#new-user-button", function(e) {
    alert("asdfasdfasdf");
    $.ajax({
        url: '/rest',
        type: 'post',
        data: $("#new-user-form").serialize(),
        dataType : "json",
        success: function(result) {
            alert("ok");
            var gentr = generatetr(result);
            $('#usersTable').append(gentr);
        }
    })
});