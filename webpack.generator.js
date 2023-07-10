"use strict";

const _DIST_DIR = "prod";
const _TMP_DIR = "tmp";

// core
const webpack = require("webpack");
// lib
const path = require("path");
// plugin
const SpritesmithPlugin = require("webpack-spritesmith");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackCdnPlugin = require("webpack-cdn-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//---- GENERATOR

// modules that you want to externalized
var webpackCdnModules = [
	{
		name: "jquery",
		var: "$, jQuery",
		path: "dist/jquery.js",
	},
	{
		name: "swiper",
		var: "Swiper",
		path: "swiper-bundle.js",
	},
	{
		name: "swiper/swiper-bundle",
		var: "Swiper",
		path: "swiper-bundle.min.js",
	},
	{
		name: "@cycjimmy/swiper-animation",
		var: "SwiperAnimation",
		path: "dist/swiper-animation.umd.min.js",
	},
	{
		name: "scrollwatch",
		var: "scrollwatch",
		path: "dist/ScrollWatch-2.0.1.min.js",
	},
	{
		name: "lazysizes",
		var: "lazysizes",
		path: "lazysizes.min.js",
	},
	{
		name: "@fancyapps/fancybox",
		var: "fancybox",
		path: "dist/jquery.fancybox.js",
	},
	{
		name: "choices.js",
		var: "Choices",
		path: "public/assets/scripts/choices.js",
	},
	{
		name: "@yaireo/tagify",
		var: "Tagify",
		path: "dist/jQuery.tagify.min.js",
	},
	{
		name: "sortablejs",
		var: "Sortable",
		path: "Sortable.min.js",
	},
	{
		name: "list.js",
		var: "List",
		path: "dist/list.min.js",
	},
	{
		name: "fabric",
		var: "fabric",
		path: "dist/fabric.min.js",
	},
	{
		name: "twig",
		var: "Twig",
		path: "twig.min.js",
	},
];

// generate a webpack build
const pluginGenerator = (options, dir, fileNames = [], collections = []) => {
	const commonPlugin = [
		// remove/clean your build folders
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
		}),

		// live reload when running webpack --watch
		new LiveReloadPlugin(),

		// allow passing node.js env variables to the browser
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),

		// create css per js file
		new MiniCssExtractPlugin({
			filename: `${dir}.css`,
			chunkFilename: `[id].${dir}.css`,
			ignoreOrder: true,
		}),

		// copy files that already exist in /src to your build under ${dir}/assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, `src/setup/assets/test-api`),
				to: path.resolve(__dirname, `${dir}/assets/test-api`),
				logLevel: "debug",
				force: true,
			},
		]),
	];

	let customPlugin = [...commonPlugin];

	// a collection can contains multiple blocks
	// each block will have some dependencies (assets) located in /assets
	// this code is used to bundle these asset into the build
	Object.entries(collections).forEach(([collection_id, block_list]) => {
		block_list.forEach((block_id) => {
			customPlugin.push(
				new CopyWebpackPlugin([
					{
						from: path.resolve(__dirname, `src/${collection_id}/${block_id}/assets`),
						to: path.resolve(__dirname, `${_DIST_DIR}/${collection_id}/${block_id}`),
						logLevel: "debug",
						force: true,
					},
				])
			);

			// create a sprite per block (to reduce the number of image requests)
			customPlugin.push(makeCollectionSprite(collection_id, block_id));
		});
	});

	// generate html based on a template
	fileNames.forEach((fileName) => {
		customPlugin.push(
			new HtmlWebpackPlugin({
				filename: `${fileName}.html`,
				template: `src/${dir}/html/${fileName}.html.twig`,
				options: options,
			})
		);

		// why duplicate here ?
		switch (fileName) {
			case "article":
				customPlugin.push(
					new HtmlWebpackPlugin({
						filename: `${fileName}.html`,
						template: `src/${dir}/html/${fileName}.html.twig`,
						options: options,
						inject: false,
					})
				);
				break;
			case "iframe":
				customPlugin.push(
					new HtmlWebpackPlugin({
						filename: `${fileName}.html`,
						template: `src/${dir}/html/${fileName}.html.twig`,
						options: options,
						inject: false,
					})
				);
				break;
			default:
				customPlugin.push(
					new HtmlWebpackPlugin({
						filename: `${fileName}.html`,
						template: `src/${dir}/html/${fileName}.html.twig`,
						options: options,
					})
				);
				break;
		}

		// externalize from node_modules in development and a CDN in production
		customPlugin.push(
			new WebpackCdnPlugin({
				modules: webpackCdnModules,
				publicPath: "/platform", // publicPath !== "node_modules ???"
			})
		);
	});

	// if (dir == _DIST_DIR) {
	//     customPlugin.push(
	//         new BundleAnalyzerPlugin()
	//     );
	// }

	return customPlugin;
};

