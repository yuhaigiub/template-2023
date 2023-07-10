// import ScrollWatch from 'scrollwatch';

const scrollWatch = {
	init: function (options) {
		var defaults = {
			el: ".scrollwatch-pin",
			before: () => {},
			options: {
				watchOnce: false,
				watch: "#sectionHeader",
				scrollThrottle: 20,
				onElementInView: function (e) {
					$(".breadcrumb").removeClass("fixed");
					$(".nav").removeClass("fixed");
				},
				onElementOutOfView: function (e) {
					$(".breadcrumb").addClass("fixed");
					$(".nav").addClass("fixed");
				},
			},
			after: () => {},
		};
		var settings = {
			...defaults,
			...options,
			options: {
				...defaults.options,
				...options.options,
			},
		};

		settings.before();
		const scrollWatchControl = {};
		$(settings.el).each(function () {
			var $el = $(this),
				elId = $(this).attr("id");
			settings.options.watch = "#" + elId;
			scrollWatchControl[elId] = new ScrollWatch(settings.options);
		});
		settings.after();
	},
};

export default scrollWatch;
