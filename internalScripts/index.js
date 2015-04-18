var swiperNav = null;
var swiperImage = null;
var topMenu = null;

$(document).on("click", "#pageIndex_topMenu div", function() {
    if ($(this).attr("uniqueindex") == "企业新闻") {
        changePage("index.html");
    }
    if ($(this).attr("uniqueindex") == "商联会") {
        changePage("commercialcategory.html");
    }
    if ($(this).attr("uniqueindex") == "企业窗") {
        changePage("enterprisecategory.html");
    }
    if ($(this).attr("uniqueindex") == "助推器") {
        changePage("boostercategory.html");
    }
});



//$(document).on("click", "#pageIndex_topMenu .swiper-slide", function() {
//    if (!$(this).hasClass("active")) {
//        $("#pageIndex_topMenu .swiper-slide").removeClass("active");
//        $(this).addClass("active");
//    }
//});

$(document).on("pageshow", "#pageIndex", function (event, ui) {
    var $page = $(this);

    Ajax.getJson("Index/HomeInit", { "menuTag": "topMenu", "imageUniqueIndex": "首页大图", "imageTag": "", "newsUniqueIndex": "企业新闻", "newsTag": "" }, function (data) {
        if (data.IsSuccess) {
            //首页动态菜单
            if (!topMenu) {
                $page.find("#pageIndex_topMenu").empty();
                $page.find("#pageIndex_topMenu").DataBind(data.Data.TopMenu);

                new Swiper('#pageIndex #pageIndex_nav', {
                    slidesPerView: 4,
                    paginationClickable: true,
                    spaceBetween: 30,
                    grabCursor: true
                });

                topMenu = $page.find("#pageIndex_nav");
            }

            $page.find("#pageIndex_topMenu div").first().addClass("active");

            //首页大图
            $page.find("#pageIndex_topImg").empty();
            $page.find("#pageIndex_topImg").DataBind(data.Data.HomeImage);
            $page.find("#pageIndex_topImg img").each(function (index, e) {
                $(this).attr("src", data.Data.HomeImage[index].ContentImage[0].ImageUrl);
            });
            if (data.Data.HomeImage.length > 0) {
                $page.find("#pageIndex_topImgTitle").text(data.Data.HomeImage[0].Description);
            }

            if (swiperImage) {
                swiperImage.destroy(true);
            }
            swiperImage = new Swiper('#pageIndex_imgs', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                onSlideChangeEnd: function (item) {
                    $page.find("#pageIndex_topImgTitle").text(data.Data.HomeImage[item.activeIndex].Description);
                }
            });

            //首页新闻
            $page.find("#pageIndex_news").empty();
            $page.find("#pageIndex_news").DataBind(data.Data.HomeNews, function () { }, pageIndexHomeNews_DataSelector());
            $page.find("#pageIndex_news li").each(function (index, e) {
                if (data.Data.HomeNews[index].ContentImage.length > 0) {
                    $(this).find("img").attr("src", data.Data.HomeNews[index].ContentImage[0].ImageUrl);
                }
            });

            //$selfPage.find("#pageIndex_news p").dotdotdot();

            $page.find("#pageIndex_news li").on("click", function () {
                changePage("newsdetail.html");
            });

            $page.find("#pageIndex_news").listview("refresh");
        } else {
            Messagebox.popup(data.ErrorMessage.Message);
        }
    });
    $page.find("#standardFooter").show();
});

function pageIndexHomeNews_DataSelector() {
    return {
        pageIndex_newsSelecter: function(item) {
            if (item.ContentImage.length > 0) {
                return "#pageIndex_newsImageTemplate";
            } else {
                return "#pageIndex_newsTemplate";
            }
        }
    };
}

