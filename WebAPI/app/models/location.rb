class Location < ActiveRecord::Base
  belongs_to :event

  reverse_geocoded_by :latitude, :longitude
  #after_validation :reverse_geocode  # auto-fetch address

  validates :name,
            :presence => {:message => 'Du måste ange ett namn på platsen'},
            :length => { minimum: 2, maximum: 255, message: 'Platsens namn måste vara mellan 2 och 255 tecken' }


end
