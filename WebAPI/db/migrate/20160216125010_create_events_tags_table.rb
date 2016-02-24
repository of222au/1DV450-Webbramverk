class CreateEventsTagsTable < ActiveRecord::Migration
  def change
=begin
    create_table :events_tags, :id => false do |t|
      t.integer 'event_id'
      t.integer 'tag_id'
    end

    add_index :events_tags, [:event_id, :tag_id]
=end

  end
end
