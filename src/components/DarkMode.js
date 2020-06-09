import React from 'react'
import ThemeContext from '../context/theme'
import Toggle from './atom/toggle'
import { moon, sun } from './atom/icon'

export default function DarkMode() {
  return (
    <ThemeContext.Consumer>
      {(ctx) =>
        ctx.theme && (
          <Toggle
            icons={{
              checked: (
                <img
                  src={moon}
                  alt="moon"
                  width="16"
                  height="16"
                  role="presentation"
                  style={{ pointerEvents: 'none' }}
                />
              ),
              unchecked: (
                <img
                  src={sun}
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
        )
      }
    </ThemeContext.Consumer>
  )
}
