#!/usr/bin/env ruby

require 'combine_pdf'

pdf = CombinePDF.new
filename = ARGV.shift

ARGV.each do |a|
  pdf << CombinePDF.load(a)
end

pdf.save(filename)

# require 'irb'
# IRB.start