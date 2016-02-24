class Event < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  belongs_to :creator
  has_one :location
  has_many :event_tags, inverse_of: :event
  has_many :tags, through: :event_tags
  #has_and_belongs_to_many :tags
  accepts_nested_attributes_for :location
  accepts_nested_attributes_for :event_tags
  #accepts_nested_attributes_for :tags

  #for filtering:
  scope :with_name, -> (name) { where name: name }
  scope :name_starts_with, -> (name) { where('events.name like ?', "#{name}%")}
  scope :with_location_name, lambda {|location_name| joins(:location).where('locations.name = ?', location_name) }
  scope :location_name_starts_with, lambda {|location_name| joins(:location).where('locations.name like ?', "#{location_name}%")}

  validates :name,
            :presence => {:message => 'Du måste ange ett namn'},
            :length => { minimum: 2, maximum: 255 }


  def serializable_hash (options={})
    if options == {}
      options = {
          except: :creator_id,
          include: { :tags => { :only => :name, :methods => :url }, :location => { :only => [ :name, :latitude, :longitude] }, :creator => { :only => [:username], :methods => :url }},
          methods: [:url]
      }.update(options)
    end
    super(options)
  end

  def url
    #  the configuration is set i config/enviroment/{development|productions}.rb
    #  include Rails.application.routes.url_helpers - MVC?
    { :href => "#{Rails.configuration.x.base_url}#{event_path(self)}" }
  end

end
