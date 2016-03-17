class TagsController < ApplicationController
  # to work without anti forgery token check
  protect_from_forgery with: :null_session

  before_action :api_authenticate #, only: [:create]
  before_action :check_api_key
  #before_action :pagination_params, only: [:show]
  before_action :set_default_format, only: [:index, :show]
  #set_pagination_headers :tags, only: [:index]


  # This is the preferred formats (OBS no HTML => no views loaded)
  respond_to :json, :xml

  # A better way to catch all the errors - Directing it to a private method
  rescue_from ActionController::UnknownFormat, with: :raise_bad_format


  def index
    @tags = Tag.where(nil)
    do_respond_with @tags
  end

  def show
    @tag = Tag.find_by id: params[:id]
    do_respond_with @tag

    # If the record/resource is not found, give an error message and 404 back
    rescue ActiveRecord::RecordNotFound
      @error = ErrorMessage.new("Could not find the resource. Are you using the correct tag_id?", "The tag was not found")
      respond_with  @error, status: :not_found
  end


end
