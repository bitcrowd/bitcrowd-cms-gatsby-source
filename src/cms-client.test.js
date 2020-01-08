import fetch from 'node-fetch';

import { fetchSlugs, fetchPage } from './cms-client';
import response from './__test__/response';

jest.mock('node-fetch', () => jest.fn());

const pluginOptions = {
  endpoint: 'http://example.net',
  locale: 'int-en',
};

describe('fetchSlugs', () => {
  test('fetches published slugs from the pages#index endpoint', async () => {
    fetch.mockResolvedValue(
      response({
        data: [
          { attributes: { slug: 'foo' } },
          { attributes: { slug: 'bar' } },
        ],
      })
    );

    const result = await fetchSlugs(pluginOptions);

    expect(result).toEqual(['foo', 'bar']);

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en'
    );
  });
});

describe('fetchPage', () => {
  test('fetches a single page from the pages#show endpoint', async () => {
    fetch.mockResolvedValue(response({ foo: 'bar' }));
    const result = await fetchPage(pluginOptions, 'slug');

    expect(result).toEqual({ foo: 'bar' });

    expect(fetch).toHaveBeenCalledWith(
      'http://example.net/api/v1/pages/int-en/slug'
    );
  });
});
