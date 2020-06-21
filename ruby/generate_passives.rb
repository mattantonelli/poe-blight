#!/usr/bin/env ruby

require 'json'
require 'nokogiri'
require 'open-uri'
require_relative 'oils.rb'

SKILL_TREE_URL = 'https://www.pathofexile.com/fullscreen-passive-skill-tree'.freeze

oils = Oils.all
passives = {}

if ARGV[0] == 'live'
  page = Nokogiri::HTML(open(SKILL_TREE_URL))
  json = page.css('script')[-1].text.sub(/.*passiveSkillTreeData = /m, '').sub(/};.*/m, '}')
  File.write('tmp/data.json', json)
  data = JSON.parse(json)
else
  data = JSON.load(open('tmp/data.json'))
end


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
