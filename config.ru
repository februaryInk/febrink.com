ENV[ 'RACK_ENV' ] ||= 'development'

require 'rubygems'
require 'bundler'

Bundler.require( :default, ENV[ 'RACK_ENV' ].to_sym )

Dir.glob( './app/{routes}/*.rb' ).each { | file | require file }

map( '/' ) { run CorePages }
