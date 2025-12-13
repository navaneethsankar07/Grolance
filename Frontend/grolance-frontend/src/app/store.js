import {configureStore} from '@reduxjs/toolkit'
import authreducer from '../features/client/account/auth/authslice'

const store = configureStore({
    reducer:{
        auth:authreducer,
    },
})

export default store