/* Events */
$('#modalDelete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var id = button.data('id');
    var section = button.data('section');
    console.log(button);
    console.log(id);
    console.log(section);
    $('#deleteForm').attr("action", `${base_url}admin/${section}/delete/${id}`);
});

$(".modal").on("hidden.bs.modal", function(){
    cleanModal(this.id);
});