import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { keyframes, css } from 'styled-components'
import Particles from './Particles'

const pulse = keyframes`
  0% { box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff; }
  100% { box-shadow: 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff; }
`

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const GameBoard = styled.div`
  width: 800px;
  height: 500px;
  border: 2px solid #0ff;
  position: relative;
  ${css`animation: ${pulse} 2s infinite alternate;`}
`

const Paddle = styled.div`
  width: 15px;
  height: 100px;
  background: #fff;
  position: absolute;
  ${props => props.right ? 'right: 0;' : 'left: 0;'}
  top: ${props => props.position}px;
  box-shadow: 0 0 10px #fff, 0 0 20px #fff;
  border-radius: 20px;
`

const Ball = styled.div`
  width: 15px;
  height: 15px;
  background: #fff;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff, 0 0 20px #fff;
`

const Score = styled.div`
  position: absolute;
  top: 20px;
  font-size: 32px;
  color: #fff;
  text-shadow: 0 0 10px #0ff;
  ${props => props.left ? 'left: 20%;' : 'right: 20%;'}
`

const Game = () => {
  const [paddle1Pos, setPaddle1Pos] = useState(200)
  const [paddle2Pos, setPaddle2Pos] = useState(200)
  const [ballPos, setBallPos] = useState({ x: 390, y: 240 })
  const [ballDir, setBallDir] = useState({ x: 5, y: 5 })
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const gameLoop = useRef(null)
  const paddleSpeed = 20
  const maxPaddleY = 400

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'w':
          setPaddle1Pos(prev => Math.max(0, prev - paddleSpeed))
          break
        case 's':
          setPaddle1Pos(prev => Math.min(maxPaddleY, prev + paddleSpeed))
          break
        case 'ArrowUp':
          setPaddle2Pos(prev => Math.max(0, prev - paddleSpeed))
          break
        case 'ArrowDown':
          setPaddle2Pos(prev => Math.min(maxPaddleY, prev + paddleSpeed))
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    const update = () => {
      setBallPos(prev => {
        let newX = prev.x + ballDir.x
        let newY = prev.y + ballDir.y
        let newDirX = ballDir.x
        let newDirY = ballDir.y

        // Collision with top and bottom
        if (newY <= 0 || newY >= 485) {
          newDirY = -newDirY
        }

        // Collision with paddles
        if (newX <= 15 && newY >= paddle1Pos && newY <= paddle1Pos + 100) {
          newDirX = -newDirX
          newX = 15
        }
        if (newX >= 770 && newY >= paddle2Pos && newY <= paddle2Pos + 100) {
          newDirX = -newDirX
          newX = 770
        }

        // Scoring
        if (newX <= 0) {
          setScore(prev => ({ ...prev, player2: prev.player2 + 1 }))
          newX = 390
          newY = 240
        }
        if (newX >= 800) {
          setScore(prev => ({ ...prev, player1: prev.player1 + 1 }))
          newX = 390
          newY = 240
        }

        setBallDir({ x: newDirX, y: newDirY })
        return { x: newX, y: newY }
      })
    }

    gameLoop.current = setInterval(update, 16)
    return () => clearInterval(gameLoop.current)
  }, [ballDir, paddle1Pos, paddle2Pos])

  return (
    <GameContainer>
      <Particles />
      <Score left>{score.player1}</Score>
      <Score>{score.player2}</Score>
      <GameBoard>
        <Paddle position={paddle1Pos} />
        <Paddle right position={paddle2Pos} />
        <Ball x={ballPos.x} y={ballPos.y} />
      </GameBoard>
    </GameContainer>
  )
}

export default Game
