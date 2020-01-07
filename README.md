# Development

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
