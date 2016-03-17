class Tag < ActiveRecord::Base
  has_many :event_tags
  has_many :events, through: :event_tags
  #has_and_belongs_to_many :events

  validates :name,
            :presence => {:message => 'Du måste ange ett namn'},
            :length => { minimum: 2, maximum: 255, message: 'Namnet på taggen måste vara mellan 2 och 255 tecken' }

  validates_uniqueness_of :name,
                          :case_sensitive => false,
                          :message => 'Namnet finns redan'


  include Rails.application.routes.url_helpers

  def serializable_hash (options={})
    if options == {}
      options = {
          include: { :events => { :only => :name, :methods => :url }},
          methods: [:url]
      }.update(options)
    end
    super(options)
  end

  def url
    #  the configuration is set i config/enviroment/{development|productions}.rb
    #  include Rails.application.routes.url_helpers - MVC?
    { :href => "#{Rails.configuration.x.base_url}#{tag_path(self)}" }
  end

end
