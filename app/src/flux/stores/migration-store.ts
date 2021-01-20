import MailspringStore from 'mailspring-store';
import { ipcRenderer } from 'electron';
import { Actions, AccountStore, FocusedPerspectiveStore } from 'mailspring-exports';
import { SearchObject } from '../../../src/models/Search';
// import SearchMailboxPerspective from './search-mailbox-perspective';
import { isObject } from 'underscore';

// Stores should closely match the needs of a particular part of the front end.
// For example, we might create a "MessageStore" that observes this store
// for changes in selectedThread, "DatabaseStore" for changes to the underlying database,
// and vends up the array used for that view.

class MigrationStore extends MailspringStore {
  // _searchQuery = (FocusedPerspectiveStore.current() as any).searchQuery || '';
  _devices = [];
  _migrationMethod = '';
  _perspectiveBeforeSearch = null;

  constructor() {
    super();
    ipcRenderer.on('rsm:migration_modal', (event, params) => {
      this._devices = params;
      this.trigger();
    });

    // this.listenTo(FocusedPerspectiveStore, this._onPerspectiveChanged);
    // this.listenTo(Actions.searchQuerySubmitted, this._onQuerySubmitted);
    // this.listenTo(Actions.searchQueryChanged, this._onQueryChanged);
    // this.listenTo(Actions.searchCompleted, this._onSearchCompleted);
  }

  devices() {
    return this._devices;
  }

}

export default new MigrationStore();
