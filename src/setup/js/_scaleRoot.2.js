// SCALE PLATFORM
// | Especially use for Web Platform 3.0 / 2022
// | Although WP3.2.3 is preventing non-responsive design, there still have some
// | unexpected input PSD from outsource, out-dated designers.

import config from "../../setup/config";

$.fn.scalePlatform = function (options) {
	var defaults = {
		obj: $(this),
		designSafe: {
			// if width of device smaller safe zone, then init scale.
			desktop: config.widthTriggerScale,
			mobile: config.widthTriggerScale,
		},
		designWidth: {
			desktop: config.widthDesktop,
			mobile: config.widthMobile,
		},
		designHeight: {
			desktop: config.heightDesktop,
			mobile: config.heightMobile,
		},
		mode: "", //scaleForWidth
		elScale: {
			desktop: ".scaleDesktop",
			mobile: ".scaleMobile",
		},
		dataScale: "data-scale-ratio",
		dataDevice: "data-device-type",
		dataDisplay: {
			desktop: "data-desktop-display",
			mobile: "data-mobile-display",
		},
		dataOrigin: {
			desktop: "data-desktop-origin",
			mobile: "data-mobile-origin",
		},
		rescaleForParent: true,
		deviceHeightStyleTag: {
			fix: "fixDeviceHeight",
			max: "maxDeviceHeight",
		},
		deviceHeightStyleVar: "--sr-device-height",
		deviceScaleRatioStyleVar: "--sr-scale-ratio",
	};
	var settings = $.extend(defaults, options);

	var setToDefault = (function () {
		$(settings.obj).attr("style", "");
		$(settings.obj).parent().attr("style", "");
		$(settings.elScale.desktop + " , " + settings.elScale.mobile).each(function () {
			$(this).attr("style", "");
		});
		$(settings.obj).parent().attr(settings.dataScale, 1);

		// console.log('set to default');
	})();

	var device = {
		width: $(window).outerWidth(),
		height: $(window).innerHeight(),
	};

	// console.log(device);

	var isMobile = (width = device.width, height = device.height) => width <= 700 || width < height;

    // NOTE: ratio = deviceWidth / desingWidth
	var scaleRatio = isMobile()
			? device.width / settings.designWidth.mobile
			: device.width / settings.designWidth.desktop,
		marginLeft = 0;

    // TODO: not quite sure what this does
    if (settings.deviceHeightStyleTag != false && $("#deviceHeightStyleTag").length < 1) {
        // NOTE: w1 / w = h / h1
		var rescaledHeight = "calc(100vh * " + 1 / scaleRatio + ")";
		var styleTag = $(`
            <style id="deviceHeightStyleTag">
                .${settings.deviceHeightStyleTag.max} {
                    max-height: ${rescaledHeight}
                }
                .${settings.deviceHeightStyleTag.fix} {
                    height: ${rescaledHeight}
                }
            </style>
        `);
		$("html > head").append(styleTag);
    }
    
    // TODO: not quite sure what this does
    if (settings.deviceHeightStyleVar != false && $("#deviceHeightStyleVar").length < 1) {
        // NOTE: w1 / w = h / h1
		var rescaledHeight = "calc(100vh * " + 1 / scaleRatio + ")";
		var styleTag = $(`
            <style id="deviceHeightStyleVar">
                :root {
                    ${settings.deviceHeightStyleVar}: ${rescaledHeight};
                    ${settings.deviceScaleRatioStyleVar}: ${scaleRatio}
                }
            </style>
        `);
		$("html > head").append(styleTag);
	}

	$(settings.elScale.desktop + " , " + settings.elScale.mobile).each(function () {
		var scaleOrigin = (isMobile = isMobile()) => {
			if (isMobile && $(this).attr(settings.dataOrigin.mobile) != undefined) {
				return $(this).attr(settings.dataOrigin.mobile);
			} else if ($(this).attr(settings.dataOrigin.desktop) != undefined) {
				return $(this).attr(settings.dataOrigin.desktop);
			}
			return "top left";
		};

		var display = (isMobile = isMobile()) => {
			// console.log(isMobile);
			if (isMobile && $(this).attr(settings.dataDisplay.mobile) != undefined) {
				return $(this).attr(settings.dataDisplay.mobile);
			} else if ($(this).attr(settings.dataDisplay.desktop) != undefined) {
				return $(this).attr(settings.dataDisplay.desktop);
			}
			return "block";
		};


        // NOTE: scale #wrapper
		if (
			(isMobile() && $(this).hasClass(settings.elScale.mobile.replace(".", ""))) ||
			(!isMobile() && $(this).hasClass(settings.elScale.desktop.replace(".", "")))
		) {
			$(this).css({
				transform: "scale(" + scaleRatio + ")",
				marginLeft: marginLeft + "px",
				transformOrigin: scaleOrigin,
				// display: display
			});
		}
	});

    // NOTE: scale the parent (body) element
	if (settings.rescaleForParent) {
		var obj = {
			height: settings.obj.outerHeight(),
		};
		var scaleHeight = obj.height * scaleRatio;
		$(settings.obj)
			.parent()
			.css({
				height: scaleHeight + "px",
				// width: device.width + "px"
			});
	}

    // NOTE: add attribute to parent (body)
	$(settings.obj).parent().attr(settings.dataScale, scaleRatio);
	$(settings.obj)
		.parent()
		.attr(settings.dataDevice, isMobile() ? "mobile" : "desktop");
};
