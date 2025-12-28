import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lyrics", "timer", "score", "feedback"]

  connect() {
    this.timeLeft = 60
    this.currentScore = 0
    this.currentSong = null
    this.lyricsIndex = 0
    this.isAnswering = false
    this.timerInterval = null
    this.lyricsInterval = null

    this.startQuiz()
  }

  disconnect() {
    this.stopTimer()
    this.stopLyrics()
  }

  async startQuiz() {
    await this.loadNextSong()
    this.startTimer()
  }

  async loadNextSong() {
    try {
      const response = await fetch("/quiz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        }
      })

      if (!response.ok) {
        throw new Error("曲の取得に失敗しました")
      }

      const data = await response.json()
      this.currentSong = data
      this.lyricsIndex = 0
      this.lyricsTarget.textContent = ""
      this.displayLyricsGradually()
    } catch (error) {
      console.error("Error loading song:", error)
      this.feedbackTarget.textContent = "曲データの読み込みに失敗しました"
    }
  }

  displayLyricsGradually() {
    if (!this.currentSong) return

    this.stopLyrics()
    const lyrics = this.currentSong.lyrics

    this.lyricsInterval = setInterval(() => {
      if (this.lyricsIndex < lyrics.length && !this.isAnswering) {
        this.lyricsTarget.textContent += lyrics[this.lyricsIndex]
        this.lyricsIndex++
      } else if (this.lyricsIndex >= lyrics.length) {
        this.stopLyrics()
      }
    }, 200)
  }

  stopLyrics() {
    if (this.lyricsInterval) {
      clearInterval(this.lyricsInterval)
      this.lyricsInterval = null
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isAnswering) {
        this.timeLeft--
        this.timerTarget.textContent = this.timeLeft

        if (this.timeLeft <= 0) {
          this.endGame()
        }
      }
    }, 1000)
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  async submitAnswer(selectedSongId, selectedTitle) {
    this.isAnswering = true
    this.stopLyrics()

    try {
      const response = await fetch("/quiz/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify({
          song_id: this.currentSong.id,
          answered_title: selectedTitle
        })
      })

      const data = await response.json()

      if (data.correct) {
        this.currentScore = data.score
        this.scoreTarget.textContent = this.currentScore
        // 正解したら5秒追加
        this.timeLeft += 5
        this.timerTarget.textContent = this.timeLeft
        this.showFeedback(`正解！「${data.title}」 +5秒`, "correct")
      } else {
        this.showFeedback(`不正解... 正解は「${data.title}」`, "incorrect")
      }

      // 3秒後に次の問題へ
      setTimeout(() => {
        this.isAnswering = false
        this.hideFeedback()
        this.loadNextSong()
      }, 3000)
    } catch (error) {
      console.error("Error submitting answer:", error)
      this.isAnswering = false
    }
  }

  showFeedback(message, type) {
    this.feedbackTarget.textContent = message
    this.feedbackTarget.className = `feedback ${type}`
    this.feedbackTarget.style.display = "block"
  }

  hideFeedback() {
    this.feedbackTarget.style.display = "none"
  }

  endGame() {
    this.stopTimer()
    this.stopLyrics()
    window.location.href = "/results"
  }

  // 他のコントローラーから呼び出されるメソッド
  handleAnswer(songId, title) {
    this.submitAnswer(songId, title)
  }

  // スキップボタン
  skip() {
    if (this.isAnswering) return

    this.isAnswering = true
    this.stopLyrics()
    this.showFeedback(`スキップ... 正解は「${this.currentSong ? 'データを取得中...' : '不明'}」`, "incorrect")

    // スキップ時は正解を表示するためにAPIを呼ぶ
    if (this.currentSong) {
      fetch("/quiz/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify({
          song_id: this.currentSong.id,
          answered_title: ""
        })
      })
      .then(response => response.json())
      .then(data => {
        this.showFeedback(`スキップ... 正解は「${data.title}」`, "incorrect")
      })
      .catch(error => console.error("Error:", error))
    }

    // 3秒後に次の問題へ
    setTimeout(() => {
      this.isAnswering = false
      this.hideFeedback()
      this.loadNextSong()
    }, 3000)
  }
}
