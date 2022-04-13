import type { NextPage } from "next"
import React, { useState, useEffect, useMemo, ChangeEvent, KeyboardEvent } from 'react'
import styles from '../styles/Typer.module.css'
import useEventListener from "@use-it/event-listener"

const Typer: NextPage = () => {
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

  function renderVisualKeyboard() {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...visualKeyboard].map(function(key: keyboardButton, index: number) {
          return renderVisualKeyboardKey(key, index)
        }) }
      </div>
    )
  }

  function renderVisualKeyboardLayer1() {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...visualKeyboard.slice(0, 10)].map(function(key: keyboardButton, index: number) {
          return renderVisualKeyboardKey(key, index)
        }) }
      </div>
    )
  }

  function renderVisualKeyboardLayer2() {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...visualKeyboard.slice(10, 19)].map(function(key: keyboardButton, index: number) {
          return renderVisualKeyboardKey(key, index)
        }) }
      </div>
    )
  }

  function renderVisualKeyboardLayer3() {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...visualKeyboard.slice(19)].map(function(key: keyboardButton, index: number) {
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
    setVisualKeyboard(reInitVisualKeyboardOnKeyDown(key))
  }

  function onKeyPressUpChangeClass() {
    setVisualKeyboard(initializeVisualKeyboard)
  }

  useEventListener('keydown', onKeyPressDownChangeClass)
  useEventListener('keyup', onKeyPressUpChangeClass)

  interface wordObj {
    word: string,
    class: string,
    index: number,
  }

  const [quoteObjArr, setQuoteObjArr] = useState<wordObj[]>([])
  const [input, setInput] = useState<string>('')
  const [currentTyperIndex, setCurrentTyperIndex] = useState<number>(0)
  const [typingStartTime, setTypingStartTime] = useState<number | undefined>(undefined)

  function wordCorrectness(word: wordObj) {
    if (word.index === currentTyperIndex) {
      if (word.word === input) {
        word.class = 'styles.correctWord'
      } else {
        word.class = 'styles.incorrectWord'
      }
    }
    return word
  }

  function validateInput(): wordObj[] {
    return [...quoteObjArr].map(wordCorrectness)
  } 

  function changeInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value !== ' ') {
      if (typingStartTime === undefined) {
        setTypingStartTime(Date.now())
      }
      return setInput(e.target.value)
    }
  }

  function inputHandler(e: KeyboardEvent) {
    if (e.key === ' ') {
      setQuoteObjArr(validateInput())
      setCurrentTyperIndex((prevCount: number) => prevCount + 1)
      return setInput('')
    }
  }

  async function fetchQuote(): Promise<string> {
    const response = await fetch('https://api.quotable.io/random')
    const result = await response.json()
    return result.content
  }

  function splitQuoteAtSpaces(splittableQuote: string): string[] {
    return [...splittableQuote.split(' ')]
  }

  function initializeWord(word: string, index: number) {
    return {
      word: word,
      class: 'styles.defaultWord',
      index: index,
    }
  }

  function initializeQuoteObjArr(splitQuote: string[]): wordObj[] {
    return [...splitQuote].map(initializeWord)
  }
  
  async function pageInit() {
    let fetchedQuote = await fetchQuote()
    let splitQuote = splitQuoteAtSpaces(fetchedQuote)
    setQuoteObjArr(initializeQuoteObjArr(splitQuote))
  }

  async function refreshPage() {
    setCurrentTyperIndex(0)
    setTypingStartTime(undefined)
    pageInit()
  }

  function renderDefaultWord(word: wordObj, index: number) {
    return <div className={ styles.defaultWord } key={ index }>
      { word.word }&nbsp;
    </div>
  }

  function renderCurrentWord(word: wordObj, index: number) {
    return <div className={ styles.currentWord } key={ index }>
      { word.word }&nbsp;
    </div>
  }

  function renderCorrectWord(word: wordObj, index: number) {
    return <div className={ styles.correctWord } key={ index }>
      { word.word }&nbsp;
    </div>
  }

  function renderIncorrectWord(word: wordObj, index: number) {
    return <div className={ styles.incorrectWord } key={ index }>
      { word.word }&nbsp;
    </div>
  }

  function renderWord(word: wordObj, index: number) {
    switch (word.class) {
      case 'styles.defaultWord':
        if (word.index === currentTyperIndex) {
          return renderCurrentWord(word, index)
        } else {
          return renderDefaultWord(word, index)
        }
      case 'styles.correctWord':
        return renderCorrectWord(word, index)
      case 'styles.incorrectWord':
        return renderIncorrectWord(word, index)
    }
  }

  function renderQuote(renderableQuote: wordObj[]) {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...renderableQuote].map(function(word: wordObj, index: number) {
          return renderWord(word, index)
        }) }
      </div>
    )
  }

  function correctWords() {
    let correctWords: number = 0;
    [...quoteObjArr].map(function(word: wordObj) {
      if (word.class === 'styles.correctWord') {
        correctWords += 1
      }
    })
    return correctWords
  }

  function wordAccuracy() {
    return Math.round((correctWords() / quoteObjArr.length) * 100)
  }

  function wordsPerMinute() {
    if (typingStartTime === undefined) {
      return '--'
    } else {
      if (currentTyperIndex === quoteObjArr.length) {
        return Math.round(
          (correctWords() / ((Date.now() - typingStartTime) * 0.001)) * 60
        )
      } else {
        return '--'
      }
    }
  }

  function currentHeader() {
    return (
      <div className={ styles.currentHeader }>
        <div className={ styles.header }>
          ACC: { wordAccuracy() }%
          | WPM: { wordsPerMinute() }
        </div>
      </div>
    )
  }

  let memoizedRenderQuote = useMemo(function() {
    return renderQuote(quoteObjArr)
  }, [quoteObjArr])

  let memoizedCurrentHeader = useMemo(function() {
    return currentHeader()
  }, [currentTyperIndex, memoizedRenderQuote])

  useEffect(function() {
    pageInit()
    setVisualKeyboard(initializeVisualKeyboard)
  }, [])

  return(
    <>
      <div className={ styles.appWrapper }>
        { memoizedCurrentHeader }
        <div className={ styles.container }>
          <div>
            { memoizedRenderQuote }
          </div>
           <div className=''>
            <input
              value={ input }
              onInput={ function(e: ChangeEvent<HTMLInputElement>) {
                changeInput(e)
              }} 
              onKeyDown={ function(e: KeyboardEvent<HTMLInputElement>) {
                inputHandler(e)
              }}
              className={ styles.userInputField }
            />
            <button 
              className={ styles.refreshButton }
              onClick={ function() { refreshPage() } }>
              refresh
            </button>
          </div>
        </div>
        <div className={ styles.keyboard }>
          { useMemo(function() {
            return renderVisualKeyboardLayer1()
          }, [visualKeyboard]) }
        </div>
        <div className={ styles.keyboard }>
          { useMemo(function() {
            return renderVisualKeyboardLayer2()
          }, [visualKeyboard]) }
        </div>
        <div className={ styles.keyboard }>
          { useMemo(function() {
            return renderVisualKeyboardLayer3()
          }, [visualKeyboard]) }
        </div>
      </div>
    </>
  )
}

export default Typer
