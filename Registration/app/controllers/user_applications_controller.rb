class UserApplicationsController < ApplicationController
  before_action :check_user
  before_action :check_admin_user, except: [:index, :destroy]

  def index
    if current_user_is_admin
      @users = User.all
    else
      @user_applications = current_user.user_applications
    end
  end

  def new
      @user_application = UserApplication.new
  end

  def create
    @user_application = UserApplication.new(user_application_params)
    @user_application.user = current_user
    if @user_application.save
      redirect_to user_applications_path
    else
      render 'new'
    end
  end

  def destroy
    @user_application = UserApplication.find(params[:id])
    if @user_application
      if current_user.id == @user_application.user_id || current_user_is_admin
        @user_application.destroy
        flash[:success] = 'Applikationen togs bort'
        redirect_to user_applications_path
      else
        flash[:danger] = 'Du har inte rättigheter att utföra åtgärden.'
        redirect_to user_applications_path
      end
    else
      flash[:danger] = 'Kunde inte hitta applikationen'
      redirect_to user_applications_path
    end
  end

  def edit
    @user_application = UserApplication.find(params[:id])
    if !@user_application || (current_user.id != @user_application.user_id && !current_user_is_admin)
      redirect_to user_applications_path
    end
  end

  def update
    @user_application = UserApplication.find(params[:id])
    if @user_application
      if current_user.id == @user_application.user_id || current_user_is_admin
        @user_application.update(user_application_params)
        if @user_application.save
          redirect_to user_applications_path
        else
          flash[:danger] = 'Kunde inte spara ändringarna'
          render 'new'
        end
      else
        flash[:danger] = 'Du har inte rättigheter att utföra åtgärden.'
        redirect_to user_applications_path
      end
    else
      flash[:danger] = 'Kunde inte hitta applikationen'
      redirect_to user_applications_path
    end
  end


  private

  def user_application_params
    params.require(:user_application).permit(:title, :description)
  end

  def check_admin_user
    if current_user_is_admin
      redirect_to user_applications_path #admin can not create/edit any applications
    end
  end

end
