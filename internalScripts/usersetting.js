$(document).on("pageshow", "#pageSetting", function (event, ui) {
    var $page = $(this);
    $page.find("#pageSetting_aLogoff").on("click", function () {
        clearLocalStorage();
        changePage("userlogin.html");
    });
});