# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [0.1.3] - 2020-01-10

## Added

* Added support for markdown tables

# [0.1.2] - 2020-01-09

## Added

* Added transformation for social media embeds (embedded `html` on node).

## Changed

* Transformations are applied in `sourceNodes` which allows us to put enriched content directly on the node. Hence `fields { src } on CmsImage` becomes just `src on CmsImage`.

# [0.1.1] - 2020-01-08

## Added

* Add compiled HTML field to markdown text blocks.
* Expose a few seldomly used fields of RootPage to Gatsby's GraphQL schema, so querying these works.

# [0.1.0] - 2020-01-07

## Added

* First release
* Transform the Bitcrowd CMS JSON:API into Gatsby's internal GraphQL schema.
* Add absolute URL field to Images.
