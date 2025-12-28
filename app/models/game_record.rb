class GameRecord < ApplicationRecord
  validates :player_name, presence: true
  validates :score, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :played_at, presence: true

  default_scope -> { order(score: :desc, played_at: :desc) }
end
