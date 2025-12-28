class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.string :title
      t.text :lyrics
      t.string :artist

      t.timestamps
    end
  end
end
