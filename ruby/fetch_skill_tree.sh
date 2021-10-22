#!/usr/bin/env sh

wget -O - https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json > tmp/data.json
ruby generate_passives.rb
