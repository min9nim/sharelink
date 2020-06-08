import React from 'react'
import ThemeContext from '../context/theme'

export default function DarkMode() {
  return (
    <ThemeContext.Consumer>
      {(ctx) => (
        <div
          onClick={() => ctx.setTheme(ctx.theme === 'light' ? 'dark' : 'light')}
        >
          {ctx.theme}
        </div>
      )}
    </ThemeContext.Consumer>
  )
}
