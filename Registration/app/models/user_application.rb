class UserApplication < ActiveRecord::Base
  before_create :generate_key

  belongs_to :user


  validates_length_of :title,
                      :minimum => 3,
                      :message => 'Du måste ange en titel på minst 3 tecken'

  validates :api_key,
            :uniqueness => true
            # :presence => {:message => 'API-nyckeln måste vara unik'}


  private

  def generate_key
    loop do
      self.api_key = SecureRandom.hex(24)
      break unless self.class.exists?(api_key: api_key)
    end
  end

end
