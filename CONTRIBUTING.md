# How to contribute

If you haven't already, come find us in IRC ([##zuzakistan-lab](irc://chat.freenode.net/zuzakistan-lab) on freenode).

## Suggesting a feature

[Open an issue](https://github.com/zuzakistan/civilservant/issues) with your suggestion.

## Finding something to work on

Any of our issues can be picked up by anyone.
We have marked a few issues as [especially good for new contributors](https://github.com/zuzakistan/civilservant/labels/good%20first%20issue).

## Contributing code

Fork, then clone the repo:

    $ git clone git@github.com:your-username/civilservant.git

Install dependencies:

    $ npm install

Make sure the tests pass:

    $ npm test

Make your change. We use [StandardJS](https://standardjs.com/rules.html) as our coding style.
If you can, add tests for your change. Then make sure the tests pass:

    $ npm test

## Committing code

Try to make sure your commits are logical and atomic.
Guilherme Trein came up with a list of [good Git commit practices](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices) you might find useful.

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."

Write in the imperative mood, instructing code to do things ("Fix", "add", and "change"; not "Fixed", "added", or "changed").

## Submitting code

Push to your fork, and open a [pull request](https://github.com/zuzakistan/civilservant/pulls).
Wait for someone to review it. If it takes too long, you can remind us on IRC ([##zuzakistan-lab](irc://chat.freenode.net/zuzakistan-lab) on freenode).
We may suggest some changes or improvements or alternatives.
