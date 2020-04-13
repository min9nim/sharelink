import React from 'react'
import RefPost from './RefPost'
import './RefPostList.scss'

export default function RefPostList(props) {
  return (
    <ul className="RefPostList">
      {props.refLinks.map((l) => (
        <RefPost key={l.id} link={l} state={props.state} />
      ))}
    </ul>
  )
}
