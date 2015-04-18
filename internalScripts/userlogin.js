$(document).on("pageshow", "#pageUserLogin", function (event, ui) {
    var $page = $(this);
    $page.find("#pageUserLogin_divReg").on("click", function () {
        changePage("userreg.html");
    });

    $page.find("#pageUserLogin_spanLogin").on("click", function () {
        var txtLoginMobile = $page.find("#pageUserLogin_txtLoginMobile");
        var txtLoginPassword = $page.find("#pageUserLogin_txtLoginPassword");

        if (!txtLoginMobile.emptyValidate(PageMessage.MobileRequired)) {
            return;
        }

        if (!txtLoginPassword.emptyValidate(PageMessage.PasswordRequired)) {
            return;
        }

        Ajax.getJson("User/Lgoin", { "mobileNumber": txtLoginMobile.val(), "password": txtLoginPassword.val() }, function (data) {
            if (data.IsSuccess) {
                setProfileToLocalStorege(data.Data.Id, data.Data.UserNumber, data.Data.Mobile, data.Data.Nickname);
                checkLoginAndRedirect("index.html");
            } else {
                Messagebox.popup(data.ErrorMessage.Message);
            }
        });
    });
});