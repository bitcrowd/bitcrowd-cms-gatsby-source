import fetch from 'node-fetch';

import * as pagesIndexFixtures from './__test__/fixtures/pages-index';
import * as pagesFixtures from './__test__/fixtures/pages';

import { sourceNodes } from './gatsby-node';

jest.mock('node-fetch', () => jest.fn());

afterEach(() => jest.clearAllMocks());

describe('sourceNodes', () => {
  async function callSubject() {
    const actions = { createNode: jest.fn() };
    const createContentDigest = jest.fn(x => x.id);

    const pluginOptions = { endpoint: 'http://example.net', locale: 'int-en' };

    await sourceNodes({ actions, createContentDigest }, pluginOptions);

    return actions;
  }

  test('fetches published slugs from the pages#index endpoint', async () => {
    fetch.mockResolvedValue(pagesIndexFixtures.empty);

    await callSubject();

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en'
    );
  });

  test('creates a node for all includes resources and each page', async () => {
    fetch.mockResolvedValueOnce(pagesIndexFixtures.many);
    fetch.mockResolvedValueOnce(pagesFixtures.index);
    fetch.mockResolvedValueOnce(pagesFixtures.theCatPost);

    const { createNode } = await callSubject();

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://example.net/api/v1/pages/int-en'
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en/index'
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en/the-cat-post'
    );

    expect(createNode).toHaveBeenCalledWith({
      id: 'Page-cb0b940b-b1a3-49fd-bf93-3950223b29fd',
      parent: null,
      children: [],
      internal: {
        type: 'CmsPage',
        contentDigest: 'Page-cb0b940b-b1a3-49fd-bf93-3950223b29fd',
      },
      slug: 'index',
    });

    expect(createNode).toHaveBeenCalledWith({
      id: 'component/text-49bbbd10-8bdc-48de-9bcf-a46f56195c1b',
      parent: null,
      children: [],
      internal: {
        type: 'CmsComponentText',
        contentDigest: 'component/text-49bbbd10-8bdc-48de-9bcf-a46f56195c1b',
      },
      content: 'Cats write short articles',
      html: '<p>Cats write short articles</p>\n',
    });

    expect(createNode).toHaveBeenCalledWith({
      id: 'Page-4007a470-232b-11ea-aaef-0800200c9a66',
      parent: null,
      children: [],
      blocks___NODE: ['component/text-49bbbd10-8bdc-48de-9bcf-a46f56195c1b'],
      internal: {
        type: 'CmsPage',
        contentDigest: 'Page-4007a470-232b-11ea-aaef-0800200c9a66',
      },
      slug: 'the-cat-post',
    });
  });
});
