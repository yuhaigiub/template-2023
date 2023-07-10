import admin from "./_admin";
import "../../setup/js/_toggleClass";
import "../../setup/js/_scaleRoot.2";
import "../../setup/js/_swiper";
import "../../setup/js/_universalLink";
import "../../setup/js/_scrollwatch";
// import "lazysizes";
// import "@fancyapps/fancybox";

window.addEventListener("load", function () {
	var url = new URL(window.location.href);
	var param_admin = url.searchParams.get("admin");
	admin.init();
	admin.executeFunctions();

	$("#wrapper").scalePlatform();
	$(window).on("resize", function () {
		$("#wrapper").scalePlatform();
	});
	commonLibs();

	$("[data-fancybox]").fancybox({
		caption: function (instance, item) {
			return $(this).find("figcaption").html();
		},
	});
});

var commonLibs = function () {
	$("#wrapper").scalePlatform();

	$(".onelink").each(function () {
		$(".onelink").universalLink();
	});

	$("#navBurger").each(function () {
		$("#navBurger").toggleClassname({
			toggle: [
				{
					el: $("#floattop"),
					className: "active",
				},
				{
					el: $("#floatnav"),
					className: "active",
				},
				{
					el: $("#navBurger"),
					className: "is-active",
				},
				{
					el: $("#navBurger"),
					className: "active",
				},
			],
		});
	});

	$("#subwebBurger").each(function () {
		$("#subwebBurger").toggleClassname({
			toggle: [
				{
					el: $(".midbar__menu"),
					className: "active",
				},
				{
					el: $("#subwebBurger"),
					className: "is-active",
				},
			],
		});
	});

	$("#asideRightToggle").each(function () {
		$(this).toggleClassname({
			toggle: [
				{
					el: $(".floatright__main"),
					className: "active",
				},
				{
					el: $(".floatright .aside"),
					className: "active",
				},
			],
		});
	});

	$(".scrollTop").each(function () {
		$(this).on("click", function () {
			$("html, body").animate({ scrollTop: 0 }, 400);
		});
	});

	// if ($("[data-lightbox]").length > 0) {
	//     $("[data-lightbox]").each(function () {
	//         $(this).lightBox({
	//             objLightBox: $(this).attr('href'),
	//             type: $(this).data('lightbox-type')
	//         });
	//     });
	// }
};
