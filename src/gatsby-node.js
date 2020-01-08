import nodeFromResource from './node-helpers';
import { fetchSlugs, fetchPage } from './cms-client';
import markdownConverter from './markdown-converter';

export const sourceNodes = async (
  { actions, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  const createNodeFromResource = async resource => {
    const node = nodeFromResource(resource, createContentDigest);
    const created = await createNode(node);
    return created;
  };

  // Fetch slugs of published pages.
  const slugs = await fetchSlugs(pluginOptions);

  return Promise.all(
    slugs.map(async slug => {
      const { data, included } = await fetchPage(pluginOptions, slug);

      // First create nodes for all included resources.
      await Promise.all(included.map(createNodeFromResource));

      // Create page node.
      return createNodeFromResource(data);
    })
  );
};

const addUrlToImage = ({ node, actions }, pluginOptions) => {
  if (node.internal.type !== 'CmsImage') return;

  const { createNodeField } = actions;

  createNodeField({
    node,
    name: 'src',
    value: `${pluginOptions.endpoint}${node.url}`,
  });
};

const addHtmlToTextBlock = ({ node, actions }) => {
  if (node.internal.type !== 'CmsComponentText') return;

  const { createNodeField } = actions;

  createNodeField({
    node,
    name: 'html',
    value: markdownConverter.render(node.content),
  });
};

export const onCreateNode = (opts, pluginOptions) => {
  addUrlToImage(opts, pluginOptions);
  addHtmlToTextBlock(opts, pluginOptions);
};
