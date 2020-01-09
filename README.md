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

## Embedded Twitter Links

To show Twitter embeds in their full glory, you'll need to add the twitter widgets javascript library to your site.

The easiest solution is to add `gatsby-plugin-twitter` to your gatsby config.

# Contributing

```sh
yarn test
yarn lint
```

Please keep [the changelog](CHANGELOG.md) up to date as well.
