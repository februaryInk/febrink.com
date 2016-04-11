class Application < Sinatra::Application
  
  set :environment, Sprockets::Environment.new
  set :root, File.dirname( File.expand_path( '../..', __FILE__ ) )
  
  environment.append_path( 'app/assets/stylesheets' )
  environment.append_path( 'app/assets/javascripts' )
  
  environment.js_compressor = :uglify
  environment.css_compressor = :scss

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
  
  get '/assets/*' do
    env[ 'PATH_INFO' ].sub!( '/assets', '' )
    settings.environment.call( env )
  end
end
