#! /bin/sh
#
# irclog.sh
# Copyright (C) 2018 zuzak <zuzak@saraneth>
#
# Distributed under terms of the MIT license.
#
 
ag --nonumbers --color -- "${@}" ~/irclogs/freenode/\##zuzakistan.log | \
ag --nonumbers --color -v "civilservant|!(ag|irclog)" | \
perl -e 'while (<>) { push(@_,$_); } print @_[rand()*@_];'
