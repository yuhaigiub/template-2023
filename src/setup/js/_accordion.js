$.fn.accordion = function(options){
    var defaults = {
      obj: $(this),
      isTabContent: false,
      after: function(){}
    }
    var settings = $.extend(defaults, options);

    switch (settings.isTabContent) {
        case 0:
        case false:
            // need preview
            // settings.obj.children(".accordion__set").children(".accordion__title").each(function(){
            //     $(this).on("click", function(e){
            //         e.preventDefault();
            //         if ($(this).hasClass("active")){
            //             $(this).removeClass("active");
            //             $(this).next(".accordion__content").slideUp(200);
            //         } else {
            //             settings.obj.children(".accordion__set").children(".accordion__title").removeClass("active");
            //             settings.obj.children(".accordion__set").children(".accordion__content").slideUp(200);
            //             $(this).addClass("active");
            //             $(this).next(".accordion__content").slideDown(200);
            //         }
            //     })
            // });
        break;

        case 1: 
        case true: 
            settings.obj.find(".articleAccordionTab").each(function(){
                $(this).on("click", function(e){
                    e.preventDefault();
                    var accordionContent = $(this).attr("href");
                    settings.obj.find(".articleAccordionTab").removeClass("active");
                    settings.obj.find(".articleAccordionContent").removeClass("active");
                    $(this).addClass("active");
                    settings.obj.find(accordionContent).addClass("active");
                    setTimeout(function(){
                        settings.after();
                    }, 600)
                });
            })
        break;
    }
}
