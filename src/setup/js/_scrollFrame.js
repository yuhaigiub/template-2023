import "jquery-mousewheel";

const scrollFrame = {
    el: {
        scrollFrame: '.scrollFrame',
        frame: [],
        nav: '.scrollFrameControl',
        scrollContainer: 'html',
        fullPageWrapper: 'body'
    },
    data: {
        totalFrame: 0, 
        currentFrame: 0,
        currentFrameId: '',
        aniComplete: true,
        timeAnimation: 500,
    },
    func: {
        getTotalFrame: () => $(scrollFrame.el.scrollFrame).length,
        getScaleRatio: () => {
            if ($(scrollFrame.el.fullPageWrapper).length > 0) {
                return ($(scrollFrame.el.fullPageWrapper).attr("data-scale-ratio"));
            } else {
                return 1;
            }
        },
        getFrames: () => {
            $(scrollFrame.el.scrollFrame).each(function(){
                // scrollFrame.el.frame.push("#"+$(this).attr("id"));
                scrollFrame.el.frame.push({
                    el: "#"+$(this).attr("id"),
                    offsetTop: $("#"+$(this).attr("id")).offset().top
                })
            });
        },
        getFrameOffset: (frameId) => {
            for (let i = 0, len = scrollFrame.el.frame.length; i < len; i++) {
                if (scrollFrame.el.frame[i].el === frameId) {
                    return scrollFrame.el.frame[i].offsetTop;
                }
            }
            return 0;

        },
        scrollTo: (frameId, scrollOffset) => {
            // let scrollTop = $(frameId).offset().top;
            // let scaleRatio = scrollFrame.func.getScaleRatio();
            // console.log(scaleRatio);
            // scrollTop *= scaleRatio;
            // console.log(frameId);
            // console.log(scrollTop);
            let scrollTop = scrollFrame.func.getFrameOffset(frameId);

            // console.log(parseInt(scrollOffset));
            // console.log(scrollFrame.func.getScaleRatio());

            if (scrollOffset != undefined) {
                scrollTop += parseInt(scrollOffset) * scrollFrame.func.getScaleRatio();
            }

            console.log(scrollTop);

            $(scrollFrame.el.scrollContainer).animate({
                scrollTop: scrollTop
            }, scrollFrame.data.timeAnimation, 'linear', function(){
                scrollFrame.data.aniComplete = true;
            });

            scrollFrame.func.activeNavBullet(frameId);
        },
        activeNavBullet: (frameId) => {
            if ($(scrollFrame.el.nav).length > 0) {
                $(scrollFrame.el.nav).removeClass("active");
                $(scrollFrame.el.nav).parent().parent().find('[href="'+frameId+'"]').addClass("active");
                // $(scrollFrame.el.nav).find('a').removeClass("active");
                // $(scrollFrame.el.nav).find('a[href="'+frameId+'"]').addClass("active");
            }
        },
        isOpeningPopup: () => {
            return $("html").hasClass("popup-opened");
        }
    },
    handleMousewheel: () => {
        $(window).on("mousewheel", function(e){
            // e.preventDefault();
            // e.stopPropagation();
            if (!scrollFrame.func.isOpeningPopup()) {

                let deltaY = e.deltaY;

                // console.log(deltaY, scrollFrame.data.aniComplete, scrollFrame.data.currentFrameId);
                // console.log(deltaY > 0 && scrollFrame.data.aniComplete && (scrollFrame.data.currentFrame + 1 < scrollFrame.data.totalFrame));
                if (deltaY < 0 && scrollFrame.data.aniComplete && (scrollFrame.data.currentFrame + 1 < scrollFrame.data.totalFrame)) {
                    // Scroll down
                    scrollFrame.data.currentFrame ++;
                    scrollFrame.data.aniComplete = false;
                    scrollFrame.data.currentFrameId = scrollFrame.el.frame[scrollFrame.data.currentFrame].el;
                    scrollFrame.func.scrollTo(scrollFrame.data.currentFrameId);
    
                } else if (deltaY > 0 && scrollFrame.data.aniComplete && (scrollFrame.data.currentFrame > 0))  {
                    // Scroll up
                    scrollFrame.data.currentFrame --;
                    scrollFrame.data.aniComplete = false;
                    scrollFrame.data.currentFrameId = scrollFrame.el.frame[scrollFrame.data.currentFrame].el;
                    scrollFrame.func.scrollTo(scrollFrame.data.currentFrameId);
                }
            }
        });
    },
    handleNav: () => {
        if ($(scrollFrame.el.nav).length > 0) {
            $(scrollFrame.el.nav).on("click", function(e){
                e.preventDefault();
                let frameToScroll = $(this).attr("href");
                for (let i = 0, len = scrollFrame.el.frame.length; i < len; i++) {
                    if (scrollFrame.el.frame[i].el === frameToScroll) {
                        scrollFrame.data.currentFrame = i;
                        scrollFrame.data.currentFrameId = frameToScroll;
                    }
                }
                var scrollOffset = $(this).attr("data-scroll-offset");
                scrollFrame.func.scrollTo(frameToScroll, scrollOffset);
            })
        }
    },
    init: () => {
        // console.log("scroll frame initial");
        $(scrollFrame.el.scrollContainer).animate({
            scrollTop: 0
        }, scrollFrame.data.timeAnimation, 'linear', function(){});

        scrollFrame.data.totalFrame = scrollFrame.func.getTotalFrame();
        scrollFrame.func.getFrames();

        // console.log(scrollFrame.el.frame)

        // console.log(scrollFrame.el);
        // console.log(scrollFrame.data);
        // scrollFrame.handleMousewheel();
        scrollFrame.handleNav();
    }
}

export default scrollFrame;

// -----------------------------------
// Event scroll with delta return
// -----------------------------------
// 
// [DELEGRATED] because call handle when running animating code (animate{scrollTop:x})
//
// jQuery.event.special.scrolldelta = {
//     delegateType: "scroll",
//     bindType: "scroll",
//     handle: function (event) {
//         var handleObj = event.handleObj;
//         var targetData = jQuery.data(event.target);
//         var ret = null;
//         var elem = event.target;
//         var isDoc = elem === document;
//         var oldTop = targetData.top || 0;
//         var oldLeft = targetData.left || 0;
//         targetData.top = isDoc ? elem.documentElement.scrollTop + elem.body.scrollTop : elem.scrollTop;
//         targetData.left = isDoc ? elem.documentElement.scrollLeft + elem.body.scrollLeft : elem.scrollLeft;
//         event.scrollTopDelta = targetData.top - oldTop;
//         event.scrollTop = targetData.top;
//         event.scrollLeftDelta = targetData.left - oldLeft;
//         event.scrollLeft = targetData.left;
//         event.type = handleObj.origType;
//         ret = handleObj.handler.apply(this, arguments);
//         event.type = handleObj.type;
//         return ret;
//     }
// };