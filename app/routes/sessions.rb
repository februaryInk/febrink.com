class Application < Sinatra::Base
  
  get '/sign_in' do
    haml( :'sessions/sign_in', { :layout => :simple } )
  end
  
  get '/sign_out' do
    haml( :'sessions/sign_out', { :layout => :simple } )
  end
end
