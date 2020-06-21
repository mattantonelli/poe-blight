#!/usr/bin/env ruby

require 'json'
require_relative 'oils.rb'

oils = Oils.all
data = JSON.load(open('tmp/data.json'))
passives = {}

data['nodes'].each do |_, node|
  if node['recipe']
    value = node['recipe'].sum { |oil| oils[oil] }
    description = node['stats'].join('<br>')
    passives[value.to_s] = { name: node['name'], description: description }
  end
end

passives = passives.sort_by { |k, _| k.to_i }.to_h

File.open('../vendor/passives.json', 'w') do |file|
  file.write(JSON.pretty_generate(passives))
end
