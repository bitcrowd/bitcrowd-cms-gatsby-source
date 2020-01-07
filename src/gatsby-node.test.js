import fetch from 'node-fetch';

import * as pagesIndexFixtures from './__test__/fixtures/pages-index';
import * as pagesFixtures from './__test__/fixtures/pages';

import { sourceNodes } from './gatsby-node';

jest.mock('node-fetch', () => jest.fn());

const response = (payload, status) => ({
  ok: status >= 200 && status < 300,
  status: status || 200,
  json: () => payload,
});

const callSubject = async () => {
  const actions = { createNode: jest.fn() };
  const createContentDigest = jest.fn(x => x.id);

  const pluginOptions = { endpoint: 'http://example.net', locale: 'int-en' };

  await sourceNodes({ actions, createContentDigest }, pluginOptions);

  return actions;
};

describe('sourceNodes', () => {
  test('fetches published slugs from the pages#index endpoint', async () => {
    fetch.mockResolvedValue(response(pagesIndexFixtures.empty));

    await callSubject();

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en'
    );
  });

  test('creates a node for each page', async () => {
    fetch.mockResolvedValueOnce(response(pagesIndexFixtures.many));
    fetch.mockResolvedValueOnce(response(pagesFixtures.index));
    fetch.mockResolvedValueOnce(response(pagesFixtures.foo));

    const { createNode } = await callSubject();

    expect(createNode).toHaveBeenNthCalledWith(1, {
      id: 'Page-cb0b940b-b1a3-49fd-bf93-3950223b29fd',
      parent: null,
      children: [],
      internal: {
        type: 'CmsPage',
        contentDigest: 'Page-cb0b940b-b1a3-49fd-bf93-3950223b29fd',
      },
      slug: 'index',
    });

    expect(createNode).toHaveBeenNthCalledWith(2, {
      id: 'Page-4007a470-232b-11ea-aaef-0800200c9a66',
      parent: null,
      children: [],
      internal: {
        type: 'CmsPage',
        contentDigest: 'Page-4007a470-232b-11ea-aaef-0800200c9a66',
      },
      slug: 'the-cat-post',
    });
  });
});
