This package adds support for the bitcrowd CMS to gatsby.

# Installation

Add the plugin to `gatsby-config.js` as follows:

```js
plugins: [
  {
    resolve: 'bitcrowd-cms-gatsby-source',
    options: {
      endpoint: 'http://cms.example.net',
      locale: 'int-en',
    },
  },
]
```

After that you can access the pages and assets in Graphql with the prefix `Cms`.
