import markdownConverter from './markdown-converter';

const addNodeProps = (type, func) => {
  return (node, pluginOptions) => {
    if (node.internal.type !== type) return node;

    const newProps = func(node, pluginOptions);

    return {
      ...node,
      ...newProps,
    };
  };
};

export const addSrcToImage = addNodeProps(
  'CmsImage',
  (node, pluginOptions) => ({ src: `${pluginOptions.endpoint}${node.url}` })
);

export const addHtmlToTextBlock = addNodeProps('CmsComponentText', node => ({
  html: markdownConverter.render(node.content),
}));

export default [addSrcToImage, addHtmlToTextBlock];
