// Inertia = Quan tinh

$.fn.inertiaAside = function(options) {
    var defaults = {
        obj: $(this),
        config: {
            lag: 50,
            maxSpeed: 100,
            frameRate: 20
        }
    }

    var settings = $.extend(defaults, options);

    //code
    let scrollTop = 0;
    let pinTop = 0;
    let lastTime;
    const updatePinPosition = (time) => {
        if (!lastTime)
            lastTime = time;

        let delta = time - lastTime;

        if (delta >= settings.config.frameRate){
            scrollTop = $(window).scrollTop();
            var move = (scrollTop - pinTop) * delta / (settings.config.lag + delta);
            var direction = move === 0 ? 0 : move / Math.abs(move);
            pinTop = pinTop + Math.min( Math.abs(move), settings.config.maxSpeed ) * direction;

            var scale = 1;
            if (typeof $("body").attr("data-scale-ratio") != "undefined"
                && (settings.obj.hasClass("scaleDesktop") || settings.obj.hasClass("scaleMobile"))) {
                scale = parseFloat($("body").attr("data-scale-ratio"));
            }

            settings.obj.css({transform: `translateY(${-move}px) scale(${scale})`});
            lastTime = time;
        }
        requestAnimationFrame(updatePinPosition);
    }
    requestAnimationFrame(updatePinPosition);

}