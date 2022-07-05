import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import io from 'socket.io-client'

import { Message } from '@types'

import { SOCKET_EVENTS } from '@utils/constants'

const socket = io(document.URL)

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    socket.on(SOCKET_EVENTS.INIT, (data: Message[]) => {
      setMessages(data)
    })
    socket.on(SOCKET_EVENTS.GET, (data: Message) => {
      setMessages(messages => [...messages, data])
    })
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text === '') return
    setDisabled(true)
    socket.emit(SOCKET_EVENTS.POST, text, () => {
      setDisabled(false)
      setText('')
    })
  }

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
  }

  return (
    <div className="max-w-sm mx-auto mt-2 border border-gray-300 rounded-lg">
      <div className="p-2 font-semibold text-cyan-700">Chat</div>
      {messages.length ? (
        messages.map((message, index) => (
          <div
            key={index}
            className="py-1 px-2 text-xs text-gray-700 border-t border-gray-50"
          >
            {message}
          </div>
        ))
      ) : (
        <div className="pb-2 px-2 text-xs text-gray-200">Empty</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-2 space-x-2 border-t border-gray-200"
      >
        <div className="flex-auto">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="block w-full shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="bg-white py-2.5 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default App
