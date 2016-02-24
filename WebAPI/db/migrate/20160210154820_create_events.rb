class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.references :creator, :null => false
      t.references :location, :null => false

      t.string 'name', null: false
      t.text 'description'

      t.timestamps null: false
    end
  end
end
