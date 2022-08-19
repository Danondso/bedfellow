#!/bin/sh
# this script bridges the call to the scraper script from rust
# stdout is captured by rust and then returned to the application
python3 python/search.py $1 $2