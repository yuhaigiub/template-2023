// import Swiper from 'swiper/swiper-bundle';
// import Swiper from "https://unpkg.com/swiper@7.4.1/swiper-bundle.js";
// import SwiperAnimation from "@cycjimmy/swiper-animation";

// var swiperAnimation = new SwiperAnimation();
var swiperControl = {};

$.fn.initSwiper = function (options) {
    var defaults = {
        isNested: false,
        isSync: false,
        isRenderBullet: false,
        isSwiperAnimation: false,
        swiperOptions: {
            centeredSlides: true,
            slidesPerView: 1,
            autoplay: {
                delay: 5000,
            },
            lazy: {
                loadPrevNext: true,
            },
            followFinger: false,
            spaceBetween: 0,
        },
        nestedOptions: {},
        syncOptions: {},
        onInit: function () { },
        onChange: function (callback = function () { }) {
            callback();
        },
        before: function () { },
        after: function () { },
        debug: false
    };

    var settings = $.extend(defaults, options);

    var debugSettings = {};
    if (settings.debug) {
        debugSettings = {
            modules: [moduleDebug],
            debugger: true,
        };
    }

    // console.log(this, settings);

    if ($(this).length == 0) {
        return;
    }

    let swiperSelector = "#" + $(this).attr("id");

    settings.before();

    // console.log(swiperControl[swiperSelector.substr(1)] != undefined);

    if (swiperControl[swiperSelector.substr(1)] != undefined) {
        // console.log(swiperControl[swiperSelector.substr(1)] != undefined);
        if (
            typeof swiperControl[swiperSelector.substr(1)].destroy() == "function"
        ) {
            swiperControl[swiperSelector.substr(1)].destroy();
        }

        delete swiperControl[swiperSelector.substr(1)];
    }

    // RENDER BULLETS OPTION

    var addon_renderBullet = {};
    if (settings.isRenderBullet) {
        var hostSwiper = $(this).attr("id");
        addon_renderBullet = {
            renderBullet: function (index, className) {
                var addOnClass = "";
                var addOnText = index + 1;

                var swiperName = $("#" + hostSwiper + " .swiper-wrapper")
                    .children(".swiper-slide")
                    .eq(index)
                    .attr("data-swiper-name");

                var swiperCode = $("#" + hostSwiper + " .swiper-wrapper")
                    .children(".swiper-slide")
                    .eq(index)
                    .attr("data-swiper-code");

                if (swiperName) {
                    addOnText = swiperName;
                }
                if (swiperCode) {
                    addOnClass = swiperCode + " swiper-pagination-bullet--" + swiperCode;
                }

                return (
                    '<span class="' +
                    className +
                    " " +
                    addOnClass +
                    '">' +
                    addOnText +
                    "</span>"
                );
            },
        };
    }

    // NESTED OPTIONS

    if (settings.isNested) {
        $(this)
            .find(".swiper")
            .each(function () {
                if ($(this).attr("data-swiper-isSync") === undefined) {
                    $(this).initSwiper(settings.nestedOptions);
                }
            });
    }

    // SYNC OPTIONS

    var addon_syncOptions = {};
    if (settings.isSync) {
        var hostSwiper = $(this).attr("id");
        var syncWith = $(this).attr("data-sync-with");

        // console.log(hostSwiper);

        // console.log({...settings.syncOptions,
        //     watchSlidesVisibility: true,
        //     watchSlidesProgress: true});

        $("#" + syncWith).initSwiper({
            ...settings.syncOptions,
            swiperOptions: {
                watchOverflow: true,
                centeredSlides: true,
                centeredSlidesBounds: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                slideToClickedSlide: true,
                scrollbar: {
                    el: ".swiper-scrollbar-" + syncWith,
                    hide: true,
                },
                ...settings.syncOptions.swiperOptions,
            },
            after: function () {
                // swiperControl[hostSwiper].controller.control = [swiperControl[syncWith]];
                // swiperControl[syncWith].controller.control = [swiperControl[hostSwiper]];
                // swiperControl[hostSwiper].on('slideChangeTransitionStart', function() {
                //     swiperControl[syncWith].slideTo(swiperControl[hostSwiper].activeIndex);
                // });
                // swiperControl[syncWith].on('transitionStart', function(){
                //     swiperControl[hostSwiper].slideTo(swiperControl[syncWith].activeIndex);
                // });
            },
        });

        // console.log({
        //     syncWith,
        //     ...settings.syncOptions,
        //     swiperOptions: {
        //         watchOverflow: true,
        //         centeredSlides: true,
        //         centeredSlidesBounds: true,
        //         watchSlidesVisibility: true,
        //         watchSlidesProgress: true,
        //         slideToClickedSlide: true,
        //         scrollbar: {
        //             el: '.swiper-scrollbar-' + syncWith,
        //             hide: true
        //         },
        //         ...settings.syncOptions.swiperOptions
        //     },
        //     after: function() {
        //     }
        // });

        addon_syncOptions = {
            // centeredSlides: true,
            slideToClickedSlide: true,
            watchOverflow: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            preventInteractionOnTransition: true,
            thumbs: {
                swiper: swiperControl[syncWith],
            },
        };
    }

    var swiperAnimation = new SwiperAnimation();
    // console.log(".swiper-pagination--" + swiperSelector.substr(1));
    const swiperSettings = new Swiper(swiperSelector, {
        ...settings.swiperOptions,
        ...addon_syncOptions,
        on: {
            afterInit: function () {
                if (settings.isSwiperAnimation && swiperAnimation.animations != null) {
                    swiperAnimation.init(this).animate();
                }
                swiperAnimation.init(this).animate();
                settings.onInit();
            },
            slideChangeTransitionStart: function () {
                settings.onChange();
                if (settings.isSwiperAnimation && swiperAnimation.animations != null) {
                    swiperAnimation.init(this).animate();
                }
                swiperAnimation.init(this).animate();
            },

            ...settings.swiperOptions.on,
        },
        pagination: {
            el: ".swiper-pagination--" + swiperSelector.substr(1),
            clickable: true,
            ...settings.swiperOptions.pagination,
            ...addon_renderBullet,
        },
        navigation: {
            nextEl: ".swiper-button-next--" + swiperSelector.substr(1),
            prevEl: ".swiper-button-prev--" + swiperSelector.substr(1),
            ...settings.swiperOptions.navigation,
        },
        ...debugSettings,
    });

    swiperControl[swiperSelector.substr(1)] = swiperSettings;
    // console.log(swiperControl);

    settings.after();


    return swiperSettings;
};

