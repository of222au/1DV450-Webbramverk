module SessionsHelper

  def log_in(user)
    session[:user_id] = user.id
  end

  def log_out
    session.delete(:user_id)
    @current_user = nil
  end

  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def is_logged_in?
    !current_user.nil?
  end

  def current_user_is_admin
    is_logged_in? && current_user.is_admin
  end

  def check_user
    unless is_logged_in?
      flash[:danger] = 'Du måste vara inloggad'
      redirect_to login_path
    end
  end


  ####### API auth stuff with JWT

  # This is a callback which actiosn will call if protected
  def get_auth_header
    # Take the last part in The header (ignore Bearer)
    request.headers['Authorization'].split(' ').last
  end

  def api_authenticate
    if request.headers["Authorization"].present?
      auth_header = get_auth_header
      # Try to decode jwt token
      @token_payload = decode_jwt(auth_header.strip)
      unless @token_payload
        @error = ErrorMessage.new('The provided token was incorrect', 'Could not authorize')
        do_respond_with  @error, :unauthorized
        #render json: { error: 'The provided token was incorrect' }, status: :bad_request
      end
    else
      @error = ErrorMessage.new('Need to include the Authorization header', 'Could not authorize')
      do_respond_with  @error, :forbidden
      #render json: { error: 'Need to include the Authorization header' }, status: :forbidden # The header isn´t present
    end
  end

  def current_creator_id
    if request.headers["Authorization"].present?
      auth_header = get_auth_header
      # Try to decode jwt token
      @token_payload = decode_jwt(auth_header.strip)
      if @token_payload
        return @token_payload[0]["user_id"]
      end
    end

    nil
  end

  # This method is for encoding the JWT before sending it out
  def encode_jwt(user, exp=2.hours.from_now)
    # add the expire to the payload, as an integer
    payload = { user_id: user.id }
    payload[:exp] = exp.to_i

    # Encode the payload whit the application secret, and a more advanced hash method (creates header with JWT gem)
    JWT.encode( payload, Rails.application.secrets.secret_key_base, "HS512")

  end

  # When we get a call we have to decode it - Returns the payload if good otherwise false
  def decode_jwt(token)
    # puts token
    payload = JWT.decode(token, Rails.application.secrets.secret_key_base, "HS512")
    # puts payload
    if payload[0]["exp"] >= Time.now.to_i
      payload
    else
      puts "time fucked up"
      false
    end
      # catch the error if token is wrong
  rescue => error
    puts error
    nil
  end

end
