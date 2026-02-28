// backend/transformers/template.js
class TemplateTransformer {
  constructor() {
    this.todos = [];
  }

  transform(ast) {
    // Simple transformation of Handlebars AST to JSX
    return this.transformNode(ast);
  }

  transformNode(node) {
    if (!node) return '';

    if (node.type === 'Template') {
      return node.body.map(child => this.transformNode(child)).join('\n');
    }

    if (node.type === 'TextNode') {
      return node.chars.trim() ? `<span>${node.chars}</span>` : '';
    }

    if (node.type === 'ElementNode') {
      const attrs = node.attributes.map(attr => 
        `${attr.name}="${attr.value.chars || ''}"`
      ).join(' ');
      
      const children = node.children.map(child => this.transformNode(child)).join('');
      const attrsStr = attrs ? ` ${attrs}` : '';
      
      return `<${node.tag}${attrsStr}>${children}</${node.tag}>`;
    }

    if (node.type === 'MustacheStatement') {
      this.todos.push('Review variable interpolation: {{' + node.path.original + '}}');
      return `{${node.path.original}}`;
    }

    if (node.type === 'BlockStatement') {
      this.todos.push('Review conditional/loop block: {{#' + node.path.original + '}}');
      return '{{#' + node.path.original + '}}...{{/' + node.path.original + '}}';
    }

    return '';
  }
}

module.exports = TemplateTransformer;
