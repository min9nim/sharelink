import React from 'react'
import './NewButton.scss'
import { isAddable, search } from './search-fn'

function newLink() {
  navigator.clipboard
    .readText()
    .then((text) => {
      if (isAddable(text)) {
        search(text, 'add')
      } else {
        alert('클립보드 데이터가 유효한 URL이 아닙니다.')
      }
    })
    .catch((err) => {
      alert('Failed to read clipboard contents: ', err)
    })
}

export default function NewButton() {
  return (
    <div className="new-button" onClick={newLink}>
      <i className="icon-doc-new" />
      new
    </div>
  )
}
