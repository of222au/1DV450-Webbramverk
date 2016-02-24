class User < ActiveRecord::Base

  has_many :user_applications

  # before saving email, make sure lower case
  before_save { self.email = email.downcase }

  validates :email,
            :presence => {:message => 'Du måste ange en e-post'},
            :length => { maximum: 255 }
            #:uniqueness => { case_sensitive: false }

  validates_uniqueness_of :email,
                          :case_sensitive => false,
                          :message => 'E-post-adressen finns redan'


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


end
