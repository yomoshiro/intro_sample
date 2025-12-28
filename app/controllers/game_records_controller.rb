class GameRecordsController < ApplicationController
  def index
    # ランキング画面
    @game_records = GameRecord.limit(20)
  end

  def show
    # 成績画面
    @player_name = session[:player_name]
    @score = session[:score] || 0

    # ゲーム記録を保存
    if @player_name.present?
      GameRecord.create(
        player_name: @player_name,
        score: @score,
        played_at: Time.current
      )
    end

    # セッションをリセット
    session[:score] = 0
    session[:start_time] = nil
  end

  def create
    # ゲーム記録の保存（API用）
    game_record = GameRecord.new(game_record_params)
    game_record.played_at = Time.current

    if game_record.save
      render json: { success: true, id: game_record.id }
    else
      render json: { success: false, errors: game_record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def game_record_params
    params.require(:game_record).permit(:player_name, :score)
  end
end
