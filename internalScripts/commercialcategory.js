$(document).on("pageinit", "#pageCommercialCategory", function (event, ui) {
    var $page = $(this);

    if ($page.find("#swiperNav #pageIndex_nav").length == 0) {
        $page.find("#swiperNav").append(topMenu.clone());
        $page.find("#pageIndex_topMenu div").removeClass("active");
        $page.find("#pageIndex_topMenu div").eq(1).addClass("active");

        new Swiper('#pageCommercialCategory #pageIndex_nav', {
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30,
            grabCursor: true
        });
    }

    //$page.find("div.whitesquare").each(function () {
    //    $(this).height($(this).width());
    //});

    $page.find("div.whitesquare").on("click", function () {
        changePage("commercialperson.html");
    });
});