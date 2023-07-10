const { configGenerator } = require("./webpack.generator.js");

/*

configGenerator(options, dir="", fileNames=[], collections={collection_id: block_ids[]})

*/

module.exports = (env, options) => [
	configGenerator(options, "prod", ["index"], {
		codm_vongquay1: ["ingame", "popup_ingame"],
	}),
	configGenerator(options, "article", ["index"], {
		_article: ["default"],
	}),
];
