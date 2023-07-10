$.fn.lightBox = function(options){
    var defaults = {
      obj: $(this),
      type: '',
      objLightBox: '',
      animate: {},
      animateToggle: {},
      backgroundClickToClose: true,
      floatEl: $("#floatLightbox"),
      initClose: true,
      objClose: '.close',
    }
    var settings = $.extend(defaults, options);

    let toolbarPopup = `
    <div class="popup__tool">
        <div class="popup__close close">
            <span class="hamburger hamburger--emphatic is-active">
                <span class="hamburger-box">
                    <span class="hamburger-inner">Burger</span>
                </span>
            </span>
        </div>
    </div>`;

    let popupId;
    let popupDom;
  
    switch (settings.type) {
        case 'youtube': 
            popupId = generateId();
            var youtubeId = settings.obj.attr("href").split("=")[1];
            settings.obj.attr("href", "#"+popupId);

            popupDom = `
                <div id="${popupId}" class="popup popup--open-video">
                    <div class="popup__background"></div>
                    <div class="popup__content">
                        <div class="embed"><div id="${popupId}_embed" data-youtube-id="${youtubeId}"></div></div>
                    </div>
                    ${toolbarPopup}
                </div>
            `;
            settings.floatEl.append(popupDom);


            break;
        case 'image':
            popupId = generateId();
            let imgUrl = settings.obj.attr("href");
            settings.obj.attr("href", "#"+popupId); 

            popupDom = `
                <div id="${popupId}" class="popup popup--open-image">
                    <div class="popup__background"></div>
                    <div class="popup__content">
                        <div class="image"><img src="${imgUrl}" /></div>
                    </div>
                    ${toolbarPopup}
                </div>
            `;
            settings.floatEl.append(popupDom);
            break;
        default: 
        // inline
            // settings.obj.on("click", () => {
            //     console.log(settings.objLightBox)
            //     $(settings.objLightBox).addClass('active');
            //     $(settings.objLightBox).animate(settings.animate);
            // });

            // $(settings.objLightBox).children(".popup__content").children(".close").children("a").on("click", function(){
            //     $(settings.objLightBox).removeClass('active');
            //     $(settings.objLightBox).animate(settings.animateToggle);
            // });

            // if (settings.backgroundClickToClose) {
            //     if (settings.type == '') {
            //         $(settings.objLightBox).children(".popup__background").on("click", function(){
            //             $(settings.objLightBox).removeClass('active');
            //             $(settings.objLightBox).animate(settings.animateToggle);
            //         });
            //     } else {
            //         $(".scroll-content".find()).children(".popup__background").on("click", function(){
            //             $(settings.objLightBox).removeClass('active');
            //             $(settings.objLightBox).animate(settings.animateToggle);
            //         });
            //     }
            // }
    }

    settings.obj.on("click", (e) => {
        e.preventDefault();
        $("html").addClass("openedPopup");
        if ($(this).data("lightbox-type") == "youtube" && ytPlayer[$(this).attr("href")] == undefined ) {
            ytPlayer[$(this).attr("href")] = YoutubePlayer($(this).attr("href").substring(1)+"_embed", {
                videoId: $($(this).attr("href")+"_embed").data("youtube-id"),
                playerVars: {
                    rel: 0,
                    autoplay: 1,
                    color: 'white'
                }
            });
            // ytPlayer[$(this).attr("href")].stopVideo();
        }
        $($(this).attr("href"))
        $($(this).attr("href")).addClass('active');
        console.log($($(this).attr("href")).children(".popup__tool").length > 0);
        if (settings.initClose && $($(this).attr("href")).children(".popup__tool").length == 0) {
            $($(this).attr("href")).append(toolbarPopup);
        }
        $($(this).attr("href")).animate(settings.animate);
        if ($(this).data("lightbox-type") == "youtube") {
            ytPlayer[$(this).attr("href")].playVideo();
        }
    });

    

    

    // Inline
}


// if ($(".popup__background").length > 0) {
//     $(".popup__background").each(function(){
//         $(this).on("click", function(){
//             $(this).parent().removeClass("active");
//             if ($(this).parent().hasClass("popup--open-video")) {
//                 ytPlayer["#"+$(this).parent().attr("id")].pauseVideo();
//             }
//         })
//     })
// }


$("body").on("click", ".close", function(){
    $("html").removeClass("openedPopup");
    $(this).parents(".popup").removeClass("active");
    $(this).parent().parent().removeClass("active");
    $(this).parent().removeClass("active");
    if ($(this).parent().parent().hasClass("popup--open-video")) {
        ytPlayer["#"+$(this).parent().parent().attr("id")].pauseVideo();
    }
});

$("body").on("click", ".popup__background", function(){
    $("html").removeClass("openedPopup");
    $(this).parent().removeClass("active");
    if ($(this).parent().hasClass("popup--open-video")) {
        ytPlayer["#"+$(this).parent().attr("id")].pauseVideo();
    }
});


function generateId(){
    return Math.random().toString(36).substring(2, 8);
}