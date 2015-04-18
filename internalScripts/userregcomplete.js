$(document).on("pageshow", "#pageUserRegComplete", function (event, ui) {
    var $page = $(this);

    $page.find("#pageUserRegComplete_txtId").val(window.localStorage.getItem("c_userNumber"));

    Ajax.getJson("User/RegisterInit", {}, function (data) {
        if (data.IsSuccess) {
            var subAssociations = data.Data.SubAssociation;
            $page.find("#pageUserRegComplete_selSubAssociation").append("<option selected='selected' value='0'>请选择所属分会</option>");
            for (var i = 0; i < subAssociations.length; i++) {
                $page.find("#pageUserRegComplete_selSubAssociation").append("<option value='" + subAssociations[i].Id + "'>" + subAssociations[i].SubAssociationName + "</option>");
            }
            $page.find("#pageUserRegComplete_selSubAssociation").selectmenu("refresh");

            var companyType = data.Data.CompanyType;
            $page.find("#pageUserRegComplete_selCompanyType").append("<option selected='selected' value='0'>请选择企业类型</option>");
            for (var i = 0; i < companyType.length; i++) {
                $page.find("#pageUserRegComplete_selCompanyType").append("<option value='" + companyType[i].Id + "'>" + companyType[i].TypeName + "</option>");
            }
            $page.find("#pageUserRegComplete_selCompanyType").selectmenu("refresh");
        } else {
            Messagebox.popup(data.ErrorMessage.Message);
        }
    });

    $page.find("#pageUserRegComplete_btnSubmit").on("click", function () {
        var txtNickName = $page.find("#pageUserRegComplete_txtNickName");
        var txtGender = $page.find("input[name='pageUserRegComplete_txtGender']:checked");
        var txtCompany = $page.find("#pageUserRegComplete_txtCompany");
        var txtTitle = $page.find("#pageUserRegComplete_txtTitle");
        var txtWebsite = $page.find("#pageUserRegComplete_txtWebsite");
        var selSubAssociation = $page.find("#pageUserRegComplete_selSubAssociation");
        var selCompanyType = $page.find("#pageUserRegComplete_selCompanyType");

        if (!txtNickName.emptyValidate(PageMessage.NickNameRequired)) {
            return;
        }

        if (!txtCompany.emptyValidate(PageMessage.CompanyRequired)) {
            return;
        }

        if (!txtTitle.emptyValidate(PageMessage.TitleRequired)) {
            return;
        }

        if (!txtWebsite.emptyValidate(PageMessage.WebsiteRequired)) {
            return;
        }

        if (selCompanyType.val() == 0) {
            Messagebox.popup(PageMessage.CompanyTypeRequired);
            return;
        }

        if (selSubAssociation.val() == 0) {
            Messagebox.popup(PageMessage.SubAssociationRequired);
            return;
        }

        var gender = "true";
        if (txtGender.val() == 0) {
            gender = "false";
        }

        var redirectUrl = $.getUrlParam("url");
        Ajax.getJson("User/UpdateProfile", {
            "userId": currentUserId(), "nickName": txtNickName.val(), "gender": gender, "company": txtCompany.val(),
            "title": txtTitle.val(), "website": txtWebsite.val(), "companyType": selCompanyType.val(), "subAssociation": selSubAssociation.val()
        }, function (data) {
            if (data.IsSuccess) {
                setProfileToLocalStorege(data.Data.Id, data.Data.UserNumber, data.Data.Mobile, data.Data.Nickname);
                if (!redirectUrl) {
                    changePage("index.html");
                } else {
                    changePage(redirectUrl);
                }
            } else {
                Messagebox.popup(data.ErrorMessage.Message);
            }
        });
    });
});