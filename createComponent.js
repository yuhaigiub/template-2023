const fs = require("fs");
const path = require("path");

const workList = {
	collection: ["component"],
};

for (let [collection, components] of Object.entries(workList)) {
	components.map((component) => {
		createCollection(collection, component);
	});
}

function createCollection(collectionId, componentId) {
	const prefix = path.resolve(__dirname, "src");

	if (!fs.existsSync(path.resolve(prefix, collectionId))) {
		fs.mkdirSync(path.resolve(prefix, collectionId));

		fs.appendFile(
			path.resolve(prefix, `${collectionId}/index.scss`),
			`@import "../setup/config";\n@import "bourbon-neat";\n@import "../setup/scss/mixins";\n@import "../setup/scss/easing;`,
			function (err) {
				if (err) console.log(err.message);
			}
		);

		fs.appendFile(path.resolve(prefix, `${collectionId}/index.js`), ``, function (err) {
			if (err) console.log(err.message);
		});
	}

	const componentDir = path.resolve(prefix, `${collectionId}/${componentId}`);
	if (!fs.existsSync(componentDir)) {
		fs.mkdirSync(componentDir);
	} else {
		console.log(`"${componentId}" already exist, recreating will risk losing important data`);
		return;
	}

	fs.mkdirSync(path.resolve(componentDir, `assets`));
	fs.mkdirSync(path.resolve(componentDir, `assets/images`));
	fs.mkdirSync(path.resolve(componentDir, `sprite`));

	["html.twig", "scss", "js"].map((ext) => {
		const filePath = path.resolve(componentDir, `${componentId}.${ext}`);
		fs.appendFile(filePath, "", function (err) {
			if (err) console.log(err.message);
		});
	});
}
