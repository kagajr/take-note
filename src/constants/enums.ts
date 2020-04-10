export enum Actions {
  ADD_NOTE = 'ADD_NOTE',
  SWAP_NOTE = 'SWAP_NOTE',
  UPDATE_NOTE = 'UPDATE_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  PRUNE_NOTES = 'PRUNE_NOTES',
  ADD_CATEGORY = 'ADD_CATEGORY',
  SWAP_CATEGORY = 'SWAP_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
  // Sagas
  LOAD_NOTES = 'LOAD_NOTES',
  LOAD_NOTES_SUCCESS = 'LOAD_NOTES_SUCCESS',
  LOAD_NOTES_ERROR = 'LOAD_NOTES_ERROR',
  LOAD_CATEGORIES = 'LOAD_CATEGORIES',
  LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS',
  LOAD_CATEGORIES_ERROR = 'LOAD_CATEGORIES_ERROR',
  SYNC_STATE = 'SYNC_STATE',
  SYNC_STATE_SUCCESS = 'SYNC_STATE_SUCCESS',
  SYNC_STATE_ERROR = 'SYNC_STATE_ERROR',
  ADD_CATEGORY_TO_NOTE = 'ADD_CATEGORY_TO_NOTE',
  PRUNE_CATEGORY_FROM_NOTES = 'PRUNE_CATEGORY_FROM_NOTES',
}
