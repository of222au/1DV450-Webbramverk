class Creator < ActiveRecord::Base
  include Rails.application.routes.url_helpers

  has_many :events

  # before saving email, make sure lower case
  before_save { self.email = email.downcase }

  validates :email,
            :presence => {:message => 'Du måste ange en e-post'},
            :length => { maximum: 255 },
            :uniqueness => { case_sensitive: false }

  VALID_EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
  validates_format_of :email,
                      :with => VALID_EMAIL_REGEX,
                      :message => 'Felaktig e-postadress'

  validates :password,
            :presence => {:message => 'Du måste ange ett lösenord'}
  validates_length_of :password,
                      :minimum => 4,
                      :message => 'Lösenordet måste vara minst 4 tecken långt'
  validates :password_confirmation,
            :presence => {:message => 'Bekräfta lösenordet'}

  # let rails handle user security
  has_secure_password



  #
  # Serialization
  #

  def serializable_hash (options={})
    if options == {}
      options = {
          only: [ :username, :email, :created_at, :updated_at ],
          include: [events: {only: [:name], methods: :url}],
      }.update(options)
    end
    super(options)
  end

  def url
    #  the configuration is set i config/enviroment/{development|productions}.rb
    #  include Rails.application.routes.url_helpers - MVC?
    { :href => "#{Rails.configuration.x.base_url}#{creator_path(self)}" }
  end

  #
  #
  #


end
