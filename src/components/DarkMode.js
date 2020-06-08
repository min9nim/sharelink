import React, { useState, useEffect } from 'react'
import ThemeContext from '../context/theme'

export default function DarkMode() {
  return (
    <ThemeContext.Consumer>
      {(ctx) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            console.log('122', ctx.theme)
            ctx.setTheme(ctx.theme === 'dark' ? 'light' : 'dark')
          }}
        >
          {ctx.theme === 'dark' ? 'L' : 'D'}
        </div>
      )}
    </ThemeContext.Consumer>
  )
}
