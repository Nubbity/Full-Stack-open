import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote: (state, action) => {
      state.push(action.payload)
    },
    vote: (state, action) => {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1
      }
      // Sort by votes descending
      state.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes: (state, action) => {
      return action.payload.sort((a, b) => b.votes - a.votes)
    },
    updateAnecdote: (state, action) => {
      const updated = action.payload
      return state.map(a => a.id === updated.id ? updated : a).sort((a, b) => b.votes - a.votes)
    }
  }
})
const {setAnecdotes, createAnecdote, updateAnecdote} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}


export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const addVote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = await anecdoteService.vote(anecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}
export default anecdoteSlice.reducer
