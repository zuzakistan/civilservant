# plugins
For want of a better word, this is the `plugins` directory.
Plugins are similar to modules, but are required only once, during initial
startup. As such, the files in this directory are excluded from a module
reload -- the only way to promulgate changes is to restart the bot.

Ideally, this directory would be as minimal as possible: if you are
writing something for this bot, please try to make it into a module instead.
That way, one can hot-reload your functionality.

(Ideas for a better name than "plugins" welcome.)
