#!/bin/sh
grep -rl SERVE_AT /usr/share/nginx/html | xargs sed -i "s,SERVE_AT,$SERVE_AT,g"
