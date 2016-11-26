ENV[ 'RACK_ENV' ] ||= 'development'

require 'rubygems'
require 'bundler'
require 'net/http'

Bundler.require( :default, ENV[ 'RACK_ENV' ].to_sym )

class Application < Sinatra::Base
  
  set( :assets, Sprockets::Environment.new )
  set( :root, File.dirname( File.expand_path( '../..', __FILE__ ) ) )
  set( :show_exceptions, :after_handler )
  
  enable( :sessions )
  
  register Sinatra::Contrib
  register Sinatra::Flash
  
  assets.append_path( 'app/assets/fonts' )
  assets.append_path( 'app/assets/images' )
  assets.append_path( 'app/assets/javascripts' )
  assets.append_path( 'app/assets/stylesheets' )
  
  assets.css_compressor = :scss
  
  AutoprefixerRails.install( assets )

  configure do
    disable( :method_override )
    disable( :static )
    
    set( :views, 'app/views' )
    
    set( :erb, { :escape_html => true,
      :layout_options => { :views => 'app/views/layouts' } } )
    
    # specifying a default layout causes a conflict with content_for. why?
    set( :haml, { :format => :html5, # :layout => :default,
      :layout_options => { :views => 'app/views/layouts' } } )
  end
  
  assets.context_class.class_eval do
    def asset_path( path, options = {  } )
      "/assets/#{path}"
    end
  end
  
  helpers do
    def content_tag( type, content, options={} )
      "<#{type} #{to_attributes(options)}>#{content}</#{type}>"
    end
    
    def to_attributes( options )
      options.map { | k, v | "#{k}='#{v}'" }.join( ' ' )
    end
  end
  
  not_found do
    haml( :'/errors/404', :layout => :default )
  end
  
  before '/admin/*' do
    @current_user ||= User.find_by( :id => session[ :user_id ] )
    
    if @current_user == nil
      raise Sinatra::NotFound
    end
  end
    
  get( '/assets/*' ) do
    env[ 'PATH_INFO' ].sub!( '/assets', '' )
    settings.assets.call( env )
  end
end

require_relative( './environments.rb' )
require_relative( './app/models/init.rb' )
require_relative( './app/routes/init.rb' )
