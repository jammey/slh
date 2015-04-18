window.deviceReady = false;

document.addEventListener("deviceready", onDeviceReady, false);

//function onGeolocationSuccess(position) {
//    var x = position.coords.longitude;
//    var y = position.coords.latitude;

//    sessionStorage.setItem("c_gps-location-x", x);
//    sessionStorage.setItem("c_gps-location-y", y);
//}
//function onGeolocationError(error) {
//    //Messagebox.popup(error);
//    Messagebox.popup("Please enable the Location Service");
//}

// device APIs are available
function onDeviceReady() {
    window.deviceReady = true;
    navigator.splashscreen.hide();
    if (window.plugins&&window.plugins.jPushPlugin) {
        window.plugins.jPushPlugin.init();
        window.plugins.jPushPlugin.setDebugMode(true);
    }

    document.addEventListener("backbutton", function (e) {
        if ($.mobile.activePage.is('#pageIndex')) {
            e.preventDefault();
            Messagebox.confirm("请问是否退出应用？", function (buttonIndex) {
                if (buttonIndex == 2) {
                    navigator.app.exitApp();
                }
            }, "关闭应用", ['还想看看', '我要走了']);
        }
        else {
            navigator.app.backHistory();
        }
    }, false);

    //iOS7 status bar not overlays web view.
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByHexString("#0689C7");

    

    if (!localStorage.getItem("c_device_platform")) {
        localStorage.setItem("c_device_platform", window.device.platform);
    }

    //GetLatestVersion();

    checkConnection();
}

//function GetLatestVersion() {
//    Ajax.getJson("GetLatestVersion", { appType: 0, platform: localStorage.getItem("c_device_platform") == "Android" ? 0 : 1 }, function (data) {
//        if (data.IsSuccess) {
//            var version = data.Data.Version;
//            if (version != "" && version != Config.appVersion) {
//                var log = "Version " + version + "\n" + data.Data.Upgrade_Log;
//                Messagebox.confirm(log, function (buttonIndex) {
//                    if (buttonIndex == 2) {
//                        window.open(data.Data.DownloadUrl, '_system');
//                    }
//                }, "There is the new version ~", ['Discard', 'Upgrade']);
//            }
//        }
//    });
//}

function checkConnection() {
    if (!window.deviceReady) {
        return true;
    }

    var networkState = navigator.connection.type;

    if (networkState == Connection.NONE) {
        Messagebox.popup("请检查您的网络");
        return false;
    }

    return true;
}

function objToArray(obj) {
    var arr = [];
    $.each(obj, function () {
        arr.push(this);
    });

    return arr;
}

function changePage(url) {
    url = encodeURI(url);
    if (url.substr(0, 1) == "#") {
        $.mobile.navigate(url, {
            transition: "slide"
        });
    }
    else {
        $.mobile.navigate(url, {
            transition: "slide"
        });
    }
}

