import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    removeNotification: () => ''
  }
})  


const {setNotification, removeNotification} = notificationSlice.actions

export const setNotificationMessage = (message, timeout = 500) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout*1000)
  }
}
export default notificationSlice.reducer