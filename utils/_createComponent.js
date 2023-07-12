const fs = require("fs");
const path = require("path");

// change this part to create different blocks according to your need
const workList = {
	collection: ["component"],
};

//-------------------------------------------------------------------

const htmlTemplate = `{% spaceless %}
{% set blockId = blockId|default("component_id") %}
{% set blockIdPostFix = blockIdPostFix|default("") %}
	<section id="{{ blockId }}{{ blockIdPostFix }}" class="section section--{{ blockId }} {{ blockId }} scrollFrame" data-block-id="{{ blockId }}">
		<div class="section__background">
			{# NOTE: add background images and video here #}
			<span id="{{ blockId }}{{ blockIdPostFix }}-scrollwatch-pin" class="scrollwatch-pin"></span>
		</div>
		<div class="section__content">
			<div class="inner inner--{{ blockId }}">
				{# NOTE: add component's content here #}
			</div>
		</div>
	</section>
{% endspaceless %}
`;

const scssTemplate = `@import "../index.scss";\n@import "./sprites";

.component_id {
	@include grid-media($portrait) {
		&,
		.section__background,
		.section__content,
		.inner {
			height: 1080px;
		}
	}

	@include grid-media($landscape) {
		&,
		.section__background,
		.section__content,
		.inner {
			height: 1080px;
		}
	}
}
`

function createCollection(collectionId, componentId) {
	const prefix = path.resolve(__dirname, "../src");
	// if the collection doesn't exist then create it
	if (!fs.existsSync(path.resolve(prefix, collectionId))) {
		fs.mkdirSync(path.resolve(prefix, collectionId));

		fs.appendFile(
			path.resolve(prefix, `${collectionId}/index.scss`),
			`@import "../setup/config";\n@import "bourbon-neat";\n@import "../setup/scss/mixins";\n@import "../setup/scss/easing";`,
			function (err) {
				if (err) console.log(err.message);
			}
		);

		fs.appendFile(path.resolve(prefix, `${collectionId}/index.js`), ``, function (err) {
			if (err) console.log(err.message);
		});
	}

	// if the component already exist then don't create anything new
	const componentDir = path.resolve(prefix, `${collectionId}/${componentId}`);
	if (!fs.existsSync(componentDir)) {
		fs.mkdirSync(componentDir);
	} else {
		console.log(`"${componentId}" already exist, recreating will risk losing important data`);
		return;
	}

	// create collection's asset folders
	fs.mkdirSync(path.resolve(componentDir, `assets`));
	fs.mkdirSync(path.resolve(componentDir, `assets/images`));
	fs.mkdirSync(path.resolve(componentDir, `sprite`));

	// let git tracks empty folders
	fs.appendFile(path.resolve(componentDir, `assets/.gitkeep`), "", logError);
	fs.appendFile(path.resolve(componentDir, `assets/images/.gitkeep`), "", logError);
	fs.appendFile(path.resolve(componentDir, `sprite/.gitkeep`), "", logError);

	// create html, css, js file
	const filesExtensions = ["html.twig", "scss", "js"];
	filesExtensions.map((ext) => {
		const filePath = path.resolve(componentDir, `${componentId}.${ext}`);
		let content = "";
		if (ext === "html.twig") content = htmlTemplate;
		else if (ext === "scss") content = scssTemplate;
		fs.appendFile(filePath, content, logError);
	});
}

function logError(err) {
	if (err) {
		console.log(err.message);
	}
}

// main loop
for (let [collection, components] of Object.entries(workList)) {
	components.map((component) => createCollection(collection, component));
}
