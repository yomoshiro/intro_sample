class HomeController < ApplicationController
  def index
    # セッションをリセット
    session[:score] = 0
    session[:player_name] = nil
    session[:start_time] = nil
  end

  def start
    # プレイヤー名をセッションに保存してクイズ画面へ
    session[:player_name] = params[:player_name]
    redirect_to quiz_path
  end
end
