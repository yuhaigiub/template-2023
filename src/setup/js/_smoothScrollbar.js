import Scrollbar from 'smooth-scrollbar';

$.fn.smoothScrollbar = function (options) {
    var defaults = {
        obj: $(this),
        watches: [
            {
                offset: 100,
                positiveReturn: function () { },
                negativeReturn: function () { }
            }
        ],
        debug: false
    }
    var settings = $.extend(defaults, options);
    var device = {
        width: $(window).innerWidth(),
        height: $(window).innerHeight()
    };
    var isMobile = (
        width = device.width, 
        height = device.height
    ) => ((width <= 700) || (width < height));

    if (settings.obj.length > 0) {
        if (1) {
            // console.log("init");
            $(this).css({
                width: device.width + "px",
                height: device.height + "px",
                overflowY: 'auto'
            });

            var vdamping = 0.1;
            let scrollbars = {};
            scrollbars['root'] = Scrollbar.init(settings.obj.get(0), {
                alwaysShowTracks: true,
                damping: vdamping
            });
            scrollbars['root'].addListener(function (status) {
                settings.watches.forEach(watch => {
                    if (status.offset.y >= watch.offset) {
                        watch.positiveReturn();
                    }
                    else {
                        watch.negativeReturn();
                    }
                });
            });
        }
    }

}