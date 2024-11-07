import { useEffect, useState } from 'react'
import io from 'socket.io-client'
const socket = io('http://localhost:4000')


export default function App() {

  const [messages, setMessages] = useState([])

  const handleSubmit = (e)=>{
    e.preventDefault()
    const formData = new FormData(e.target)

    const message = formData.get('message')

    socket.emit('new-message', message)

    e.target.reset()
  }
//SABER CUANDO EL USUARIO SE CONECTA
  useEffect(()=>{
    socket.on('connect', () => {
      console.log('connected')
    }
    
  );
  return ()=>{
    socket.disconnect()
  }

  },[])
  useEffect(()=>{
    socket.on('new-message', (listMessages)=>{
      setMessages(listMessages)
      
    })
    socket.on('get-messages', (listMessages)=>{
      setMessages(listMessages)
    })
    return ()=>{
      socket.off('new-message')
      socket.off('get-messages')
    }
  }, [])

  return (
    <main>
      <div>
        <ul>
          {messages?.map((message, index)=>(
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
      <input type="text" name="message" id="message" />
      <button type='submit'>Submit</button>
    </form>
    </main>
  ) 
}