class SessionsController < ApplicationController

  ## Login/out methods

  def new
    if is_logged_in?
      redirect_to user_applications_path
    end
  end


  def create
    # try to find the user by the email
    u = User.find_by(email: params[:email].downcase)

    # check if a user was found, and if correct password
    if u && u.authenticate(params[:password])

      # create the session and redirect
      log_in(u)
      redirect_to user_applications_path

    else

      # notice the error and goto login path again
      flash[:danger] = 'Fel i inloggnings-uppgifterna'
      redirect_to login_path

    end
  end


  def destroy

    # destroy the session (i.e logout) and redirect to root
    log_out
    flash[:success] = 'Du är nu utloggad'
    redirect_to root_path #, :notice => 'Utloggad'

  end



end
