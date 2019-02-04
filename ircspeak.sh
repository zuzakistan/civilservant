#! /bin/sh
ag --no-numbers -v '[0-9-]+T[0-9:+]+.*-.*:.*-' ~/irclogs/freenode/\##zuzakistan.log | shuf -n 1
