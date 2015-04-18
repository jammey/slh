$(document).on("pageshow", "#pageUserCenter", function (event, ui) {
    var $page = $(this);

    $page.find("#liUserCollect").on("click", function () {
        changePage("usercollect.html");
    });
});