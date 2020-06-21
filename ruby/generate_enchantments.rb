#!/usr/bin/env ruby

require 'csv'
require 'json'
require_relative 'oils.rb'

oils = Oils.all
enchantments = {}

CSV.new(open('enchantments.csv')).each do |enchantment|
  value = enchantment[0..1].map { |oil| oils[oil] }.sum.to_s
  name = enchantment[-1]
  image = name.match(/(.*) Tower/)[1].downcase.gsub(/\s/, '_')
  enchantments[value] = { name: name, description: '', image: "img/towers/#{image}.png" }
end

data = JSON.load(open('../vendor/enchantments.json')).to_h

# Add any new enchantments to the existing data
enchantments.each do |key, enchantment|
  unless data.has_key?(key)
    data[key] = enchantment
  end
end

data = data.sort_by { |k, _| k.to_i }.to_h

File.open('../vendor/enchantments.json', 'w') do |file|
  file.write(JSON.pretty_generate(data))
end
