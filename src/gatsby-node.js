import nodeFromResource from './node-helpers';
import { fetchSlugs, fetchPage } from './cms-client';
import markdownConverter from './markdown-converter';

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
    type CmsImageFields {
      url: String
    }

    type CmsImage implements Node {
      fields: CmsImageFields
    }

    type CmsRootPage implements Node {
      seo_title_opengraph: String
      seo_description_opengraph: String
      seo_image_opengraph: CmsImage

      seo_title_twitter: String
      seo_description_twitter: String
      seo_image_twitter: CmsImage

      seo_title_search: String
      seo_description_search: String
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
