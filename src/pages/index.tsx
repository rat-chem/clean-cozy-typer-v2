import type { NextPage } from "next"
import React, { useState, useEffect, useMemo, ChangeEvent, KeyboardEvent } from 'react'
import styles from '../styles/Typer.module.css'
import VisualKeyboard from "../components/VisualKeyboard"

const Typer: NextPage = () => {
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

  async function fetchQuote() {
    const response = await fetch('https://animechan.vercel.app/api/random')
    const result = await response.json()
    console.log(result)
    return result
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
    let splitQuote = splitQuoteAtSpaces(fetchedQuote.quote)
    setQuoteObjArr(initializeQuoteObjArr(splitQuote))
  }

  async function refreshPage() {
    setCurrentTyperIndex(0)
    setTypingStartTime(undefined)
    setInput('')
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
              onClick={ function() {
                refreshPage()
              }}>
              refresh
            </button>
          </div>
        </div>
      </div>
      <VisualKeyboard />
    </>
  )
}

export default Typer
