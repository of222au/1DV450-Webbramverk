class CreatorsController < ApplicationController
  # to work without anti forgery token check
  protect_from_forgery with: :null_session

  before_action :api_authenticate, only: [:current]
  before_action :check_api_key
  before_action :set_default_format

  # This is the preferred formats (OBS no HTML => no views loaded)
  respond_to :json, :xml

  # A better way to catch all the errors - Directing it to a private method
  rescue_from ActionController::UnknownFormat, with: :raise_bad_format

  def show
    @creator = Creator.find_by id: params[:id]
    do_respond_with(@creator)

      # If the record/resource is not found, give an error message and 404 back
    rescue ActiveRecord::RecordNotFound
      @error = ErrorMessage.new("Could not find resource. Are you using the correct creator_id?", "The creator was not found!" )
      respond_with  @error, status: :not_found
  end

  def index
    @creators = Creator.where(nil)
    do_respond_with @creators
  end

  def current
    current_id = current_creator_id
    if current_id
      @creator = Creator.find_by id: current_id
      do_respond_with(@creator)
    else
      @error = ErrorMessage.new("You are currently not logged in. Use /auth url with credentials to get an auth token.", "You are not logged in" )
      respond_with  @error, status: :bad_request
    end

    # If the record/resource is not found, give an error message and 404 back
  rescue ActiveRecord::RecordNotFound
    @error = ErrorMessage.new("Could not find resource. Are you using the correct creator_id?", "The creator was not found!" )
    respond_with  @error, status: :not_found
  end


  ################################# Private methods
  private


end
