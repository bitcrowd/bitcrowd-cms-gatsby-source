import EmbedJS from 'embed-js';
import noembed from 'embed-plugin-noembed';
import fetch from 'node-fetch';
import markdownConverter from './markdown-converter';

const addNodeProps = (type, func) => {
  return async (node, pluginOptions) => {
    if (node.internal.type !== type) return node;

    const newProps = await func(node, pluginOptions);

    return {
      ...node,
      ...newProps,
    };
  };
};

export const addEmbedToMediaBlock = addNodeProps(
  'CmsComponentMedia',
  async node => {
    const embed = new EmbedJS({
      fetch,
      replaceUrl: true,
      input: node.url,
      plugins: [noembed({})],
    });

    const html = await embed.text().then(({ result }) => result);

    return { html };
  }
);

export const addSrcToImage = addNodeProps(
  'CmsImage',
  (node, pluginOptions) => ({ src: `${pluginOptions.endpoint}${node.url}` })
);

export const addHtmlToTextBlock = addNodeProps('CmsComponentText', node => ({
  html: markdownConverter.render(node.content),
}));

const nodeTransformations = [
  addEmbedToMediaBlock,
  addSrcToImage,
  addHtmlToTextBlock,
];

const transformNode = (node, pluginOptions) =>
  nodeTransformations.reduce(async (previous, transformation) => {
    const current = await previous;
    return transformation(current, pluginOptions);
  }, Promise.resolve(node));

export default transformNode;
