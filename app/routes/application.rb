class Application < Sinatra::Base
  
  require 'autoprefixer-rails'
  
  set( :assets, Sprockets::Environment.new )
  set( :root, File.dirname( File.expand_path( '../..', __FILE__ ) ) )
  
  register Sinatra::Contrib
  
  assets.append_path( 'app/assets/stylesheets' )
  assets.append_path( 'app/assets/javascripts' )
  assets.append_path( 'app/assets/fonts' )
  
  assets.css_compressor = :scss
  
  AutoprefixerRails.install( assets )

  configure do
    disable( :method_override )
    disable( :static )
    
    set( :views, 'app/views' )
    
    set( :erb, { :escape_html => true,
      :layout_options => { :views => 'app/views/layouts' } } )
    
    # specifying a default layout causes a conflict with content_for. why?
    set( :haml, { :format => :html5, 
      :layout_options => { :views => 'app/views/layouts' } } )
  end
  
  configure( :development ) do
    register Sinatra::Reloader
  end
  
  configure( :production ) do
    assets.js_compressor = :uglify
  end
  
  assets.context_class.class_eval do
    def asset_path(path, options = {})
      "/assets/#{path}"
    end
  end
    
  get( '/assets/*' ) do
    env[ 'PATH_INFO' ].sub!( '/assets', '' )
    settings.assets.call( env )
  end
end
