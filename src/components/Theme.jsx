import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

const Theme = () => {
    const { theme,toggleTheme}=useContext(ThemeContext);
    
  return (
    <div>
        
        <button onClick={toggleTheme}>
            {theme === "light"?"🌙":"🌞"}
        </button>
    </div>
  )
}

export default Theme