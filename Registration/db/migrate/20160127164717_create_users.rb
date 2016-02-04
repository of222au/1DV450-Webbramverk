class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|

      t.string 'email', null: false
      t.string 'password_digest', null: false
      t.boolean 'is_admin', :default => false, :null => false

      t.timestamps null: false
    end
  end
end
