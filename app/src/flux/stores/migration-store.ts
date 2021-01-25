import MailspringStore from 'mailspring-store';
import { ipcRenderer } from 'electron';

// Stores should closely match the needs of a particular part of the front end.
// For example, we might create a "MessageStore" that observes this store
// for changes in selectedThread, "DatabaseStore" for changes to the underlying database,
// and vends up the array used for that view.

class MigrationStore extends MailspringStore {
  // _searchQuery = (FocusedPerspectiveStore.current() as any).searchQuery || '';
  _devices = [];
  _migrationMethod = '';
  _perspectiveBeforeSearch = null;
  _notification = {};

  constructor() {
    super();
    ipcRenderer.on('rsm:migration_store', (event, params) => {
      console.log('rsm:migration_store', params);
      if (params.action == 'devices') {
        this._devices = params.devices;
      } else if (params.action == 'joined' || params.action == 'left') {
        this._notification = {
          type: params.action,
          device: params.data.device || params.data,
          model_name: params.data.model_name || ''
        }
      }


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

  notification() {
    return this._notification;
  }

}

export default new MigrationStore();
