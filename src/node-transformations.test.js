import { addSrcToImage, addHtmlToTextBlock } from './node-transformations';

describe('addSrcToImage', () => {
  function subject(node) {
    const pluginOptions = {
      endpoint: 'http://example.net',
    };

    return addSrcToImage(node, pluginOptions);
  }

  test('it adds an absolute URL to Image resources', () => {
    const node = {
      url: '/some/path',
      internal: {
        type: 'CmsImage',
      },
    };

    const transformed = subject(node);

    expect(transformed.src).toEqual('http://example.net/some/path');
  });
});

describe('addHtmlToTextBlock', () => {
  function subject(node) {
    return addHtmlToTextBlock(node);
  }

  test('it adds compiled HTML to TextBlock resources', () => {
    const node = {
      content: '*foo*',
      internal: {
        type: 'CmsComponentText',
      },
    };

    const transformed = subject(node);

    expect(transformed.html).toEqual('<p><em>foo</em></p>\n');
  });
});
