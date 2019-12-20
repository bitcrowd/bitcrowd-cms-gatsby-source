# TODO

## Usage

Add the plugin to `gatsby-config.js` as follows:

```js
plugins: [
  {
    resolve: `bchp6-cms-gatsby-source`,
    options: {
      endpoint: 'http://cms.bitcrowd.net/api/v1',
      locale: 'int-en',
    },
  },
]
```

## Development

The configs can be overridden by setting environment variables.

```sh
# .env.development (if you have dotenv)
BCHP6_CMS_GATSBY_SOURCE_ENDPOINT=http://localhost:3000/api/v1
BCHP6_CMS_GATSBY_SOURCE_LOCALE=de-de
```
