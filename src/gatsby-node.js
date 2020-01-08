import nodeFromResource from './node-helpers';
import { fetchSlugs, fetchPage } from './cms-client';

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

export const onCreateNode = ({ node, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'CmsImage') {
    createNodeField({
      node,
      name: 'src',
      value: `${pluginOptions.endpoint}${node.url}`,
    });
  }
};