function refreshPage() {
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

//function getUrlParam(url, name) {
//    url = decodeURI(url);
//    if (url.indexOf("?") > -1) {
//        url = url.split("?")[1];
//    }

//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//    var r = url.match(reg);
//    if (r != null) return r[2]; return null;
//}

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

var Messagebox = Messagebox ? Messagebox : {};
Messagebox = {

    alert: function (message, alertCallback, title, buttonName) {
        if (window.deviceReady && navigator) {
            if (!buttonName) {
                buttonName = "确定";
            }
            navigator.notification.alert(message, alertCallback, title, buttonName);
        }
        else {
            alert(message);
        }
    },

    //options.duration, // ‘short’, ‘long’
    //options.position, // ‘top’, ‘center’, ‘bottom’
    //options.successCallback, // optional succes function
    //options.errorCallback // optional error function
    popup: function (message, options) {
        if (!message) {
            return;
        }

        if (window.deviceReady) {
            var defaultOptions = {
                duration: "short",
                position: "center",
                successCallback: function () { },
                errorCallback: function () { }
            }

            options = $.extend(options, defaultOptions);

            window.plugins.toast.show(
                  message,
                  options.duration,
                  options.position,
                  options.successCallback,
                  options.errorCallback
          );
        }
        else {
            alert(message);
        }
    },

    confirm: function (message, confirmCallback, title, buttonLabels) {
        if (window.deviceReady && navigator) {
            if (!buttonLabels) {
                buttonLabels = ['取消', '确认'];
            }
            navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
        }
        else {
            window.confirm(message) ? confirmCallback(1) : confirmCallback(2);
        }
    },

    prompt: function (message, promptCallback, title, buttonLabels) {
        if (window.deviceReady && navigator) {
            if (!buttonLabels) {
                buttonLabels = ['取消', '确认'];
            }
            navigator.notification.prompt(message, promptCallback, title, buttonLabels);
        } else {
            alert("Not implemented this function on windows");
        }
    },

    showLoading: function () {
        if (window.plugins) {
            window.plugins.spinnerDialog.show(null, null, true);
        }
        else {
            $.mobile.loading('show', {
                text: '',
                textVisible: false,
                theme: 'a',
                html: ""
            });
        }
    },

    hideLoading: function () {
        if (window.plugins) {
            window.plugins.spinnerDialog.hide();
        }
        else {
            $.mobile.loading('hide', {
                textVisible: false
            });
            //window.localStorage.getItem("c_key");
        }
    }
};

var Ajax = (function () {
    var sendRequest = function (url, data, callback, needShowLoading, type) {
        needShowLoading = typeof (needShowLoading) == "undefined" ? true : needShowLoading;
        type = type || "Get";
        var isNetworkWorked = checkConnection();
        if (!isNetworkWorked) {
            return;
        }
        /*Production up API invoke*/
        var apiUrl = Config.apiPath + url;

        var ajaxOptions = {
            url: apiUrl,
            data: data,
            type: type,
            success: function (result) {
                if ($.isFunction(callback)) {
                    callback(result);
                }
            },
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpCallback" + (new Date()).getMilliseconds() + Math.floor(Math.random() * 1000),
            timeout: 15000,
            beforeSend: function () {
                if (!needShowLoading) {
                    return;
                }

                var pageLoadingCount = parseInt($("#pageLoadingCount").val());
                pageLoadingCount++;
                if (pageLoadingCount == 1) {
                    Messagebox.showLoading();
                }
            },
            complete: function () {
                if (!needShowLoading) {
                    return;
                }

                var pageLoadingCount = parseInt($("#pageLoadingCount").val());
                pageLoadingCount--;
                if (pageLoadingCount <= 0) {
                    Messagebox.hideLoading();
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                if (window.deviceReady) {
                    Messagebox.popup("网络异常，请重试");
                }
                else {
                    Messagebox.popup("网络异常，请重试:" + textStatus);
                }
            }
        };

        if (type == "Post") {
            ajaxOptions.contentType = "application/json";
            ajaxOptions.data = JSON.stringify(data);
        }

        $.ajax(ajaxOptions);
    }

    return {
        getJson: function (url, data, callback, needShowLoading) {
            return sendRequest(url, data, callback, needShowLoading);
        },
        postJson: function (url, data, callback, needShowLoading) {
            return sendRequest(url, data, callback, needShowLoading, "Post");
        }
    };
})();

function getCurrentAccountId() {
    return window.localStorage.getItem("c_accountId");
}

function getPhoto(source, onPhotoURISuccess, onPhotoURIFailed) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onPhotoURIFailed, {
        quality: 20,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: source,
        correctOrientation: true
    });
}

function MD5(obj) {
    return $.md5(obj);
}


//add callback if need 
$.fn.emptyValidate = function (message) {
    if ($.trim($(this).val()) == "") {
        Messagebox.popup(message);
        //$(this).focus();
        return false;
    }
    return true;
}

$.fn.telephoneValidate = function (message) {
    var reg = /^1[0-9]{10}$/;
    if (!reg.test($(this).val())) {
        Messagebox.popup(message);
        $(this).val("");
        //$(this).focus();
        return false;
    }
    return true;
}

$.fn.passwordValidate = function (message) {
    var reg = /^[a-zA-Z0-9]{6,10}$/;
    if (!reg.test($(this).val())) {
        Messagebox.popup(message);
        $(this).val("");
        //$(this).focus();
        return false;
    }
    return true;
}

Date.prototype.format = function (format) {
    var o =
    {
        "M+": this.getMonth() + 1, //month  
        "d+": this.getDate(),    //day  
        "h+": this.getHours(),   //hour  
        "m+": this.getMinutes(), //minute  
        "s+": this.getSeconds(), //second  
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter  
        "S": this.getMilliseconds() //millisecond  
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
    return format;
}

function stringToDate(value) {
    var fullDate = value.split(" ")[0].split("-");
    var fullTime = value.split(" ")[1].split(":");

    var newDate = new Date(fullDate[0], fullDate[1] - 1, fullDate[2], (fullTime[0] ? fullTime[0] : 0), (fullTime[1] ? fullTime[1] : 0), (fullTime[2] ? fullTime[2] : 0));

    return newDate;
}

function stringToShortDate(value) {
    var fullDate = value.split(" ")[0].split("-");

    var newDate = new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);

    return newDate;
}

function imageLazyload(container, loadedCallback) {
    $("img.lazy").lazyload({
        container: container,
        load: function () {
            if (loadedCallback)
                loadedCallback();
        }
    });
}

//Pull down contrl
var listScroller = listScroller ? listScroller : {};
listScroller = {
    createInstance: function (wrapperId, loadMoreCallback) {
        var wrapperContainer = $("#" + wrapperId);
        pullDownEl = wrapperContainer.find('#pullDown')[0];
        pullDownOffset = pullDownEl.offsetHeight;

        var result = new iScroll(wrapperId, {
            //scrollbarClass: 'myScrollbar', 
            useTransition: false,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    this.minScrollY = -pullDownOffset;
                }
            },
            onScrollEnd: function () {
                $("img.lazy").lazyload(wrapperContainer);

                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';

                    if (loadMoreCallback)
                        loadMoreCallback();
                }
            }
        });

        return result;
    }
};

