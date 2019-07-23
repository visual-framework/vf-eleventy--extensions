# vf-eleventy--extensions

This project supports [`vf-eleventy`](https://github.com/visual-framework/vf-eleventy)-based
projects with reusable componentised code, modules and config.

## What's inside and what it does

- `index.js`: the main Eleventy plugin.

### Config

- `config/vfEleventyCommonConfig.js`: Reusable config for sane defaults and to load the below tags and filters.

### Nunjucks tags

in `./tags/`

- `codeblock.js`: outputs highlight code markup
- `markdwon_tag.js`: process a text area as markdown
- `render.js`: port-fork-enhancement of the Fractal render extension for Nunjucks for 11ty and the VF

### Nunjucks filters

in `./filters/`

- `markdown.js`: process a string as markdown
- `section.js`: split the content into excerpt and remainder

## Usage

Note: Projects utilising `vf-eleventy` make use of this package by defualt.

1. a project based off [`vf-eleventy`](https://github.com/visual-framework/vf-eleventy)
2. `yarn add @visual-framework/vf-eleventy--extensions`

3. in `eleventy.js` you should have:

```js
const vfEleventyExtension = require("@visual-framework/vf-eleventy--extensions");
config.addPlugin(vfEleventyExtension);
```

4. in `gulpfile.js` you should have:

```js
global.vfDocsPath      = __dirname + '/node_modules/\@visual-framework/vf-eleventy--extensions/fractal/docs';
```
