class Application < Sinatra::Base
  
  get '/' do
    haml( :'core_pages/index', { :layout => :simple } )
  end
end
