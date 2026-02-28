// backend/converter.js
const { preprocess } = require('@glimmer/syntax');
const TemplateTransformer = require('./transformers/template');

function convertFile(content, ext, fileName) {
  const name = toPascalCase(
    fileName.replace(/\.(hbs|js|ts)$/, '')
  );

  if (ext === '.hbs') {
    return convertHBS(content, name);
  } else if (ext === '.js' || ext === '.ts') {
    return convertJS(content, name);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
}

function convertHBS(content, componentName) {
  const ast = preprocess(content);
  const transformer = new TemplateTransformer();
  const jsxBody = transformer.transform(ast);

  const converted = `
import React from 'react';

const ${componentName} = (props) => {
  return (
    <>
      ${jsxBody}
    </>
  );
};

export default ${componentName};
`.trim();

  return { converted, todos: transformer.todos, type: 'HBS Template' };
}

function convertJS(content, componentName) {
  // Basic JS conversion — flag for Claude to assist
  const todos = ['JS component conversion — review logic manually'];
  const converted = `
import React, { useState, useEffect } from 'react';

// TODO: Auto-converted from Ember component
// Original Ember code preserved below as reference

/*
${content}
*/

const ${componentName} = (props) => {
  // TODO: Convert Ember component logic here

  return (
    <div>
      {/* TODO: Add JSX template */}
    </div>
  );
};

export default ${componentName};
`.trim();

  return { converted, todos, type: 'JS Component' };
}

function toPascalCase(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

module.exports = { convertFile };