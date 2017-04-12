import * as types from './actionTypes';
import authorApi from '../api/mockAuthorApi';

export function createAuthor(author){
  return { type: types.CREATE_AUTHOR, author: author};
}

export function loadAuthorsSuccess(authors){
  return { type: types.LOAD_AUTHORS_SUCCESS, authors: authors};
}

export function loadAuthors(){
  return function(dispatch){
    return authorApi.getAllAuthors().then((authors) => {
        dispatch(loadAuthorsSuccess(authors));
      }
    ).catch((error) => {
      throw(error);
    });
  };
}
