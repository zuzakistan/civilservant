## !khan
   Makes the bot say KHAAAAAAAAAAAAN.
## !say _text_
   Makes the bot NOTICE the current channel with the content.
## !src
   Displays a link to the source code of the bot.
## !commands
## !help
   Displays a link to COMMANDS.md
## !quit
   Checks to see whether the current channel is the control channel.
## !config flush
   Cycles the configuration of the bot. [Control channel only.]
## !nick [nickname]
   Changes the nickname of the bot. Fails silently.
   Requires `bot.config.irc.allowNickChanges` cvar to be active.
## !news
   Toggles the news feed (globally) on and off.
## !news corrections
   Outputs the link to the BBC contact pages.
## !news status
   Returns the current status of the BBC news feed
## !news wipe
   Purges the cache of stale news stories.
   This may cause a large number of stories to be retransmitted.
   [Control channel only.]
## !concern
   Toggles whether the bot should interrupt charged conversations
   with an unhelpful message.
## !rdns _ip address_
## !host _ip address_
   Queries the DNS server for the reverse DNS of an IP.
## !duckfact
   Sends an SMS containing a carefully curated fact about everybody's
   favourite species in the Anatidae family of birds.
   [Control channel only.]
## !finger _username_
   Fingers a user on central.aber.ac.uk
   @deprecated
## !geo _ip address_
   Looks up the location of an IP address.
## !space
   Returns data on the number of people in space at the current time.
## !isup _url_
## !get _url_
## !web _url_
   Grabs an arbitrary URL and returns select headers.
   [Control channel only.]
## !khan _word_
   Makes the bot say KHAAAAAAAAAAAAN.
## !lang _code_
   Looks up the ISO 639-1 code for a language.
## !country _code_
   Looks up the ISO 3166-alpha2 code for a country, and returns
   the name in English and German.
## !state _code_
   Looks up the USPS code for a US state.
## !marco
   Returns the delivery and collection times of my favourite takeaway.
## !pizza
   Returns a random pizza from the "classic" range.
## !nickcount
   Replies with the cumulative count of nicknames tracked.
## !del _slug_
   Deletes a paste.
## !sunrise
   Returns solar data for Aberystwyth for today.
## !tld _tld_
   Checks whether a given string is a TLD in Iana's database.
## !ud [headword]
   Looks up a definition in Urban Dictionary.
## !expand [url]
   Expands the given URL.
   If URL not given, takes the last URL from the channel.
## !shorten [url]
   Shortens the given URL.
   If URL not given, takes the last URL from the channel.
   TODO:
   This won't work well when the bot is in more than one channel.
## !watchlist
   Returns the current watchlist.
## !ziron balance
   Get current balance.
## !ziron _recipient_ _message_
   Sends a text message.
## !ziron status
   Gets the current statuspage for Ziron.
