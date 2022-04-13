import type { NextPage } from "next"
import React, { useState, useEffect, useMemo, ChangeEvent, KeyboardEvent } from 'react'
import styles from '../styles/Typer.module.css'

const Typer: NextPage = () => {
  interface wordObj {
    word: string,
    class: string,
    index: number,
  }

  const [quoteObjArr, setQuoteObjArr] = useState<wordObj[]>([])
  const [input, setInput] = useState<string>('')
  const [quoteObjArrCurrIndex, setQuoteObjArrCurrIndex] = useState<number>(0)
  const [typingStartTime, setTypingStartTime] = useState<number | undefined>(undefined)

  function validateInput(): wordObj[] {
    return [...quoteObjArr].map(function(word: wordObj) {
      if (word.index === quoteObjArrCurrIndex) {
        if (word.word === input) {
          word.class = 'styles.correctWord'
        } else {
          word.class = 'styles.incorrectWord'
        }
      }
      return word
    })
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
      setQuoteObjArrCurrIndex((prevCount: number) => prevCount + 1)
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

  function initializeQuoteObjArr(splitQuote: string[]): wordObj[] {
    return splitQuote.map(function(word: string, index: number) {
      return {
        word: word,
        class: 'styles.defaultWord',
        index: index,
      }
    })
  }
  
  async function pageInit() {
    let fetchedQuote = await fetchQuote()
    let splitQuote = splitQuoteAtSpaces(fetchedQuote)
    setQuoteObjArr(initializeQuoteObjArr(splitQuote))
  }

  async function refreshPage() {
    setQuoteObjArrCurrIndex(0)
    setTypingStartTime(undefined)
    pageInit()
  }

  function renderQuote(renderableQuote: wordObj[]) {
    return (
      <div className={ styles.renderedWordsContainer }>
        { [...renderableQuote].map(function(word: wordObj, index: number) {
          switch (word.class) {
            case 'styles.defaultWord':
              if (word.index === quoteObjArrCurrIndex) {
                return <div className={ styles.currentWord } key={ index }>
                  { word.word }&nbsp;
                </div>
              } else {
                return <div className={ styles.defaultWord } key={ index }>
                  { word.word }&nbsp;
                </div>
              }
            case 'styles.correctWord':
              return <div className={ styles.correctWord } key={ index }>
                { word.word }&nbsp;
              </div>
            case 'styles.incorrectWord':
              return <div className={ styles.incorrectWord } key={ index }>
                { word.word }&nbsp;
              </div>
          }
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
      if (quoteObjArrCurrIndex === quoteObjArr.length) {
        return Math.round(
          (quoteObjArr.length / ((Date.now() - typingStartTime) * 0.001)) * 60
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

  let memoizedCurrentHeader = useMemo(function() {
    return currentHeader()
  }, [quoteObjArrCurrIndex])

  let memoizedRenderQuote = useMemo(function() {
    return renderQuote(quoteObjArr)
  }, [quoteObjArr])

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
              onClick={ function() { refreshPage() } }>
              refresh
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Typer
