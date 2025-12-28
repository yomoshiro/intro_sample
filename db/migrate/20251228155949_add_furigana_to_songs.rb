class AddFuriganaToSongs < ActiveRecord::Migration[8.0]
  def change
    add_column :songs, :furigana, :string
  end
end
