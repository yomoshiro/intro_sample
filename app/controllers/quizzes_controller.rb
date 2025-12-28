class QuizzesController < ApplicationController
  def index
    # クイズ画面の初期化
    session[:score] ||= 0
    session[:start_time] ||= Time.current
  end

  def start
    # ランダムな曲を取得
    song = Song.order("RANDOM()").first

    if song
      render json: { id: song.id, lyrics: song.lyrics }
    else
      render json: { error: "曲データがありません" }, status: :not_found
    end
  end

  def answer
    song = Song.find_by(id: params[:song_id])
    answered_title = params[:answered_title]

    if song.nil?
      render json: { error: "曲が見つかりません" }, status: :not_found
      return
    end

    correct = song.title == answered_title
    session[:score] = session[:score].to_i + 1 if correct

    render json: {
      correct: correct,
      title: song.title,
      score: session[:score]
    }
  end

  def search
    query = params[:q]

    if query.present?
      songs = Song.where("title LIKE ?", "%#{query}%").limit(10)
      render json: songs.map { |s| { id: s.id, title: s.title } }
    else
      render json: []
    end
  end
end
