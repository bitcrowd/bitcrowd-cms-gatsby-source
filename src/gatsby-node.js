import nodeType from './node-type';
import * as CmsClient from './cms-client';

const nodeId = resource => `${resource.type}-${resource.id}`;

export const sourceNodes = async (
  { actions, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  const createNodeFromResource = async resource => {
    const relationships = {};
    Object.entries(resource.relationships || {})
      .filter(arr => 'data' in arr[1] && arr[1].data !== null)
      .forEach(([key, { data }]) => {
        const relKey = `${key}___NODE`;

        if (data instanceof Array) {
          relationships[relKey] = data.map(nodeId);
        } else {
          relationships[relKey] = nodeId(data);
        }
      });

    const node = {
      id: nodeId(resource),
      parent: null,
      children: [],
      ...resource.attributes,
      ...relationships,
    };

    const internal = {
      type: nodeType(resource.type),
      contentDigest: createContentDigest(node),
    };
    const created = await createNode({ ...node, internal });

    return created;
  };

  // Fetch slugs of published pages.
  const slugs = await CmsClient.fetchSlugs(pluginOptions);

  return Promise.all(
    slugs.map(async slug => {
      const { data, included } = await CmsClient.fetchPage(pluginOptions, slug);

      // First create nodes for all included resources.
      await Promise.all(
        included.map(async resource => createNodeFromResource(resource))
      );

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
