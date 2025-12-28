Rails.application.routes.draw do
  # Root path
  root "home#index"

  # Home routes
  post "start", to: "home#start"

  # Quiz routes
  get "quiz", to: "quizzes#index"
  post "quiz/start", to: "quizzes#start"
  post "quiz/answer", to: "quizzes#answer"
  get "quiz/search", to: "quizzes#search"

  # Game records routes
  get "results", to: "game_records#show"
  get "rankings", to: "game_records#index"
  post "game_records", to: "game_records#create"

  # Admin routes
  namespace :admin do
    resources :songs
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
