import MailspringStore from 'mailspring-store';
import { ipcRenderer } from 'electron';
import { Actions, AccountStore, FocusedPerspectiveStore } from 'mailspring-exports';
import { SearchObject } from '../../../src/models/Search';
import SearchMailboxPerspective from './search-mailbox-perspective';
import { isObject } from 'underscore';

// Stores should closely match the needs of a particular part of the front end.
// For example, we might create a "MessageStore" that observes this store
// for changes in selectedThread, "DatabaseStore" for changes to the underlying database,
// and vends up the array used for that view.

class SearchStore extends MailspringStore {
  _searchQuery = (FocusedPerspectiveStore.current() as any).searchQuery || '';
  _submit = false;
  _isSearching = false;
  _perspectiveBeforeSearch = null;

  constructor() {
    super();
    ipcRenderer.on('rsm:search', (event, params) => {
      console.log('rsm:thread-search-bar', params);
      this._onState(params.state, params.wndwKey);
    });

    this.listenTo(FocusedPerspectiveStore, this._onPerspectiveChanged);
    this.listenTo(Actions.searchQuerySubmitted, this._onQuerySubmitted);
    this.listenTo(Actions.searchQueryChanged, this._onQueryChanged);
    this.listenTo(Actions.searchCompleted, this._onSearchCompleted);
  }

  submit() {
    return this._submit;
  }

  query() {
    return this._searchQuery;
  }

  queryPopulated() {
    return this._searchQuery && this._searchQuery.trim().length > 0;
  }

  isSearching() {
    return this._isSearching;
  }

  _onSearchCompleted = () => {
    this._isSearching = false;
    this.trigger();
  };

  _onPerspectiveChanged = () => {
    this._searchQuery = (FocusedPerspectiveStore.current() as any).searchQuery || '';
    this.trigger();
  };

  _onQueryChanged = query => {
    this._searchQuery = query;
    this._submit = false;
    this.trigger();
  };

  _onQuerySubmitted = query => {
    this._searchQuery = query;
    this.trigger();

    const current = FocusedPerspectiveStore.current();

    if (this.queryPopulated()) {
      this._isSearching = true;
      if (this._perspectiveBeforeSearch == null) {
        this._perspectiveBeforeSearch = current;
      }
      const next = new SearchMailboxPerspective(current, this._searchQuery.trim());
      Actions.focusMailboxPerspective(next);
    } else if (current instanceof SearchMailboxPerspective) {
      if (this._perspectiveBeforeSearch) {
        Actions.focusMailboxPerspective(this._perspectiveBeforeSearch);
        this._perspectiveBeforeSearch = null;
      } else {
        Actions.focusDefaultMailboxPerspectiveForAccounts(AccountStore.accounts());
      }
    }
  };


  _onState = (data, wndwKey) => {
    console.log('_onState');
    console.log(JSON.stringify(data));
    const search: SearchObject = data;
    this._searchQuery = search.query || "";
    this._submit = search.submit || false;
    this.trigger();
    // if state is not empty and there is a state
    // tell the other app the migration is done
    if (isObject(data) && Object.keys(data).length > 0) {
      ipcRenderer.send('rsm:search', { action: 'migration' });
    }
  };
}

export default new SearchStore();
