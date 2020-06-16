#!/usr/bin/env ruby

require 'json'

OIL_NAMES = %w(ClearOil SepiaOil AmberOil VerdantOil TealOil AzureOil IndigoOil
               VioletOil CrimsonOil BlackOil OpalescentOil SilverOil GoldenOil).freeze

oils = OIL_NAMES.each_with_object({}).with_index do |(oil, h), i|
  h[oil] = 3 ** i
end

data = JSON.load(File.read('tmp/data.json'))
passives = {}

data['nodes'].each do |_, node|
  if node['isNotable'] && node['recipe']
    value = node['recipe'].sum { |oil| oils[oil] }
    description = node['stats'].join('<br>')
    passives[value.to_s] = { name: node['name'], description: description }
  end
end

passives = passives.sort_by { |k, _| k.to_i }.to_h

File.open('../vendor/passives.json', 'w') do |file|
  file.write(JSON.pretty_generate(passives))
end
