import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {createStore, combineReducers, applyMiddleware} from 'redux'

// import {user} from './user'
// import {sites} from './sites'

const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true
})

// const rootReducer = combineReducers({user, sites})
const rootReducer = combineReducers({})

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)