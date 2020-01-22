import nodeFromResource from './node-helpers';
import transformNode from './node-transformations';
import { fetchSlugs, fetchPage } from './cms-client';

/*
 * Tell Gatsby a bit about our schema, to allow it to execute
 * queries against these fields, even if they aren't used in
 * the CMS.
 *
 * Remaining fields are still inferred by Gatsby.
 *
 * See https://www.gatsbyjs.org/docs/schema-customization
 * See https://github.com/gatsbyjs/gatsby/issues/2392
 */
export const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type CmsImage implements Node {
      src: String
    }

    type CmsPage implements Node {
      description: String
      image: CmsImage
    }

    type CmsRootPage implements Node {
      image: CmsImage
      description: String
      redirect_url: String
      image_opengraph: CmsImage
      author: CmsPage
    }
  `;

  createTypes(typeDefs);
};

export const sourceNodes = async (
  { actions, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  const createNodeFromResource = async resource => {
    const node = await transformNode(nodeFromResource(resource), pluginOptions);

    node.internal.contentDigest = createContentDigest(node);

    return createNode(node);
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
