class Application < Sinatra::Base
  
  configure( :development ) do
    register Sinatra::Reloader
  end

  configure( :production ) do
    assets.js_compressor = :uglify
    
    db = URI.parse( ENV[ 'DATABASE_URL' ] || 'postgres:///localhost/mydb' )
    
    ActiveRecord::Base.establish_connection( {
      :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
      :database => db.path[ 1..-1 ],
      :encoding => 'utf8',
      :host     => db.host,
      :password => db.password,
      :username => db.user
    } )
  end
end
