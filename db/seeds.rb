# サンプルデータの作成

Song.create!([
  {
    title: "千本桜",
    artist: "黒うさP feat. 初音ミク",
    lyrics: "だいたんふてきにはいからかくめい"
  },
  {
    title: "ロストワンの号哭",
    artist: "Neru feat. 鏡音リン",
    lyrics: "はわたりすうせんちのふしんかんが"
  },
  {
    title: "砂の惑星",
    artist: "ハチ feat. 初音ミク",
    lyrics: "なんもないすなばとびかうらいめい"
  },
  {
    title: "メルト",
    artist: "ryo feat. 初音ミク",
    lyrics: "あさめがさめてまっさきにおもいうかぶきみのこと"
  },
  {
    title: "恋愛裁判",
    artist: "40mP feat. 初音ミク",
    lyrics: "Oh! No! No! No! ちょっとまがさしたんだ"
  },
  {
    title: "ワールドイズマイン",
    artist: "ryo feat. 初音ミク",
    lyrics: "せかいでいちばんおひめさまそういうあつかいこころえてよね"
  },
  {
    title: "Tell Your World",
    artist: "kz feat. 初音ミク",
    lyrics: "かたちのないきもちわすれないように"
  },
  {
    title: "マトリョシカ",
    artist: "ハチ feat. 初音ミク",
    lyrics: "かんがえすぎのめっせーじだれにとどくかもしらないで"
  }
])

puts "#{Song.count}曲のサンプルデータを作成しました。"
