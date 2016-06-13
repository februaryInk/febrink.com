class CreatePosts < ActiveRecord::Migration
  
  def self.up
    create_table( :posts ) do | t |
      t.references( :user, :foreign_key => true, :index => true )
      
      t.string( :title )
      
      t.text( :body )
      
      t.timestamps( { :null => false } )
    end
  end
  
  def self.down
    drop_table( :posts )
  end
end
