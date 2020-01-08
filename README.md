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

# Contributing

```sh
yarn test
yarn lint
```

Please keep [the changelog](CHANGELOG.md) up to date as well.
