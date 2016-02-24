class EventTag < ActiveRecord::Base
  belongs_to :event
  belongs_to :tag

  validates_presence_of :event
  validates_presence_of :tag

  accepts_nested_attributes_for :tag

end
