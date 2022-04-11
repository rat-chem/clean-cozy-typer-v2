import type { NextPage } from "next"
import React, { useState, useEffect, useMemo } from 'react'
import styles from '../styles/Typer.module.css'

const Typer: NextPage = () => {
  const [keyPressed, setKeyPressed] = useState<string>('')
  const [input, setInput] = useState<string>('')
  const [quote, setQuote] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string>('')
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
  const [previousWord, setPreviousWord] = useState<string>('')
  const [previousInput, setPreviousInput] = useState<string>('')
  const [wordsClasses, setWordsClasses] = useState<string[]>([])
  const [newQuoteClicked, setNewQuoteClicked] = useState<boolean>(false)
  const [correctWords, setCorrectWords] = useState<number>(0)
  const [firstKeyStrokeCheck, setFirstKeyStrokeCheck] = useState<boolean>(false)
  const [timerStart, setTimerStart] = useState<number>(0)

  const inputHandler = (e: any) => {
    switch (e.key) {
      case ' ':
        if (currentWord === input) {
          setCorrectWords(correctWords + 1)
        }

        setPreviousWord(currentWord)
        setPreviousInput(input)
        
        setCurrentWordIndex(currentWordIndex + 1)
        setCurrentWord(quote[currentWordIndex])

        setInput('')
        break
      default:
        setKeyPressed(e.key)
        break
    }
  }

  const changeInput = (e: any) => {
    if (!firstKeyStrokeCheck) {
      console.log(e.key)
      setFirstKeyStrokeCheck(true)
      setTimerStart(Date.now())
    }

    if (e.target.value !== ' ') {
      setInput(e.target.value)
    }
  }

  const renderWord = (word: any, index: number) => {
    let className: string = 'defaultWord'
    
    if (currentWordIndex !== 1) {
      if (index < currentWordIndex - 2) {
        className = wordsClasses[index]
      } else if (index >= currentWordIndex - 2) {
        if (previousWord === previousInput) {
          className = 'correctWord'
        } else {
          className = 'incorrectWord'
        }
      }

      let newWordsClasses: string[] = [ ...wordsClasses ]
      newWordsClasses.push(className)
      setWordsClasses([ ...newWordsClasses ])
      
      if (newWordsClasses[index] !== undefined) {
        className = newWordsClasses[index]

        if (className === 'correctWord') {
          return (
            <div className={ styles.correctWord }>
              { word }
              &nbsp;
            </div>
          )
        } else {
          return (
            <div className={ styles.incorrectWord }>
              { word }
              &nbsp;
            </div>
          )
        }
      } else {
        className = 'defaultWord'
        if (index === newWordsClasses.length) {
          className = 'currentWord'
          return (
            <div className={ styles.currentWord }>
              { word }
              &nbsp;
            </div>
          )
        }
        return (
          <div className={ styles.defaultWord }>
            { word }
            &nbsp;
          </div>
        )
      }
    } else {
      if (index === 0) {
        className = 'currentWord'
        return (
          <div className={ styles.currentWord }>
            { word }
            &nbsp;
          </div>
        )
      } else {
        return (
          <div className={ styles.defaultWord }>
            { word }
            &nbsp;
          </div>
        )
      }
    }
  }

  const renderAllWords = () => {
    return (
      <div className={ styles.renderedWordsContainer }>
        { quote.map((word: string, index: number) => (
          <div key={ index }>
            { renderWord(word, index) }
          </div>
        )) }
      </div>
    )
  }

  const fetchRandomQuote = async () => {
    const response: any = await fetch('https://api.quotable.io/random')
    const result: any = await response.json()
    
    setQuote([...result.content.split(' ')])
    setCurrentWord(result.content.split(' ')[0])

    if (currentWordIndex === 1) {
      setNewQuoteClicked(!newQuoteClicked)
    }

    setCurrentWordIndex(1)
  }

  useEffect(() => {
    fetchRandomQuote()
  }, [])

  const newQuote = () => {
    // reset each stateful element to default
    setKeyPressed('')
    setInput('')
    setCurrentWord('')
    setPreviousWord('')
    setPreviousInput('')
    setWordsClasses([...[]])
    setCorrectWords(0)
    setFirstKeyStrokeCheck(false)
    setTimerStart(0)

    fetchRandomQuote()
  }

  const CurrentHeader = () => {
    return (
      <div className={ styles.currentHeader }>
        <div className={ styles.header }>
          ACC: { Math.round(correctWords / quote.length * 100) }%
          | WPM: { Math.round(correctWords / (((Date.now() - timerStart) * .001) / 60)) }
        </div>
      </div>
    )
  }

  return (
    // WRAPPER JSX ELEMENT
    <>
      <div className={ styles.appWrapper }>
        { CurrentHeader() }
        <div className={ styles.container }>
          {/** --RENDERS TYPING CONTENT-- */}
          <div className=''>
            { useMemo(() => {
              return (
                renderAllWords()
              )
            }, [currentWordIndex, newQuoteClicked]) }
          </div>

          <div className=''>
            {/** --TYPER INPUT FIELD-- */}
            <input
              value={ input }
              onInput={ (e: any) => { changeInput(e) } } 
              onKeyDown={ (e: any) => { inputHandler(e) } }
              className={ styles.userInputField }
            />

            {/** --NEW TYPING CONTENT/RESET BUTTON-- */}
            <button 
              className={ styles.refreshButton }
              onClick={ () => { newQuote() } }>
              refresh
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Typer
