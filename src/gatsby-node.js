import fetch from 'node-fetch';

const fetchConfig = (pluginOptions) => ({
  endpoint: process.env.BCHP6_CMS_GATSBY_SOURCE_ENDPOINT || pluginOptions.endpoint,
  locale: process.env.BCHP6_CMS_GATSBY_SOURCE_LOCALE || pluginOptions.locale,
});

const fetchPages = async ({ endpoint, locale }) => {
  const pagesIndexUrl = `${endpoint}/pages/${locale}`;
  const response = await fetch(pagesIndexUrl);
  const { data } = await response.json();
  return data;
};

// eslint-disable-next-line import/prefer-default-export
export const sourceNodes = async ({ actions, createContentDigest }, pluginOptions) => {
  const { createNode } = actions;
  const config = fetchConfig(pluginOptions);

  const pages = await fetchPages(config);

  return Promise.all(pages.map((page) => createNode({
    id: page.id,
    parent: null,
    children: [],
    internal: {
      contentDigest: createContentDigest(page.id),
      type: page.type,
    },
    slug: page.attributes.slug,
  })));
};
