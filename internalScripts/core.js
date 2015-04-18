$(function () {
    $.mobile.page.prototype.options.domCache = true;
});

$(document).on("pageinit", "[data-role='page']", function () {
    $.mobile.page.prototype.options.tapToggle = false;

    $("#pageLoadingCount").val("0");

    var $footer = $(this).find("#standardFooter");
    if ($footer.length > 0) {
        var $template = $("#footerTemplate").clone();
        $template.attr("id", "");
        $template.show();
        $footer.append($template);

        //$(this).find("#footerXiaoxi").on("click", function () {
        //});

        $(this).find("#footerSubscribe").on("click", function () {
            checkLoginAndRedirect("usercollect.html");
        });

        $(this).find("#footerUserCenter").on("click", function () {
            checkLoginAndRedirect("usercenter.html");
        });
    }

    if ($(this).attr("id") != "pageIndex") {
        $("#pageIndex").find("#standardFooter").hide();
    }

    //$(this).find("[data-need-calculate='true']").each(function() {
    //    calculateScrollerHeight($(this));
    //});
});

function checkLoginAndRedirect(url) {
    if (checkLogin()) {
        if (!window.localStorage.getItem("c_userNickname") || window.localStorage.getItem("c_userNickname") == "undefined") {
            changePage("userregcomplete.html?url=" + url);
        } else {
            changePage(url);
        }
    } else {
        changePage("userlogin.html");
    }
}

function checkLogin() {
    if (!window.localStorage.getItem("c_userId") || window.localStorage.getItem("c_userId") == "undefined") {
        return false;
    }

    return true;
}

function currentUserId() {
    return window.localStorage.getItem("c_userId");
}

//function callServiceCallBack(buttonIndex) {
//    if (buttonIndex == 2) {
//        window.open('tel:4006997118', '_system');
//    }
//}

//function closePopup(obj, id) {
//    $(obj).parents("[data-role='page']").find("#" + id).popup("close");
//}

function setProfileToLocalStorege(userId, userNumber, userMobile, userNickname) {
    localStorage.setItem("c_userId", userId);
    localStorage.setItem("c_userNumber", userNumber);
    localStorage.setItem("c_userMobile", userMobile);
    localStorage.setItem("c_userNickname", userNickname);
}

function clearLocalStorage() {
    localStorage.removeItem("c_userId");
    localStorage.removeItem("c_userNumber");
    localStorage.removeItem("c_userMobile");
    localStorage.removeItem("c_userNickname");
}


