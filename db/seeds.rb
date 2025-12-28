# サンプルデータの作成

Song.create!([
  {
    title: "千本桜",
    furigana: "せんぼんざくら",
    artist: "黒うさP feat. 初音ミク",
    lyrics: "だいたんふてきにはいからかくめい"
  },
  {
    title: "ロストワンの号哭",
    furigana: "ろすとわんのごうこく",
    artist: "Neru feat. 鏡音リン",
    lyrics: "はわたりすうせんちのふしんかんが"
  },
  {
    title: "砂の惑星",
    furigana: "すなのわくせい",
    artist: "ハチ feat. 初音ミク",
    lyrics: "なんもないすなばとびかうらいめい"
  },
  {
    title: "メルト",
    furigana: "めるとmelt",
    artist: "ryo feat. 初音ミク",
    lyrics: "あさめがさめてまっさきにおもいうかぶきみのこと"
  },
  {
    title: "恋愛裁判",
    furigana: "れんあいさいばん",
    artist: "40mP feat. 初音ミク",
    lyrics: "Oh! No! No! No! ちょっとまがさしたんだ"
  },
  {
    title: "ワールドイズマイン",
    furigana: "わーるどいずまいん",
    artist: "ryo feat. 初音ミク",
    lyrics: "せかいでいちばんおひめさまそういうあつかいこころえてよね"
  },
  {
    title: "Tell Your World",
    furigana: "てるゆあわーるど",
    artist: "kz feat. 初音ミク",
    lyrics: "かたちのないきもちわすれないように"
  },
  {
    title: "マトリョシカ",
    furigana: "まとりょしか",
    artist: "ハチ feat. 初音ミク",
    lyrics: "かんがえすぎのめっせーじだれにとどくかもしらないで"
  }
])

puts "#{Song.count}曲のサンプルデータを作成しました。"
