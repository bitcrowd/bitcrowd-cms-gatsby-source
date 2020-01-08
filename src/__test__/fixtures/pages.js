import response from '../response';

export const index = response({
  data: {
    id: 'cb0b940b-b1a3-49fd-bf93-3950223b29fd',
    type: 'Page',
    attributes: {
      slug: 'index',
    },
    relationships: {},
  },
  included: [],
  jsonapi: {
    version: '1.0',
  },
});

export const theCatPost = response({
  data: {
    id: '4007a470-232b-11ea-aaef-0800200c9a66',
    type: 'Page',
    attributes: {
      slug: 'the-cat-post',
    },
    relationships: {
      blocks: {
        data: [
          {
            id: '49bbbd10-8bdc-48de-9bcf-a46f56195c1b',
            type: 'component/text',
          },
        ],
      },
    },
  },
  included: [
    {
      id: '49bbbd10-8bdc-48de-9bcf-a46f56195c1b',
      type: 'component/text',
      attributes: {
        content: 'Cats write short articles',
      },
    },
  ],
  jsonapi: {
    version: '1.0',
  },
});
