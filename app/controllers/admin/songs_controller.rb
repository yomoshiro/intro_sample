class Admin::SongsController < ApplicationController
  http_basic_authenticate_with name: "admin", password: "password"

  before_action :set_song, only: [:edit, :update, :destroy]

  def index
    @songs = Song.all

    # 検索
    if params[:q].present?
      query = "%#{params[:q]}%"
      @songs = @songs.where("title LIKE ? OR artist LIKE ? OR lyrics LIKE ?", query, query, query)
    end

    # ソート
    sort_column = params[:sort] || 'created_at'
    sort_direction = params[:direction] || 'desc'

    allowed_columns = ['title', 'furigana', 'artist', 'created_at']
    sort_column = 'created_at' unless allowed_columns.include?(sort_column)
    sort_direction = 'asc' unless ['asc', 'desc'].include?(sort_direction)

    @songs = @songs.order("#{sort_column} #{sort_direction}")
  end

  def new
    @song = Song.new
  end

  def create
    @song = Song.new(song_params)

    if @song.save
      redirect_to admin_songs_path, notice: "曲を追加しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @song.update(song_params)
      redirect_to admin_songs_path, notice: "曲を更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @song.destroy
    redirect_to admin_songs_path, notice: "曲を削除しました"
  end

  private

  def set_song
    @song = Song.find(params[:id])
  end

  def song_params
    params.require(:song).permit(:title, :furigana, :lyrics, :artist)
  end
end