function scrollerToBottom(scroller, selector) {
    scroller.scrollToElement(selector, 200);
}

function bindItem($ci, dataItem, templateConvertors) {
    var a = $ci.data("bind");
    if (!a) {
        return;
    }

    var itemSplit = a.split(";");
    for (var k = 0; k < itemSplit.length; k++) {
        if (itemSplit[k].length == 0) {
            continue;
        }

        var proName = itemSplit[k].split(":")[0];
        var value = itemSplit[k].split(":")[1];
        var rs = value.match(/\{\w*\.?\w*\}/gi);
        for (var i = 0; i < rs.length; i++) {
            var valueKeys = rs[i].replace("{", "").replace("}", "").split(".");
            var currentValue = dataItem;
            for (var j = 0; j < valueKeys.length; j++) {
                if (currentValue != null) {
                    currentValue = valueKeys[j].length > 0 ? currentValue[valueKeys[j]] : currentValue;
                    var dataConvertorKey = $ci.data("convertor");
                    if (dataConvertorKey && templateConvertors) {
                        var dataConvertor = templateConvertors[dataConvertorKey];
                        if ($.isFunction(dataConvertor)) {
                            currentValue = dataConvertor(currentValue);
                        }
                    }
                }
            }

            value = value.replace(rs[i], currentValue == null ? "" : currentValue);
        }

        if (proName.toLowerCase() == "value") {
            $ci.val(value);
            continue;
        }

        if (proName.toLowerCase() == "text") {
            $ci.text(value);
            continue;
        }

        if (proName.toLowerCase() == "html") {
            $ci.html(value);
            continue;
        }

        if (proName.toLowerCase() == "css") {
            var styleArray = value.split(":");
            if (styleArray.length > 1) {
                $ci.css(styleArray[0], styleArray[1]);
            }

            continue;
        }

        if (proName.toLowerCase() == "class") {
            if (!$ci.hasClass(value)) {
                $ci.addClass(value);
            }

            continue;
        }

        $ci.attr(proName, value);
    }
}

function DataBind(data, container, obj, itemsCreateCallBack, templateSelectors, templateConvertors) {
    var $this = $(obj);
    var itemIndex = 0;

    if (!$this.data("template") && !$this.data("template-selector")) {
        bindItem($this, data, templateConvertors);
        $.each(container.find("[data-bind]"), function () {
            bindItem($(this), dataItem, templateConvertors);
        });
    }

    var useSelector = false;
    var selector = $this.data("template-selector");
    if (selector) {
        var containerSelector = templateSelectors[$this.data("template-selector")];
        if ($.isFunction(containerSelector)) {
            useSelector = true;
        }
    }

    var $page = $this.closest("[data-role='page']");
    var temp = $page.find("#" + $this.data("template"));

    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        if (useSelector) {
            temp = $page.find(containerSelector(dataItem));
        }

        if (itemIndex == 0) {
            control = temp.clone().removeAttr("id");
            bindItem(control, dataItem, templateConvertors);
        }

        control.find("[data-template-Selector]").each(function () {
            var $tempItem = $(this);
            var tempSelector = templateSelectors[$tempItem.data("template-selector")];
            if ($.isFunction(tempSelector)) {
                var subTemplateId = tempSelector(dataItem);
                $tempItem.append($(subTemplateId).html());
            }
        });

        var items = control.find("[data-item='true']");
        if (items.length > itemIndex) {
            var $ci = items.eq(itemIndex);
            bindItem($ci, dataItem, templateConvertors);
            $ci.attr("is-binded", true);
            $.each($ci.find("[data-bind]"), function () {
                bindItem($(this), dataItem, templateConvertors);
            });

            itemIndex++;

            if (items.length == itemIndex || i + 1 == data.length) {
                container.append(control.html());
                itemIndex = 0;
            }
        }
        else {
            itemIndex = 0;
            if (items.length == 0) {
                control.attr("is-binded", true);
                $.each(control.find("[data-bind]"), function () {
                    bindItem($(this), dataItem, templateConvertors);
                });
                container.append(control.html());
            }
        }

        if ($.isFunction(itemsCreateCallBack)) {
            itemsCreateCallBack(control, dataItem);
        }
    }

    container.find("[data-item='true']:not([is-binded='true'])").remove();
}

$.fn.templateToHtml = function (data, itemsCreateCallBack, templateSelectors, templateConvertors) {
    var container = $("<div></div>");
    DataBind(data, container, $(this), itemsCreateCallBack, templateSelectors, templateConvertors);
    return container.html();
};

$.fn.DataBind = function (data, itemsCreateCallBack, templateSelectors, templateConvertors) {
    DataBind(data, $(this), $(this), itemsCreateCallBack, templateSelectors, templateConvertors);
};