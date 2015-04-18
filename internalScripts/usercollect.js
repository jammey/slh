$(document).on("pageshow", "#pageUserCollect", function (event, ui) {
    var $page = $(this);

    $page.find("#pageUserCollect_collect li").on("click", function () {
        changePage("newsdetail.html");
    });
});