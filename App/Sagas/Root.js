import { takeEvery } from 'redux-saga'
import * as loginSagas from './Login'
import * as registerSagas from './Register'
import * as mainSagas from './Main'
import * as navigationSagas from './Navigation'
import * as attendanceSagas from './Attendance'

// single entry point to start all Sagas at once
export default function* rootSaga() {
    try {
        yield takeEvery('LOGIN_ATTEMPT',loginSagas.attempt)
        yield takeEvery('MAIN_FETCH_CLASSES',mainSagas.fetchClasses)
        yield takeEvery('NAV_PUSH_REQUEST',navigationSagas.push)
        yield takeEvery('ATTENDANCE_FETCH_CLASS',attendanceSagas.fetchClass)
        yield takeEvery('ATTENDANCE_SUBMIT',attendanceSagas.submit)
    } catch(error) {
        console.log('SAGA ERROR',error)
    }
}



