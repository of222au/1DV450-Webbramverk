class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  include SessionsHelper
  include ApplicationHelper

  # check if user wants offset/limit
  def pagination_params
    if params[:per_page].present?
      @per_page = params[:per_page].to_i
    end
    if params[:page].present?
      @page = params[:page].to_i
    end
    @per_page ||= PAGINATION_PER_PAGE
    @page  ||= PAGINATION_PAGE
  end


  protected

  def self.set_pagination_headers(name, options = {})
    after_filter(options) do |controller|
      results = instance_variable_get("@#{name}")
      headers["X-Pagination"] = {
          total: results.total_entries,
          total_pages: results.total_pages,
          first_page: results.current_page == 1,
          last_page: results.next_page.blank?,
          previous_page: results.previous_page,
          next_page: results.next_page,
          out_of_bounds: results.out_of_bounds?,
          offset: results.offset
      }.to_json
    end
  end

  # This is added for handling backbutton "problem" when logged out. Rails is caching the page and
  # we can get the previous page. This is telling pages not to cache in browser (maybe a non problem with https)
  # Dont forget to disable tubrolinks on logout-link
  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
end
