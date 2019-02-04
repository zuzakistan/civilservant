#! /bin/sh
shuf -n 1 ~/irclogs/freenode/\##zuzakistan.log | sed -r 's/^[0-9-]+T[0-9:+].*-[A-Za-z0-9]*:#*[A-Za-z0-9]*- (.*)/\1/'
