import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  connect() {
    this.debounceTimer = null
  }

  focus() {
    // フォーカス時に候補を表示
    if (this.inputTarget.value.trim().length === 0) {
      this.performSearch("")
    }
  }

  search() {
    clearTimeout(this.debounceTimer)

    const query = this.inputTarget.value.trim()

    this.debounceTimer = setTimeout(() => {
      this.performSearch(query)
    }, 300)
  }

  async performSearch(query) {
    try {
      const response = await fetch(`/quiz/search?q=${encodeURIComponent(query)}`)
      const songs = await response.json()

      this.displayResults(songs)
    } catch (error) {
      console.error("Search error:", error)
    }
  }

  displayResults(songs) {
    if (songs.length === 0) {
      this.resultsTarget.innerHTML = "<div class='no-results'>候補が見つかりません</div>"
      this.resultsTarget.style.display = "block"
      return
    }

    const html = songs.map(song => `
      <div class="search-result-item" data-action="click->search#selectSong" data-song-id="${song.id}" data-song-title="${song.title}">
        ${song.title}
      </div>
    `).join("")

    this.resultsTarget.innerHTML = html
    this.resultsTarget.style.display = "block"
  }

  selectSong(event) {
    const songId = event.currentTarget.dataset.songId
    const songTitle = event.currentTarget.dataset.songTitle

    // 入力欄をクリア
    this.inputTarget.value = ""
    this.resultsTarget.innerHTML = ""
    this.resultsTarget.style.display = "none"

    // クイズコントローラーに回答を送信
    const quizController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller~='quiz']"),
      "quiz"
    )

    if (quizController) {
      quizController.handleAnswer(songId, songTitle)
    }
  }
}
