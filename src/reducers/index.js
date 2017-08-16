/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Alberto Dallaporta <alberto.dallaporta@novalab.io>
 */

'use-strict'

/* base libs */
import { combineReducers } from 'redux'
/* functions/utils */
import session from './session'

const rootReducer = combineReducers({
  session,
})

export default rootReducer
