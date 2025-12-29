import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  connect() {
    this.debounceTimer = null
    this.selectedIndex = -1
    // 初期表示時にランダムな候補を表示
    this.performSearch("")
  }

  focus() {
    // フォーカス時に候補を表示
    if (this.inputTarget.value.trim().length === 0) {
      this.performSearch("")
    }
  }

  search() {
    // クイズコントローラーを取得
    const quizController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller~='quiz']"),
      "quiz"
    )

    // 回答中は検索しない
    if (quizController && quizController.isAnswering) {
      return
    }

    clearTimeout(this.debounceTimer)

    const query = this.inputTarget.value.trim()

    this.debounceTimer = setTimeout(() => {
      this.performSearch(query)
    }, 300)
  }

  keydown(event) {
    // クイズコントローラーを取得
    const quizController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller~='quiz']"),
      "quiz"
    )

    // 回答中はキー操作無効
    if (quizController && quizController.isAnswering) {
      return
    }

    const allItems = this.resultsTarget.querySelectorAll('.search-result-item')
    const validItems = this.resultsTarget.querySelectorAll('.search-result-item:not(.empty)')

    if (validItems.length === 0) return

    // Tab or 下矢印
    if (event.key === 'Tab' || event.key === 'ArrowDown') {
      event.preventDefault()
      this.selectedIndex = Math.min(this.selectedIndex + 1, validItems.length - 1)
      this.updateSelection(allItems)
    }
    // Shift+Tab or 上矢印
    else if ((event.key === 'Tab' && event.shiftKey) || event.key === 'ArrowUp') {
      event.preventDefault()
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
      this.updateSelection(allItems)
    }
    // Enter
    else if (event.key === 'Enter') {
      event.preventDefault()
      if (this.selectedIndex >= 0 && this.selectedIndex < validItems.length) {
        validItems[this.selectedIndex].click()
      }
    }
    // Escape
    else if (event.key === 'Escape') {
      this.resultsTarget.classList.remove('show')
      this.selectedIndex = -1
    }
  }

  updateSelection(items) {
    let validIndex = 0
    items.forEach((item) => {
      if (item.classList.contains('empty')) {
        item.classList.remove('selected')
      } else {
        if (validIndex === this.selectedIndex) {
          item.classList.add('selected')
        } else {
          item.classList.remove('selected')
        }
        validIndex++
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
    // 常に5行表示（足りない分は空欄）
    const rows = []
    for (let i = 0; i < 5; i++) {
      if (i < songs.length) {
        rows.push(`
          <div class="search-result-item" data-action="click->search#selectSong" data-song-id="${songs[i].id}" data-song-title="${songs[i].title}">
            ${songs[i].title}
          </div>
        `)
      } else {
        rows.push('<div class="search-result-item empty"></div>')
      }
    }

    this.resultsTarget.innerHTML = rows.join("")
    this.resultsTarget.classList.add('show')

    if (songs.length > 0) {
      // 最初の候補を自動選択
      this.selectedIndex = 0
      this.updateSelection(this.resultsTarget.querySelectorAll('.search-result-item'))
    } else {
      this.selectedIndex = -1
    }
  }

  selectSong(event) {
    // クイズコントローラーを取得
    const quizController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller~='quiz']"),
      "quiz"
    )

    // 回答中は何もしない
    if (quizController && quizController.isAnswering) {
      return
    }

    const songId = event.currentTarget.dataset.songId
    const songTitle = event.currentTarget.dataset.songTitle

    // 入力欄をクリア
    this.inputTarget.value = ""

    // クイズコントローラーに回答を送信
    if (quizController) {
      quizController.handleAnswer(songId, songTitle)
    }

    // 3秒後に候補を再表示
    setTimeout(() => {
      this.performSearch("")
    }, 3000)
  }
}
