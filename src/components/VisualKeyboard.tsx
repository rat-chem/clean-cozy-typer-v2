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

  const KEYBOARD_KEYS = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.',
  ]

  const [visualKeyboard, setVisualKeyboard] = useState<keyboardButton[]>([])

  function initializeKeyboardKey(key: string, index: number) {
    return {
      key: key,
      class: 'styles.keyboardKeyNotPressed',
      index: index,
    }
  }

  function initializeVisualKeyboard(): keyboardButton[] {
    return [...KEYBOARD_KEYS].map(initializeKeyboardKey)
  }

  function renderVisualKeyboardKey(key: keyboardButton, index: number) {
    if (key.class === 'styles.keyboardKeyNotPressed') {
      return <div className={ styles.keyboardKeyNotPressed } key={ index }>
        { key.key }
      </div>
    } else {
      return <div className={ styles.keyboardKeyPressed } key={ index }>
        { key.key }
      </div>
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

  function reInitKeyboardClass(key: string, keyClass: string, index: number) {
    return {
      key: key,
      class: keyClass,
      index: index,
    }
  }

  function reInitVisualKeyboardOnKeyDown(inputKey: any): keyboardButton[] {
    return [...KEYBOARD_KEYS].map(function(key: string, index: number) {
      if ((inputKey.key).toLowerCase() !== key.toLowerCase()) {
        return reInitKeyboardClass(key, 'styles.keyboardKeyNotPressed', index)
      } else {
        return reInitKeyboardClass(key, 'styles.keyboardKeyPressed', index)
      }
    })
  }

  function onKeyPressDownChangeClass(key: any) {
    console.log(key)
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

  return (
    <>
      <div className={ styles.keyboard }>
        { useMemo(function() {
          return renderVisualKeyboardLayer([0, 10])
        }, [visualKeyboard]) }
      </div>
      <div className={ styles.keyboard }>
        { useMemo(function() {
          return renderVisualKeyboardLayer([10, 19])
        }, [visualKeyboard]) }
      </div>
      <div className={ styles.keyboard }>
        { useMemo(function() {
          return renderVisualKeyboardLayer([19, visualKeyboard.length])
        }, [visualKeyboard]) }
      </div>
    </>
  )
}

export default VisualKeyboard
