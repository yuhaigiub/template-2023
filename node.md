- Remove old ./dist
- Copy ./src/setup/scripts/res/dist -> ./dist
- Blocks -> ./dist/src/{collection}/{block}
- Blocks -> ./dist/webpack.config.js
- Blocks -> ./dist/src/prod/js/\_blockBundles.js
- Blocks -> ./dist/src/prod/html/index.html.twig
- Article -> ./dist/src/article

# Yuhaigiub Notes:

<!--
template structures:
--------------------
/src
    |---_article
    |   |---default
    |   |   |---assets
    |   |       |--default.scss
    |   |
    |   |---index.scss
    |
    |---article
    |
    |---prod
    |   |---assets
    |   |   |---fonts ==> (put fonts here)
    |   |
    |   |---html
    |   |   |---index.html.twig
    |   |
    |   |---js
    |   |   |---_adimin.js
    |   |   |---_blockBundles.js
    |   |   |---index.js
    |   |
    |   |---scss
    |   |   |---_admin.scss
    |   |   |---_loader.scss
    |   |   |---index.scss
    |   |
    |   |---index.js
    |
    |---${collection}
    |   |---${block} ==> (we can have as many blocks as we want)
    |       |---assets
    |       |   |---images ==> (put images here)
    |       |
    |       |---sprite ==> (put sprites here)
    |       |---${block}.html.twig
    |       |---${block}.js
    |       |---${block}.scss
    |
    |---setup
        |---assets
        |
        |---html
        |
        |---js
        |
        |---scss
        |
        |---config_var.scss
        |---config.scss
        |---config.js
-->