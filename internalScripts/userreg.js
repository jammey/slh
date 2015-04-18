$(document).on("pageshow", "#pageUserReg", function (event, ui) {
    var $page = $(this);
    $page.find("#pageUserReg_btnReg").on("click", function () {
        var txtRegMobile = $("#pageUserReg_txtRegMobile");
        var txtRegPassword = $("#pageUserReg_txtRegPassword");
        var txtRegPasswordConfirm = $("#pageUserReg_txtRegPasswordConfirm");
        var txtRegVcode = $("#pageUserReg_txtRegVcode");

        if (!txtRegMobile.emptyValidate(PageMessage.MobileRequired)) {
            return;
        }

        if (!txtRegMobile.telephoneValidate(PageMessage.MobileInvaild)) {
            return;
        }

        if (!txtRegPassword.emptyValidate(PageMessage.PasswordRequired)) {
            return;
        }

        if (!txtRegPassword.passwordValidate(PageMessage.PasswordInvaild)) {
            return;
        }

        if (!txtRegPasswordConfirm.emptyValidate(PageMessage.NewPasswordRequired)) {
            return;
        }

        if (txtRegPassword.val() != txtRegPasswordConfirm.val()) {
            Messagebox.popup(PageMessage.PasswordsDifferent);
            return;
        }
        
        if (!txtRegVcode.emptyValidate(PageMessage.RegCodeRequired)) {
            return;
        }

        Ajax.getJson("User/Register", { "mobileNumber": txtRegMobile.val(), "password": txtRegPassword.val(), "verificationCode": txtRegVcode.val() }, function (data) {
            if (data.IsSuccess) {
                setProfileToLocalStorege(data.Data.Id, data.Data.UserNumber, data.Data.Mobile, data.Data.Nickname);
                changePage("userregcomplete.html");
            } else {
                Messagebox.popup(data.ErrorMessage.Message);
            }
        });
    });

    $page.find("#pageUserReg_divRegGetCode").on("click", function () {
        var txtRegMobile = $page.find("#pageUserReg_txtRegMobile");

        if (!txtRegMobile.emptyValidate(PageMessage.MobileRequired)) {
            return;
        }

        if (!txtRegMobile.telephoneValidate(PageMessage.MobileInvaild)) {
            return;
        }

        Ajax.getJson("User/GetVerificationCode", { "mobileNumber": txtRegMobile.val() }, function (data) {
            if (data.IsSuccess) {
                var time = 60;
                $("#pageUserReg_divRegGetCode").text("60 秒").addClass("ui-state-disabled").removeClass("getVCode").addClass("countDown");
                var interval = window.setInterval(function () {
                    if (time > 0) {
                        time--;
                        $("#pageUserReg_divRegGetCode").text(time + " 秒");
                    } else {
                        window.clearInterval(interval);
                        interval = null;
                        time = 60;
                        $("#pageUserReg_divRegGetCode").text("获取验证码").removeClass("ui-state-disabled").addClass("getVCode").removeClass("countDown");
                    }
                }, 1000);
            } else {
                Messagebox.popup(data.ErrorMessage.Message);
            }
        });
    });
});