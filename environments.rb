configure( :development ) do
  register Sinatra::Reloader
  
  db = URI.parse( 'postgres:///localhost/mydb' )
  
  ActiveRecord::Base.establish_connection( {
    :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
    :database => db.path[ 1..-1 ],
    :encoding => 'utf8',
    :host     => db.host,
    :password => db.password,
    :username => db.username
  } )
end

configure( :production ) do
  assets.js_compressor = :uglify
end
