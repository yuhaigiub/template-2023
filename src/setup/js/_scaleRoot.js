// SCALE PLATFORM 
// | Especially use for Web Platform 3.0
// | Although WP3.0 is preventing non-responsive design, there still have some
// | unexpected input PSD from outsource, out-dated designers.

$.fn.scalePlatform = function (options) {
    var defaults = {
        obj: $(this),
        designSafe: {
            // if width of device smaller safe zone, then init scale. 
            desktop: 1140,
            mobile: 768
        },
        designWidth: {
            desktop: 2000,
            mobile: 768
        },
        designHeight: {
            desktop: 1000,
            mobile: 1100
        },
        mode: '', //scaleForWidth
        elScale: {
            desktop: {
                topLeft: '.floatingDesktopTopLeft',
                topCenter: '.floatingDesktopTopCenter',
                topRight: '.floatingDesktopTopRight',
                midLeft: '.floatingDesktopMidLeft',
                midCenter: '.floatingDesktopMidCenter',
                midRight: '.floatingDesktopMidRight',
                botLeft: '.floatingDesktopBotLeft',
                botCenter: '.floatingDesktopBotCenter',
                botRight: '.floatingDesktopBotRight',
                fullHeightScale: '.fullHeightDesktopScale',
                autoHeightScale: '.autoHeightDesktopScale',
                contentHeightScale: '.contentHeightDesktopScale'
            },
            mobile: {
                topLeft: '.floatingMobileTopLeft',
                topCenter: '.floatingMobileTopCenter',
                topRight: '.floatingMobileTopRight',
                midLeft: '.floatingMobileMidLeft',
                midCenter: '.floatingMobileMidCenter',
                midRight: '.floatingMobileMidRight',
                botLeft: '.floatingMobileBotLeft',
                botCenter: '.floatingMobileBotCenter',
                botRight: '.floatingMobileBotRight',
                fullHeightScale: '.fullHeightMobileScale',
                autoHeightScale: '.autoHeightMobileScale',
                contentHeightScale: '.contentHeightMobileScale'
            }
        },
        elSpecial: {
            rescaleHeight: '.floatingRescaleHeight',
            burgerMenu: '.floatingBurgerMenu',
            rescaleMaxHeight: '.floatingRescaleMaxHeight',
        }
    }
    var settings = $.extend(defaults, options);




    $(window).on("resize", function () {
        var device = {
            width: $(window).innerWidth(),
            height: $(window).innerHeight()
        };

        var obj = {
            height: settings.obj.outerHeight()
        }
        
        // console.log(device);

        var isMobile = (width = device.width, height = device.height) => ((width <= 700) || (width < height));



        var mode = 'margin/scale',
            scaleRatio = 1,
            marginLeft = 0;



        // if (!isMobile() && (device.width/ device.height > settings.designWidth.desktop / settings.designHeight.desktop)) {
        //     // only margin, no scale
        //     // console.log('margin');
        //     mode = 'margin';
        //     marginLeft = -1 * (device.width - settings.designSafe) / 2;
        //     scaleRatio = device.height / settings.designHeight.desktop;

        // } else {
            // only scale, no margin
            // console.log(device.width);

            mode = 'scale';
            scaleRatio = (isMobile()) ? 
                            device.width / settings.designWidth.mobile : 
                            device.width / settings.designWidth.desktop;

        // }


        var scaleHeight = obj.height * scaleRatio;
        var actualHeight = device.height * 1 / scaleRatio;

        $(".wrapper").each(function(){
            $(this).attr("data-scale-ratio", scaleRatio)
        })

        settings.obj.css({
            display: "block",
            transform: "scale(" + scaleRatio + ")",
            marginLeft: marginLeft + "px"
        });
        settings.obj.parent().css({
            height: scaleHeight + "px",
            width: device.width + "px",
        });

        var origin = 'center center';


        var currentDeviceType = isMobile() ? 'mobile' : 'desktop';
        for (const [deviceType, listPosition] of Object.entries(settings.elScale)) {
            for (const [originType, className] of Object.entries(listPosition)) {
                var origin = '';
                switch (originType) {
                    case 'topLeft': origin = 'top left'; break;
                    case 'topCenter': origin = 'top center'; break;
                    case 'topRight': origin = 'top right'; break;
                    case 'midLeft': origin = 'center left'; break;
                    case 'midCenter': origin = 'center center'; break;
                    case 'midRight': origin = 'center right'; break;
                    case 'botLeft': origin = 'bottom left'; break;
                    case 'botCenter': origin = 'bottom center'; break;
                    case 'botRight': origin = 'bottom right'; break;
                    case 'fullHeightScale': origin = 'top left'; break;
                    case 'autoHeightScale': origin = 'top left'; break;
                    case 'contentHeightScale': origin = 'top left'; break;
                }

                // console.log(currentDeviceType, deviceType);

                if ((currentDeviceType === deviceType) && $(settings.elScale[deviceType][originType]).length > 0) {
                    $(className).css({
                        transformOrigin: origin,
                        transform: "scale(" + scaleRatio + ")",
                        marginLeft: marginLeft+"px"
                    });
                }

                // console.log(originType);

                if (originType == 'fullHeightScale') {
                    $(className).css({
                        height: "calc(100vh * " + 1/scaleRatio + ")"
                    });
                }

                if (originType == 'autoHeightScale') {

                    $(className).each(function(){
                        var itsHeight = $(this).css('height');
                        itsHeight = parseInt(itsHeight.replace("px",""));
                        var cssRescaleHeight = { 
                            height: "calc("+itsHeight+"px * " + scaleRatio + ")"
                        }
                        $(this).parent().css(cssRescaleHeight);
                        $(this).parent().prev().css(cssRescaleHeight);
                        $(this).parent().parent().css(cssRescaleHeight);
                        // $(this).parent().parent().parent().css(cssRescaleHeight);
                    });
                } 
            }
        }

        var elBurgerMenuScale = settings.elSpecial.burgerMenu;
        if ($(elBurgerMenuScale).length > 0) {
            $(elBurgerMenuScale).each(function(){
                var itsHeight = $(this).css('height');
                itsHeight = parseInt(itsHeight.replace("px",""));
                // console.log(itsHeight);

                itsHeight = "100vh";
    
                // var rescaledHeight = itsHeight * 1 / scaleRatio;
                var rescaledHeight = "calc(100vh * " + 1/scaleRatio + ")"
    
                $(elBurgerMenuScale).css({
                    height: rescaledHeight + ""
                });

                // console.log($(elBurgerMenuScale).parent().find("input[type=checkbox]:checked + label + ul"));
                // $(elBurgerMenuScale).parent().find("input[type=checkbox]:checked + label + ul").css({
                //     background: "#ff0000",
                //     maxHeight: rescaledHeight + ""
                // });
                var styleTag = $(`
                    <style>
                        input[type=checkbox]:checked + label + ${elBurgerMenuScale} {
                            max-height: ${rescaledHeight}
                        }
                    </style>
                `);
                    $('html > head').append(styleTag);
                })

        }

        // rescale Height (for element that need full height after scale)
        // TODO

        // elRescaleHeight = settings.elSpecial.rescaleHeight;

        // if ($(elRescaleHeight).length > 0) {

        //     $(elRescaleHeight).each(function(){
        //         itsHeight = $(this).css('height');
        //         itsHeight = parseInt(itsHeight.replace("px",""));
        //         console.log(itsHeight);
    
        //         rescaledHeight = itsHeight * 1 / scaleRatio;
    
        //         $(elRescaleHeight).css({
        //             height: rescaledHeight + "px"
        //         });
        //     })

        // }


        // // rescale max Height (for element that need full height after scale)

        // elRescaleMaxHeight = settings.elSpecial.rescaleMaxHeight;

        // if ($(elRescaleMaxHeight).length > 0) {


        //     itsMaxHeight = $(elRescaleMaxHeight).css('max-height');

        //     rescaledMaxHeight = itsMaxHeight * 1 / scaleRatio;

        //     console.log(itsMaxHeight);

        //     $(elRescaleMaxHeight).css({
        //         maxHeight: rescaledMaxHeight + "px"
        //     });
        // }

        // settings.obj.attr("data-scale-ratio", scaleRatio);

    })

}
