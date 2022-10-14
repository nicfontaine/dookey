import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  value: {}
}

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTag: (state, action) => {
      // state.value.push(action.payload)
    },
    deleteTag: (state, action) => {
      // state.value.splice(action.payload, 1)
    },
  }
})

export const { addTodo, moveTodo, archiveTodo, deleteTodo } = tagsSlice.actions

export default tagsSlice.reducer