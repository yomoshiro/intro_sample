class Song < ApplicationRecord
  validates :title, presence: true
  validates :lyrics, presence: true
  validates :artist, presence: true
end
