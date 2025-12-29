import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  connect() {
    this.debounceTimer = null
    this.selectedIndex = -1
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

  keydown(event) {
    const items = this.resultsTarget.querySelectorAll('.search-result-item')

    if (items.length === 0) return

    // Tab or 下矢印
    if (event.key === 'Tab' || event.key === 'ArrowDown') {
      event.preventDefault()
      this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1)
      this.updateSelection(items)
    }
    // Shift+Tab or 上矢印
    else if ((event.key === 'Tab' && event.shiftKey) || event.key === 'ArrowUp') {
      event.preventDefault()
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
      this.updateSelection(items)
    }
    // Enter
    else if (event.key === 'Enter') {
      event.preventDefault()
      if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
        items[this.selectedIndex].click()
      }
    }
    // Escape
    else if (event.key === 'Escape') {
      this.resultsTarget.style.display = "none"
      this.selectedIndex = -1
    }
  }

  updateSelection(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected')
      } else {
        item.classList.remove('selected')
      }
    })
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
      this.selectedIndex = -1
      return
    }

    const html = songs.map(song => `
      <div class="search-result-item" data-action="click->search#selectSong" data-song-id="${song.id}" data-song-title="${song.title}">
        ${song.title}
      </div>
    `).join("")

    this.resultsTarget.innerHTML = html
    this.resultsTarget.style.display = "block"

    // 最初の候補を自動選択
    this.selectedIndex = 0
    const items = this.resultsTarget.querySelectorAll('.search-result-item')
    this.updateSelection(items)
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
