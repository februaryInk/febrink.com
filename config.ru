ENV[ 'RACK_ENV' ] ||= 'development'

require 'rubygems'
require 'bundler'

Bundler.require( :default, ENV[ 'RACK_ENV' ].to_sym )

require './app/routes/application.rb'
Dir.glob( './app/{routes}/*.rb' ).each { | file | require file }
Dir.glob( './lib/tasks/*.rake' ).each { | file | require file }

map( '/' ) { run CorePages }
