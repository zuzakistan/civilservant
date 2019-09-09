[![Build Status](https://travis-ci.org/zuzakistan/civilservant.svg)](https://travis-ci.org/zuzakistan/civilservant)
[![Script Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/zuzakistan/civilservant/master/badge.svg)](https://snyk.io/test/github/zuzakistan/civilservant)
[![Coverage Status](https://coveralls.io/repos/github/zuzakistan/civilservant/badge.svg?branch=master)](https://coveralls.io/github/zuzakistan/civilservant?branch=master)

# civilservant

This is an IRC bot written in NodeJS.

## Setup

To install, run `npm install`.

We use Mozilla's [Convict](https://github.com/mozilla/node-convict) library for
configuration, which provides a variety of ways to define settings.

Most important configuration variables can be set via an environment variable.
Alternatively, you can define them in a JSON file (such as `debug.json` or
production.json`), and Convict will read those changes in at startup.

For example:
```sh
npm install
NODE_ENV=production npm start
```

## Contributing
We welcome contributions to civilservant.
If you're unsure where to start, we curate a list of [good first issues](https://github.com/zuzakistan/civilservant/labels/good%20first%20issue).

If you have questions, you can contact us via IRC at [##zuzakistan-lab on freenode](irc://chat.freenode.net/##zuzakistan-lab)
([webchat](https://kiwiirc.com/nextclient/irc.freenode.net/##zuzakistan-lab)).

If you encounter unacceptable behaviour in the community, please email conduct@zuzakistan.com.
