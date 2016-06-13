class Application < Sinatra::Base
  
  configure( :development ) do
    register Sinatra::Reloader
    
    ActiveRecord::Base.establish_connection( {
      :adapter  => 'postgresql',
      :database => 'febrink_development',
      :encoding => 'utf8',
      :host     => 'localhost',
      :password => 'a#Sw0rd',
      :username => 'postgres'
    } )
  end

  configure( :production ) do
    assets.js_compressor = :uglify
  end
end
