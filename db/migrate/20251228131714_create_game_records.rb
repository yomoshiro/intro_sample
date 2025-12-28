class CreateGameRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :game_records do |t|
      t.string :player_name
      t.integer :score
      t.datetime :played_at

      t.timestamps
    end
  end
end
