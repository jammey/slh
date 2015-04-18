$(document).on("pageshow", "#pageEnterpriseDetail", function (event, ui) {
    var $page = $(this);

    if ($page.find("#swiperNav #pageIndex_nav").length == 0) {
        $page.find("#swiperNav").append(topMenu.clone());
        $page.find("#pageIndex_topMenu div").removeClass("active");
        $page.find("#pageIndex_topMenu div").eq(2).addClass("active");

        new Swiper('#pageEnterpriseDetail #pageIndex_nav', {
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30,
            grabCursor: true
        });
    }

  
});
