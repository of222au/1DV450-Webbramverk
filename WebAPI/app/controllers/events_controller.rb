class EventsController < ApplicationController
  # to work without anti forgery token check
  protect_from_forgery with: :null_session

  before_action :api_authenticate, only: [:create, :update, :destroy]
  before_action :check_api_key
  before_action :pagination_params, only: [:index, :nearby]
  before_action :nearby_params, only: [:nearby]
  before_action :set_default_format, only: [:index, :nearby, :show]
  set_pagination_headers :events, only: [:index, :nearby]


  # This is the preferred formats (OBS no HTML => no views loaded)
  respond_to :json, :xml

  # A better way to catch all the errors - Directing it to a private method
  rescue_from ActionController::UnknownFormat, with: :raise_bad_format

  def index
    @events = Event.where(nil)

    # filtering:
    @events = @events.with_name(params[:name]) if params[:name].present?
    @events = @events.name_starts_with(params[:name_starts_with]) if params[:name_starts_with].present?
    @events = @events.with_location_name(params[:location_name]) if params[:location_name].present?
    @events = @events.location_name_starts_with(params[:location_name_starts_with]) if params[:location_name_starts_with].present?

    # ordering and pagination
    @events = @events.order(updated_at: :desc).paginate(:page => @page, :per_page => @per_page)

    do_respond_with @events
  end

  # This method is using the geocoder and helps with searching near a specific position
  def nearby
    if params[:lng].present? && params[:lat].present?
      # get event ids ordered by location
      event_ids = Location.near([params[:lat].to_f, params[:lng].to_f], @nearby_distance).collect{|a| a.event_id}.uniq
      events_nearby = Event.find(event_ids).index_by(&:id).slice(*event_ids).values

      # use WillPaginate on our custom array (can not run it like usual with .paginate)
      @events = WillPaginate::Collection.create(@page, @per_page, events_nearby.length) do |pager|
        start = (@page-1)*@per_page # assuming current_page is 1 based.
        pager.replace(events_nearby[start, @per_page])
      end
      do_respond_with @events
    else
      @error = ErrorMessage.new('Invalid parameters, need "lng" and "lat"', 'Could not load nearby events' )
      do_respond_with @error, :bad_request
    end
  end

  def show
    @event = Event.find_by id: params[:id]
    do_respond_with @event

    # If the record/resource is not found, give an error message and 404 back
    rescue ActiveRecord::RecordNotFound
      @error = ErrorMessage.new('Could not find resource. Are you using the correct event_id?', 'The event was not found')
      do_respond_with @error, :not_found
  end


  # Called with a POST to create (json input expected)
  def create
    save_or_update(true)
  end

  # Called with a PUT to update (json input expected)
  def update
    save_or_update(false)
  end

  def destroy
    creator_id = current_creator_id
    if creator_id

      event = Event.find_by id: params[:id]
      if event
        if event.creator.id === creator_id

          if event.destroy

            # respond with ok
            do_respond_with nil, :ok

          else
            @error = ErrorMessage.new('Could not delete the event. Bad parameters?', 'Could not delete the event')
            do_respond_with @error, :bad_request
            return
          end

        else
          @error = ErrorMessage.new('You don\'t have permission to delete this event since you are not the creator, try to authenticate again with correct creator', 'Unauthorized for this action')
          do_respond_with @error, :unauthorized
        end

      else
        @error = ErrorMessage.new('Could not find the event. Bad parameters?', 'Could not find the event')
        do_respond_with @error, :bad_request
        return
      end

    else
      @error = ErrorMessage.new('Could not find you as creator, try to authenticate again', 'Could not find you in the system')
      do_respond_with @error, :bad_request
    end
  end



  ################################# Private methods
  private


  # Called with a PUT to update (json input expected)
  def save_or_update(save_not_update = true)

    creator_id = current_creator_id
    if creator_id

      event = (save_not_update ? nil : Event.find_by(id: params[:id]))
      if save_not_update || event
        if (save_not_update && creator_id == creator_id_param) || (!save_not_update && event.creator.id === creator_id)

          begin

            ActiveRecord::Base.transaction do
              if save_not_update
                event = Event.new(event_params)

                unless event.location
                  @error = ErrorMessage.new('Could not save the event because no location was set. Bad parameters?', 'Could not save the event', { 'location': ['Du måste ange en position (latitud och longitud)']} )
                  do_respond_with @error, :bad_request
                  return
                end

                event.save!
              else
                event.update!(event_params)
              end

              # Set tags if any, make sure if already exists to use existing one, otherwise create new
              begin
                if tags_params[:tags]
                  #loop all the tags
                  event.tags = tags_params[:tags].map do |t|
                    existing_tag = Tag.find_by_name(t[:name])
                    if existing_tag
                      #use existing tag
                      existing_tag
                    else
                      #create a new tag
                      tag_hash = {}
                      tag_hash[:name] = t[:name]
                      Tag.new(tag_hash)
                    end
                  end
                end
              rescue Exception => error
                raise TagSaveError.new(error.record.errors), error.message
              end

              # respond with the updated object
              do_respond_with event, (save_not_update ? :created : :ok)
              return

            end

          rescue TagSaveError => e
            # add 'tag.' before error key names to match correctly
            errors = Hash[e.errors.map { |k, v| ['tag.' + k[0, k.length], [v]] }]
            @error = ErrorMessage.new('Something wrong when creating a tag for the event. Bad parameters?', 'Could not create a tag for the event', errors)
            do_respond_with @error, :bad_request
          rescue Exception => exception
            @error = ErrorMessage.new('Could not save the event. Bad parameters?', 'Could not save the event', event.errors) #.any? ? event.errors : exception.message) #(event.location.errors ? event.location.errors : event.errors)) # exception.message) #event.errors)
            do_respond_with @error, :bad_request
          end

        else
          @error = ErrorMessage.new('You don\'t have permission to save this event since you are not the creator (' + creator_id.to_s + ', try to authenticate again with correct creator', 'Unauthorized for this action')
          do_respond_with @error, :unauthorized
        end


      else
        @error = ErrorMessage.new('Could not find the event. Bad parameters?', 'Could not find the event')
        do_respond_with @error, :bad_request
      end

    else
      @error = ErrorMessage.new('Could not find you as creator, try to authenticate again', 'Could not find you in the system')
      do_respond_with @error, :bad_request
    end
  end

  def get_json_params
    ActionController::Parameters.new(JSON.parse(request.body.read))
  end

  def event_params
    json_params = get_json_params
    json_params.require(:event).permit(:name, :description, :creator_id, location_attributes: [:id, :name, :longitude, :latitude]) #event_tags_attributes: [:id, :name],
  end

  def tags_params
    json_params = get_json_params
    json_params.require(:event).permit(:tags => [:name])
  end

  def creator_id_param
    params[:event] ? params[:event][:creator_id] : nil
  end

  def nearby_params
    if params[:distance].present?
      @nearby_distance = params[:distance].to_i
    end
    @nearby_distance ||= EVENTS_NEARBY_DISTANCE
  end

end


class TagSaveError < StandardError
  attr_reader :errors

  def initialize(errors)
    @errors = errors
  end
end