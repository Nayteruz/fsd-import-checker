"use strict";

const path = require('path');
const {isPathRelative, getNormalizedCurrentFilePath} = require('../helpers')

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        const isDefaultImport = node.specifiers[0]?.type === 'ImportDefaultSpecifier' || false;

        // example C:\Users\tim\Desktop\javascript\production_project\src\entities\Article
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)){
          context.report({
            node,
            message: 'В рамках одного слайса все пути должны быть относительными',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename) // Entities/Article/ArticleDetails.tsx
                  .split('/')
                  .slice(0, -1)
                  .join('/');
              // путь для windows
              let relativePath = path.relative(normalizedPath, `/${importTo}`)
                  .split('\\')
                  .join('/');
              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          });
        }

        if (!isDefaultImport && sharedLayerShouldBeAbsolute(fromFilename, importTo)){
          context.report({
            node,
            message: 'В слайсе shared все пути должны быть абсолютными',
            fix: (fixer) => {
              // Entities/Article/ArticleDetails.tsx
              const splitPath = getNormalizedCurrentFilePath(fromFilename).split('/').slice(0, -1).join('/');
              const countUp = importTo.split('../').length - 1;
              const splitWithCountUp = splitPath.split('/').slice(0, -countUp).join('/');
              const importReplaced = importTo.replaceAll('../', '');

              return fixer.replaceText(node.source, `'${alias}${splitWithCountUp}/${importReplaced}'`)
            }
          });
        }

      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function shouldBeRelative(from, to) {
  // example C:\Users\tim\Desktop\javascript\production_project\src\entities\Article
  const normalizedPath = getNormalizedCurrentFilePath(from);
  const [, fromLayer, fromSlice] = normalizedPath.split('/') // entities, Article

  // example app/entities/Article
  const [toLayer, toSlice] = to.split('/'); // entities, Article

  if (fromLayer === 'shared') {
    return false
  }

  if (isPathRelative(to)){
    return false;
  }

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}

// for shared Layer
function sharedLayerShouldBeAbsolute(from, to) {
  // example C:\Users\tim\Desktop\javascript\production_project\src\entities\Article
  const normalizedPath = getNormalizedCurrentFilePath(from);
  const [, fromLayer, fromSlice] = normalizedPath.split('/') // entities, Article

  // example app/entities/Article
  const [toLayer, toSlice] = to.split('/'); // entities, Article

  if (fromLayer !== 'shared' || toLayer ==='.') {
    return false;
  }

  if (isPathRelative(to)){
    return true;
  }

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return !(fromLayer === toLayer && toLayer === 'shared');
}