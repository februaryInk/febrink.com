class Application < Sinatra::Base
  
  get '/sign_in' do
    @user = User.new
    haml( :'sessions/sign_in', { :layout => :simple } )
  end
  
  post '/sign_in' do
    user = User.find_by( :name => params[ :session ][ :name ] )
    if user && user.authenticate( params[ :session ][ :password ] )
      session[ :user_id ] = user.id
      redirect( '/admin/posts' )
    else
      flash[ :warning ] = 'Invalid sign in credentials.'
      redirect( '/sign_in' )
      # haml( :'sessions/sign_in', { :layout => :simple } )
    end
  end
  
  get '/sign_out' do
    session[ :user_id ] = nil
    @current_user = nil
    redirect( '/posts' )
  end
end
