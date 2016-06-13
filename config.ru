root = ::File.dirname( __FILE__ )
require( ::File.join( root, 'main.rb' ) )
use Rack::MethodOverride

run Application.new
