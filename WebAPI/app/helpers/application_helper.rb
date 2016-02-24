module ApplicationHelper

  PAGINATION_PER_PAGE = 5
  PAGINATION_PAGE = 1

  EVENTS_NEARBY_DISTANCE = 20



  def check_api_key
    api_key = request.headers['X-ApiKey']

    if api_key
      # check that a user application with the api_key exists and is not revoked
      user_application = UserApplication.find_by_api_key(api_key)
      if user_application && user_application.revoked != true



        return true
      end
    end

    @error = ErrorMessage.new("Need to include a valid api key in the request headers.",
                              "No access to this action" )
    respond_with @error, status: :unauthorized
  end

  def do_respond_with(object, status = nil)
    respond_to do |format|
      format.json do
        render :json => object.to_json, status: status.present? ? status : :ok
      end
      format.xml do
        render :xml => object.to_xml
      end
    end
  end

  def raise_bad_format
    @error = ErrorMessage.new("The API does not support the requested format", "There was a bad call. Contact the developer!" )
    respond_with @error, status: :bad_request
  end

  def set_default_format
    request.format = 'json' unless params[:format]
  end


end
