class CreateEventTags < ActiveRecord::Migration
  def change
    create_table :event_tags do |t|
      t.integer :event_id
      t.integer :tag_id

      t.timestamps null: false

      #add_index :events_tags, [:event_id, :tag_id]
    end
  end
end
