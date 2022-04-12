import type { NextPage } from "next"
import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react'
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

  async function pageInit() {
    let fetchedQuote = await fetchQuote()
    let splitQuote = splitQuoteAtSpaces(fetchedQuote)
    setQuoteObjArr(splitQuote.map(function(word: string, index: number) {
      return {
        word: word,
        class: 'styles.defaultWord',
        index: index,
      }
    }))
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

  let memoizedRenderQuote = useMemo(function() {
    return renderQuote(quoteObjArr)
  }, [quoteObjArr])

  useEffect(function() {
    console.log()
    pageInit()
  }, [])

  return(
    <>
      <div className={ styles.appWrapper }>
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
              onKeyDown={ function(e: any) {
                inputHandler(e)
              }}
              className={ styles.userInputField }
            />
            <button 
              className={ styles.refreshButton }
              onClick={ () => {} }>
              refresh
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Typer
