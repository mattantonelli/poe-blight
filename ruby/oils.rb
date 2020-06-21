module Oils
  extend self

  OIL_NAMES = %w(ClearOil SepiaOil AmberOil VerdantOil TealOil AzureOil IndigoOil
               VioletOil CrimsonOil BlackOil OpalescentOil SilverOil GoldenOil).freeze

  def all
    OIL_NAMES.each_with_object({}).with_index do |(oil, h), i|
      h[oil] = 3 ** i
    end
  end
end
