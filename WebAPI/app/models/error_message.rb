class ErrorMessage

  def initialize(developer_error_message, user_error_message, errors = nil)

    @developer_error_message = developer_error_message
    @user_error_message = user_error_message
    @errors = errors

  end

  def serializable_hash (options={})
    options = {
        
    }.update(options)
    super(options)
  end

end