class CorePages < Application
  
  get '/' do
    haml( :'core_pages/index', { :layout => :default } )
  end
end
