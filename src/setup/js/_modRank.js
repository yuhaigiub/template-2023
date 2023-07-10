var data_group = 1;

jQuery(document).ready(function() {

    var postData = 'function_ranking=getDailyTotalActiveFightPowerRanking';
    var postData_server = '';
    var test = false;

    var initRankTabSwiper = function(){

        if ($("#homeRank .swiper").length > 0) {
            console.log('a');
            $("#homeRank .swiper").initSwiper({
                swiperOptions: {
                    slidesPerView: 3.2,
                    spaceBetween: 10,
                    breakpoints: {
                        768: {
                            slidesPerView: 5
                        }
                    },
                }
            });
        }
    }

    if (test && $("#blockRank").length > 0) {
        var tempHtml = $("#blockRank").html();
        $("#blockRank").empty();
        $("#blockRank").append(tempHtml); 
        initRankTabSwiper();
    } else {
    

        $("#blockRank").delegate("#pagination li.prev a", "click", function() {
            
            if (data_group > 1) {
    
                data_group--;
                $(".pagination-container .pagination li.page").hide();
                $(".pagination-container .pagination li.group-page-" + data_group).show();
    
                $("#pagination li.prev").removeClass("disabled");
                $("#pagination li.next").removeClass("disabled")
     
    
                if (data_group<=1) {
                     $("#pagination li.prev").addClass("disabled")
                };
    
            } else {
                $("#pagination li.prev").addClass("disabled")
            }
    
            return false;
        })
        $("#blockRank").delegate("#pagination li.next ", "click", function() {
            if (data_group < 5) {
    
                data_group++;
                $(".pagination-container .pagination li.page").hide();
                $(".pagination-container .pagination li.group-page-" + data_group).show();
    
                $("#pagination li.next").removeClass("disabled")
                $("#pagination li.prev").removeClass("disabled");
    
                if (data_group>=5) {
                     $("#pagination li.prev").addClass("disabled")
                };
    
            } else {
                $("#pagination li.next").addClass("disabled")
            }
    
            return false;
        })
    
        $("#blockRank").delegate("#pagination li.page a", "click", function() {
    
            var vnum = parseInt($(this).text());
    
            $("ul.list-data-bxh").hide();
            $("#page-" + vnum).show();
    
            $("#pagination .page").removeClass("active");
            $(this).parent().addClass("active");
    
            return false;
    
        })
    
    
        if ($("#blockRank").length > 0) {
    
            var urlInput = $("#blockRank").attr("rel");
    
    
            $("#blockRank").delegate(".rank_tab a", "click", function() {
    
                var tab_ranking = $(this).attr("rel");
    
                $(".rank_tab a").removeClass("active");
                $(this).addClass("active");
    
                if (tab_ranking != "") {
                    postData = tab_ranking;
    
                } else {
                   // postData = postData+"";
                    return false;
                }
    
                jQuery.ajax({
                    type: "POST",
                    url: urlInput,
                    data: postData,
                    beforeSend: function() {
                        // setting a timeout
    
                        $("#blockRank").html(`
                        <div class="empty">
                            <p>Đang tải...</p>
                        </div>
                        `);
                    },
                    success: function(data) {
    
                        $("#blockRank").html(data);
    
    
                        initRankTabSwiper();
    
                    },
                    error: function(msg) {}
                })
    
                return false;
    });
    
    
           $("#blockRank").delegate("select.selectClan", "change", function() {
    
                var banghoi = $(this).val();
                if (banghoi != "") {
                    postData_banghoi = 'function_ranking=' + banghoi;
    
                } else {
                    postData_banghoi = 'function_ranking=getPrestigeRanking';
                }
    
                jQuery.ajax({
                    type: "POST",
                    url: urlInput,
                    data: postData_banghoi,
                    beforeSend: function() {
                        // setting a timeout
                        $("#blockRank").html(`
                        <div class="empty">
                            <p>Đang tải...</p>
                        </div>
                        `);
                    },
                    success: function(data) {
    
                        $("#blockRank").html(data);
    
    
                        initRankTabSwiper();
    
                    },
                    error: function(msg) {}
                })
    
    
    
            });
    
    
            $("#blockRank").delegate("select.selectOther", "change", function() {
    
                var faction_id = $(this).val();
                if (faction_id != "") {
                    postData_other = '&faction_id=' + faction_id;
    
                } else {
                    postData_other = '&faction_id=' + 1;
                }
    
                jQuery.ajax({
                    type: "POST",
                    url: urlInput,
                    data: postData+postData_other +postData_server,
                    beforeSend: function() {
                        // setting a timeout
    
                        $("#blockRank").html(`
                        <div class="empty">
                            <p>Đang tải...</p>
                        </div>
                        `);
                    },
                    success: function(data) {
    
                        $("#blockRank").html(data);
    
    
                        initRankTabSwiper();
    
                    },
                    error: function(msg) {}
                })
    
    
    
            });
    
            $("#blockRank").delegate("select.selectServer", "change", function() {
    
                var serverid = $(this).val();
                if (serverid != "") {
                    postData_server = '&server_id=' + serverid;
    
                } else {
                    postData_server = "";
                }
    
                jQuery.ajax({
                    type: "POST",
                    url: urlInput,
                    data: postData+postData_server,
                    beforeSend: function() {
                        // setting a timeout
                        $("#blockRank").html(`
                        <div class="empty">
                            <p>Đang tải...</p>
                        </div>
                        `);
                    },
                    success: function(data) {
    
                        $("#blockRank").html(data);
    
    
                        initRankTabSwiper();
    
                    },
                    error: function(msg) {}
                })
    
    
    
            });
    
    
    
    
            jQuery.ajax({
                type: "POST",
                url: urlInput,
                data: postData,
                beforeSend: function() {
                    // setting a timeout
    
                    $("#blockRank").html(`
                    <div class="empty">
                        <p>Đang tải...</p>
                    </div>
                    `);
                },
                success: function(data) {
    
                    $("#blockRank").html(data);
    
    
                    // $("#pagination li a").click(function() {
    
                    //     var vnum = parseInt($(this).text());
    
                    //     $("ul.list-data-bxh").hide();
                    //     $("#page-" + vnum).show();
    
                    //     $("#pagination .page").removeClass("active");
                    //     $(this).parent().addClass("active");
    
                    //     return false;
    
                    // })
    
    
                    if ($("#homeRankSwiper").length > 0) {
                        $("#homeRankSwiper").initSwiper({
                            swiperOptions: {
                                slidesPerView: 3.3,
                                breakpoints: {
                                    768: {
                                        slidesPerView: 5
                                    }
                                }
                            }
                            
                        })
                    }
    
                },
                error: function(msg) {}
            })
    
    
    
        }
    
    }



})

function cutStringTable() {
    for (var i = 1; i < $("p.NhanVat").length; i++) {
        $("p.NhanVat").eq(i).text(($("p.NhanVat").eq(i).html()).substring(0, 6));
    }
}

function addClassTable() {
    if (jQuery("#rankingResult").length > 0) {
        for (var i = 0; i < jQuery("#rankingResult li p").length; i++) {
            switch (i % 3) {
                case 0:
                    jQuery("#rankingResult li p").eq(i).addClass("Hang");
                    break;
                case 1:
                    jQuery("#rankingResult li p").eq(i).addClass("NhanVat");
                    break;
                case 2:
                    jQuery("#rankingResult li p").eq(i).addClass("ThanhTich");
                    break;
            }
        }
    }
}