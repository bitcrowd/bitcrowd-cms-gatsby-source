import {
  addEmbedToMediaBlock,
  addSrcToImage,
  addHtmlToTextBlock,
} from './node-transformations';

describe('addEmbedToMediaBlock', () => {
  function subject(url) {
    const node = {
      url,
      internal: {
        type: 'CmsComponentMedia',
      },
    };

    return addEmbedToMediaBlock(node);
  }

  test('it adds embed html to MediaBlock resources', async () => {
    const url = 'https://www.youtube.com/watch?v=8kX5nBoyB3U';
    const transformed = await subject(url);

    expect(transformed.html).toMatch(/iframe/);
  });

  test('it adds embed html for twitter urls', async () => {
    const url = 'https://twitter.com/bitcrowd/status/1214946988535492609';
    const transformed = await subject(url);

    expect(transformed.html).toMatch(/twitter-tweet/);
  });
});

describe('addSrcToImage', () => {
  function subject(node) {
    const pluginOptions = {
      endpoint: 'http://example.net',
    };

    return addSrcToImage(node, pluginOptions);
  }

  test('it adds an absolute URL to Image resources', async () => {
    const node = {
      url: '/some/path',
      internal: {
        type: 'CmsImage',
      },
    };

    const transformed = await subject(node);

    expect(transformed.src).toEqual('http://example.net/some/path');
  });
});

describe('addHtmlToTextBlock', () => {
  function subject(node) {
    return addHtmlToTextBlock(node);
  }

  test('it adds compiled HTML to TextBlock resources', async () => {
    const node = {
      content: '*foo*',
      internal: {
        type: 'CmsComponentText',
      },
    };

    const transformed = await subject(node);

    expect(transformed.html).toEqual('<p><em>foo</em></p>\n');
  });
});
