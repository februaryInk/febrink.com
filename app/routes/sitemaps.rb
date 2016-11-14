class Application < Sinatra::Base

  get '/sitemap' do
    content_type( 'text/xml' )
    haml( :'sitemaps/index.xml', { :format => :xhtml, :layout => false } )
  end
end
