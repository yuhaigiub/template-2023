var blockBundles;

/*
interface blockBundles = {
			${collection_id}: {
				${group_id}: {
					${block_id}: {
						html: require(url),
						scss: require(url),
						js: require(url),
						dir: "${collection_id}/${group_id}/${group_id}"
					}
				}
			}
}
*/

try {
	blockBundles = {
		// insert bundle here
		collection: {
			content: {
				component: {
					html: require('../../collection/component/component.html.twig'),
					html: require('../../collection/component/component.scss'),
					html: require('../../collection/component/component.js'),
					dir: '../../collection/component/component',
				}
			}
		}
	};
} catch (error) {
	console.log(error);
}

export default blockBundles;
