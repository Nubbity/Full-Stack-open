import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 0)
const setNotification = (message) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: '' })
    }, 5000)
  }
  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
