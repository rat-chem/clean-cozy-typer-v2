import type { NextPage } from "next"
import React, { useState, useEffect, useMemo } from 'react'
import styles from '../styles/VisualKeyboard.module.css'
import useEventListener from "@use-it/event-listener"

const VisualKeyboard: NextPage = () => {
  interface keyboardButton {
    key: string,
    class: string,
    index: number,
  }

  const KEYBOARD = [
    'Escape', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
    'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
    'CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter',
    'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift',
    ' ',
  ]

  const KEYBOARD_SPECIAL_CHARS = [
    'Backspace', 'Tab', '\\', 'CapsLock', 'Enter', 'Shift', ' ',
  ]

  const [visualKeyboard, setVisualKeyboard] = useState<keyboardButton[]>([])

  function initializeKeyboardKeyNotPressed(key: string, index: number) {
    if (!KEYBOARD_SPECIAL_CHARS.includes(key)) {
      return {
        key: key === 'Escape' ? 'Esc' : key,
        class: 'styles.keyboardKeyNotPressed',
        index: index,
      }
    } else {
      if (key === ' ') {
        return {
          key: key,
          class: `styles.spacebarNotPressed`,
          index: index,
        }
      } else if (key === '\\') {
        return {
          key: key,
          class: `styles.backslashNotPressed`,
          index: index,
        }
      } else {
        return {
          key: key,
          class: `styles.${key.toLowerCase()}NotPressed`,
          index: index,
        }
      }
    }
  }

  function initializeKeyboardKeyPressed(key: string, index: number) {
    if (!KEYBOARD_SPECIAL_CHARS.includes(key)) {
      return {
        key: key === 'Escape' ? 'Esc' : key,
        class: 'styles.keyboardKeyPressed',
        index: index,
      }
    } else {
      if (key === ' ') {
        return {
          key: key,
          class: `styles.spacebarPressed`,
          index: index,
        }
      } else if (key === '\\') {
        return {
          key: key,
          class: `styles.backslashPressed`,
          index: index,
        }
      } else {
        return {
          key: key,
          class: `styles.${key.toLowerCase()}Pressed`,
          index: index,
        }
      }
    }
  }

  function initializeVisualKeyboard(): keyboardButton[] {
    return [...KEYBOARD].map(initializeKeyboardKeyNotPressed)
  }

  function renderVisualKeyboardKeyNotPressed(key: keyboardButton, index: number) {
    if (key.class.includes('keyboard')) {
      return <div className={ styles.keyboardKeyNotPressed } key={ index }>
        { key.key }
      </div>
    } else {
      switch (key.key) {
        case ' ':
          return <div className={ styles.spacebarNotPressed } key={ index }>
            { key.key }
          </div>
        case 'Backspace':
          return <div className={ styles.backspaceNotPressed } key={ index }>
            { key.key }
          </div>
        case 'Tab':
          return <div className={ styles.tabNotPressed } key={ index }>
            { key.key }
          </div>
        case '\\':
          return <div className={ styles.backslashNotPressed } key={ index }>
            { key.key }
          </div>
        case 'CapsLock':
          return <div className={ styles.capslockNotPressed } key={ index }>
            { key.key }
          </div>
        case 'Enter':
          return <div className={ styles.enterNotPressed } key={ index }>
            { key.key }
          </div>
        case 'Shift':
          return <div className={ styles.shiftNotPressed } key={ index }>
            { key.key }
          </div>
      }
    }
  }
  
  function renderVisualKeyboardKeyPressed(key: keyboardButton, index: number) {
    if (key.class.includes('keyboard')) {
      return <div className={ styles.keyboardKeyPressed } key={ index }>
        { key.key }
      </div>
    } else {
      switch (key.key) {
        case ' ':
          return <div className={ styles.spacebarPressed } key={ index }>
            { key.key }
          </div>
        case 'Backspace':
          return <div className={ styles.backspacePressed } key={ index }>
            { key.key }
          </div>
        case 'Tab':
          return <div className={ styles.tabPressed } key={ index }>
            { key.key }
          </div>
        case '\\':
          return <div className={ styles.backslashPressed } key={ index }>
            { key.key }
          </div>
        case 'CapsLock':
          return <div className={ styles.capslockPressed } key={ index }>
            { key.key }
          </div>
        case 'Enter':
          return <div className={ styles.enterPressed } key={ index }>
            { key.key }
          </div>
        case 'Shift':
          return <div className={ styles.shiftPressed } key={ index }>
            { key.key }
          </div>
      }
    }
  }

  function renderVisualKeyboardKey(key: keyboardButton, index: number) {
    if (key.class.includes('NotPressed')) {
      return renderVisualKeyboardKeyNotPressed(key, index)
    } else {
      return renderVisualKeyboardKeyPressed(key, index)
    }
  }

  function renderVisualKeyboardLayer(layer: number[]) {
    return (
      <div className={ styles.renderedVisualKeyboardContainer }>
        { [...visualKeyboard.slice(layer[0], layer[1])].map(function(key: keyboardButton, index: number) {
          return renderVisualKeyboardKey(key, index)
        }) }
      </div>
    )
  }

  function reInitVisualKeyboardOnKeyDown(inputKey: any): keyboardButton[] {
    return [...KEYBOARD].map(function(key: string, index: number) {
      if ((inputKey.key).toLowerCase() !== key.toLowerCase()) {
        return initializeKeyboardKeyNotPressed(key, index)
      } else {
        return initializeKeyboardKeyPressed(key, index)
      }
    })
  }

  function onKeyPressDownChangeClass(key: any) {
    setVisualKeyboard(reInitVisualKeyboardOnKeyDown(key))
  }

  function onKeyPressUpChangeClass() {
    setVisualKeyboard(initializeVisualKeyboard)
  }

  useEventListener('keydown', onKeyPressDownChangeClass)
  useEventListener('keyup', onKeyPressUpChangeClass)

  useEffect(function() {
    setVisualKeyboard(initializeVisualKeyboard)
  }, [])

  let memoizedVisualKeyboardLayer1 = useMemo(function() {
    return renderVisualKeyboardLayer([0, 14])
  }, [visualKeyboard])

  let memoizedVisualKeyboardLayer2 = useMemo(function() {
    return renderVisualKeyboardLayer([14, 28])
  }, [visualKeyboard])

  let memoizedVisualKeyboardLayer3 = useMemo(function() {
    return renderVisualKeyboardLayer([28, 41])
  }, [visualKeyboard])

  let memoizedVisualKeyboardLayer4 = useMemo(function() {
    return renderVisualKeyboardLayer([41, 53])
  }, [visualKeyboard]) 

  let memoizedVisualKeyboardLayer5 = useMemo(function() {
    return renderVisualKeyboardLayer([53, 54])
  }, [visualKeyboard])

  return (
    <>
      <div className={ styles.keyboardLayer }>
        { memoizedVisualKeyboardLayer1 }
      </div>
      <div className={ styles.keyboardLayer }>
        { memoizedVisualKeyboardLayer2 }
      </div>
      <div className={ styles.keyboardLayer }>
        { memoizedVisualKeyboardLayer3 }
      </div>
      <div className={ styles.keyboardLayer }>
        { memoizedVisualKeyboardLayer4 }
      </div>
      <div className={ styles.keyboardLayer }>
        { memoizedVisualKeyboardLayer5 }
      </div>
    </>
  )
}

export default VisualKeyboard
