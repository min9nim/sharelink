import React, { useState, useEffect } from 'react'
import ThemeContext from '../context/theme'
import Toggle from './atom/toggle'

export default function DarkMode() {
  return (
    <ThemeContext.Consumer>
      {(ctx) => (
        <Toggle
          icons={{
            checked: (
              <img
                src="/static/images/moon.png"
                alt="moon"
                width="16"
                height="16"
                role="presentation"
                style={{ pointerEvents: 'none' }}
              />
            ),
            unchecked: (
              <img
                src="/static/images/sun.png"
                alt="sun"
                width="16"
                height="16"
                role="presentation"
                style={{ pointerEvents: 'none' }}
              />
            ),
          }}
          checked={ctx.theme === 'dark'}
          onChange={(e) => ctx.setTheme(e.target.checked ? 'dark' : 'light')}
        />
      )}
    </ThemeContext.Consumer>
  )
}
