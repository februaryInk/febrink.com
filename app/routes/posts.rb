class Application < Sinatra::Base

  get '/posts' do
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
    
    haml( :'posts/index', { :layout => :default } )
  end
  
  get '/posts/:id' do
    @post = Post.find( params[ :id ] )
    haml( :'posts/show', { :layout => :default } )
  end
end