// LOADER

const makeCollectionSprite = (pathRoot, pathSprite) =>
	new SpritesmithPlugin({
		src: {
			cwd: path.resolve(__dirname, "src/" + pathRoot, pathSprite, "sprite"),
			glob: "*.{jpg,png}",
		},
		target: {
			image: path.resolve(__dirname, "src/" + pathRoot, pathSprite, "assets", "_sprites" + ".png"),
			css: path.resolve(__dirname, "src/" + pathRoot, pathSprite, "_sprites" + ".scss"),
		},
		apiOptions: {
			// cssImageRef: '../assets/_sprites-' + pathSprite + '.png'
			// cssImageRef: '../../../' + pathRoot + "/" + pathSprite + '/_sprites' + '.png'
			// cssImageRef: '../' + pathRoot + '/' + pathSprite + '/' +  '_sprites.png',
			cssImageRef: "assets/_sprites" + ".png",
		},
		spritesmithOptions: {
			padding: 2,
		},
	});

const styleLoader = (pathRoot) => {
	return {
		test: /\.(sa|sc|c)ss$/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: `../${pathRoot}`,
				},
			},
			{
				loader: "css-loader",
				options: {
					sourceMap: true,
				},
			},
			{
				loader: "postcss-loader",
				options: {
					postcssOptions: {
						plugins: [require("autoprefixer")],
					},
					sourceMap: true,
				},
			},
			{
				loader: "sass-loader",
				options: {
					sourceMap: true,
				},
			},
		],
	};
};

// load asset files (images, videos, fonts, but no audio ????)
const fileLoader = (pathRoot) => {
	return {
		test: /\.(svg|png|jpe?g|gif|mp4|otf|eot|ttf|woff|woff2)$/,
		use: [
			{
				loader: "url-loader",
				options: {
					limit: false,
					name: "[path][name].[ext]",
					// publicPath: (_, resourcePath, __) => {
					// 	//   console.log(_, resourcePath, __);
					// 	return 'assets/' + resourcePath.replace(/[\\]/g, "/").replace(/^(.*?)(assets\/)/g, "");
					// },
					// outputPath: (_, resourcePath, __) => {
					// 	//   console.log(_, resourcePath, __);
					// 	return 'assets/' + resourcePath.replace(/[\\]/g, "/").replace(/^(.*?)(assets)/g, "");
					// }

					publicPath: (_, resourcePath, __) => {
						// console.log(_, resourcePath, __);
						return "../" + _.replace("src/", `${_DIST_DIR}/`).replace("assets/", "");
						// return 'assets/' + resourcePath.replace(/[\\]/g, "/").replace(/^(.*?)(assets\/)/g, "");
					},
					outputPath: (_, resourcePath, __) => {
						// console.log(_, resourcePath, __);
						return "../" + _.replace("src/", `${_DIST_DIR}/`).replace("assets/", "");
						// return 'assets/' + resourcePath.replace(/[\\]/g, "/").replace(/^(.*?)(assets)/g, "");
					},
				},
			},
		],
	};
};

// use babel to load .js files
const scriptLoader = (pathRoot) => {
	return {
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
			loader: "babel-loader",
		},
	};
};

// use twig.js to load .twig files
const twigLoader = (_) => {
	return {
		test: /\.twig$/,
		use: [
			{
				loader: "twig-loader",
				options: {},
			},
		],
	};
};

module.exports = {
	configGenerator: (options, dir, fileNames = [], collections = {}) => {
		// console.log(options, dir, fileNames, spriteGroups);
		return {
			name: dir,
			entry: [`./src/${dir}/index.js`],
			devtool: options.mode === "production" ? "" : "source-map",
			output: {
				filename: `./${dir}.bundle.js`,
				path: path.resolve(__dirname, `${dir}`),
				publicPath: `./`,
			},
			// externals: {
			//     "jquery": "jquery",
			//     "jQuery": "jquery",
			//     "lazysizes": "lazysizes"
			// },
			stats: {
				// copied from `'minimal'`
				all: false,
				modules: true,
				maxModules: 0,
				errors: true,
				warnings: false,
				// our additional options
				moduleTrace: true,
				errorDetails: true,
			},
			module: {
				rules: [fileLoader(dir), twigLoader(dir), scriptLoader(dir), styleLoader(dir)],
			},
			optimization: {
				minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
				splitChunks: {
					cacheGroups: {
						commons: {
							test: /[\\/]node_modules[\\/]/,
							name: "0",
							chunks: "all",
						},
					},
				},
			},
			plugins: pluginGenerator(options, dir, fileNames, collections),
			node: {
				fs: "empty",
			},
		};
	},
};
