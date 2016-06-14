class Application < Sinatra::Base

  get '/admin/posts' do
    posts = Post.order( 'created_at DESC' )
    @posts_by_year = {  }
    
    posts.each do | post |
      year = post.created_at.year
      if @posts_by_year.has_key?( year )
        @posts_by_year[ year ] << post
      else
        @posts_by_year[ year ] = [ post ]
      end
    end
    
    @years = @posts_by_year.keys.sort.reverse
    
    haml( :'admin/posts/index', { :layout => :admin } )
  end
  
  post '/admin/posts' do
    @post = Post.new( params[ :post ] )
    if @post.save
      redirect( '/admin/posts' )
    else
      haml( :'/admin/posts/new', { :layout => :admin } )
    end
  end
  
  get '/admin/posts/new' do
    @post = Post.new
    haml( :'/admin/posts/new', { :layout => :admin } )
  end
  
  get '/admin/posts/:id/edit' do
    @post = Post.find( params[ :id ] )
    haml( :'/admin/posts/edit', { :layout => :admin } )
  end
  
  delete '/admin/posts/:id' do
    post = Post.find( params[ :id ] )
    post.delete
    redirect( '/admin/posts' )
  end
  
  get '/admin/posts/:id' do
    @post = Post.find( params[ :id ] )
    haml( :'/admin/posts/show', { :layout => :admin } )
  end
  
  patch '/admin/posts/:id' do
    @post = Post.find( params[ :id ] )
    @post.update( params[ :post ] )
    redirect( "/admin/posts/#{@post.id}" )
  end
end