function moduleDebug({ swiper, extendParams, on }) {
    extendParams({
        debugger: false,
    });

    on("init", () => {
        if (!swiper.params.debugger) return;
        console.log("init");
    });
    on("click", (swiper, e) => {
        if (!swiper.params.debugger) return;
        console.log("click");
    });
    on("tap", (swiper, e) => {
        if (!swiper.params.debugger) return;
        console.log("tap");
    });
    on("doubleTap", (swiper, e) => {
        if (!swiper.params.debugger) return;
        console.log("doubleTap");
    });
    on("sliderMove", (swiper, e) => {
        if (!swiper.params.debugger) return;
        console.log("sliderMove");
    });
    on("slideChange", () => {
        if (!swiper.params.debugger) return;
        console.log("slideChange", swiper.previousIndex, "->", swiper.activeIndex);
    });
    on("slideChangeTransitionStart", () => {
        if (!swiper.params.debugger) return;
        console.log("slideChangeTransitionStart");
    });
    on("slideChangeTransitionEnd", () => {
        if (!swiper.params.debugger) return;
        console.log("slideChangeTransitionEnd");
    });
    on("transitionStart", () => {
        if (!swiper.params.debugger) return;
        console.log("transitionStart");
    });
    on("transitionEnd", () => {
        if (!swiper.params.debugger) return;
        console.log("transitionEnd");
    });
    on("fromEdge", () => {
        if (!swiper.params.debugger) return;
        console.log("fromEdge");
    });
    on("reachBeginning", () => {
        if (!swiper.params.debugger) return;
        console.log("reachBeginning");
    });
    on("reachEnd", () => {
        if (!swiper.params.debugger) return;
        console.log("reachEnd");
    });
}

export default swiperControl;
// export {swiperControl, swiperAnimation};
