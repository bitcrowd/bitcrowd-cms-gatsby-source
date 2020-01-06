import fetch from 'node-fetch';

import * as pagesIndexFixtures from './__test__/fixtures/pages-index';

import { sourceNodes } from './gatsby-node';

jest.mock('node-fetch', () => jest.fn());

const response = (payload, status) => ({
  ok: status >= 200 && status < 300,
  status: status || 200,
  json: () => payload,
});

const callSubject = async () => {
  const actions = { createNode: jest.fn() };
  const createContentDigest = jest.fn((x) => x);

  const pluginOptions = { endpoint: 'http://example.net', locale: 'int-en' };

  await sourceNodes({ actions, createContentDigest }, pluginOptions);

  return actions;
};

describe('sourceNodes', () => {
  test('fetches published slugs from the pages#index endpoint', async () => {
    fetch.mockResolvedValue(response(pagesIndexFixtures.empty));

    await callSubject();

    expect(fetch).toHaveBeenCalledWith('http://example.net/pages/int-en');
  });

  test('creates a node for each page', async () => {
    fetch.mockResolvedValue(response(pagesIndexFixtures.many));

    const { createNode } = await callSubject();

    expect(createNode).toHaveBeenNthCalledWith(1, {
      id: 'cb0b940b-b1a3-49fd-bf93-3950223b29fd',
      parent: null,
      children: [],
      internal: { type: 'Page', contentDigest: 'cb0b940b-b1a3-49fd-bf93-3950223b29fd' },
      slug: 'index',
    });

    expect(createNode).toHaveBeenNthCalledWith(2, {
      id: '4007a470-232b-11ea-aaef-0800200c9a66',
      parent: null,
      children: [],
      internal: { type: 'Page', contentDigest: '4007a470-232b-11ea-aaef-0800200c9a66' },
      slug: 'the-cat-post',
    });
  });
});
