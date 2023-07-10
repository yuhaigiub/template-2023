import blockBundles from "./_blockBundles";
import FontPicker from "font-picker";

var admin = {
	init: function (options) {
		var defaults = {
			on: {
				update: function () {},
			},
		};
		var settings = $.extend(defaults, options);

		admin.initFont(options);

		return true;
	},
	initFont: function (options) {
		// console.log("A");

		var fontPickerOptions = {
			sort: "popularity",
			families: [
				"Roboto",
				"Roboto Condensed",
				"Roboto Flex",
				"Barlow",
				"Barlow Condensed",
				"Barlow Semi Condensed",
				"Montserrat",
				"Philosopher",
				"Noto Sans",
				"Sarabun",
				"Arsenal",
				"Faustina",
				"Bai Jamjuree",
				"Rowdies",
				"Be Vietnam Pro",
				"Nunito",
				"Signika",
				"Quicksand",
				"Titillium Web",
				"Oxygen",
				"Noto Sans TC",
			],
			// "scripts": ["Vietnamese"]
		};

		window.fontPickerPrimary = new FontPicker(
			"AIzaSyBxqeghm6vBR5BLIoXjQG4PCU_A6sGSNTw", // Google API key
			"Barlow", // Default font
			{
				...fontPickerOptions,
				pickerId: "primary",
			}
		);
		window.fontPickerSecondary = new FontPicker(
			"AIzaSyBxqeghm6vBR5BLIoXjQG4PCU_A6sGSNTw", // Google API key
			"Barlow", // Default font
			{
				...fontPickerOptions,
				pickerId: "secondary",
			}
		);
	},
	executeFunctions: function () {
		$("[data-block-id]").each(function () {
			var blockId = $(this).attr("data-block-id"),
				blockUniqueId = $(this).attr("id");
			// console.log(blockId, blockUniqueId);
			$(document).trigger(blockId, [blockUniqueId]);
		});
	},
};

export default admin;
