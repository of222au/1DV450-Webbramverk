class CreateUserApplications < ActiveRecord::Migration
  def change
    create_table :user_applications do |t|
      t.references :user, :null => false

      t.string 'title', :limit => 20, :null => false
      t.text 'description'
      t.string 'api_key', :null => false

      t.timestamps null: false
    end

    add_index :user_applications, :api_key, unique: true

  end
end
