/**
 * Created by atul on 12/04/17.
 */
import * as types from './actionTypes';

export function beginAjaxCall() {
  return {
    type: types.BEGIN_AJAX_CALL
  };
}
