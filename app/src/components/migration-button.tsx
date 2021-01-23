import React from 'react';
import MigrationModal from '../components/migration-modal';
import MigrationStore from '../flux/stores/migration-store';
import { ListensToFluxStore, RetinaImg } from 'mailspring-component-kit';
import { localized, Actions, FocusedPerspectiveStore } from 'mailspring-exports';
import { ipcRenderer, app } from 'electron';

type MigarationButtonProps = {
  devices?: [];
  model: string;
};

type MigarationButtonState = {
  devices?: [];
  showButtons: boolean;
};

export class MigrationButton extends React.Component<MigarationButtonProps, MigarationButtonState> {
  static displayName = 'MigrationButton';


  constructor(props) {
    super(props);
    this.state = {
      showButtons: false,
    };
  }

  componentWillMount() {
    console.log('componentWillMount');
    ipcRenderer.send('rsm:migration_store', { action: 'init', model: this.props.model });
    // if (!this.state.src) {

    // }
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps-button', nextProps);
    console.log(JSON.stringify(nextProps));
    this.setState({ devices: nextProps.devices });
  }

  _onMigrationModal = (method: string) => {
    const showButtons = !this.state.showButtons;
    this.setState({ showButtons });
    const { model } = this.props;
    let { devices } = this.state;
    console.log('_onMigrationModal', devices);
    if (method == 'pull') {
      // @ts-ignore
      devices = devices.filter(d => d.models_has_state.includes(model))
    }

    if (devices.length) {
      Actions.openModal({
        component: <MigrationModal devices={devices} method={method} model={model} />,
        width: MigrationModal.IntrinsicWidth,
        height: MigrationModal.IntrinsicHeight,
      });
    } else {
      alert('There is no device at the moment');
    }

  };

  _onMigrationButton = () => {
    const showButtons = !this.state.showButtons;
    this.setState({ showButtons });
    if (showButtons) {
      ipcRenderer.send('rsm:migration_store', { action: 'devices', model: this.props.model });
    }
  }

  render() {
    return (
      <div className="migration-btn" style={{ display: 'none' }}>
        {this.state.showButtons ?
          <div>
            <button
              className="float small get"
              title={localized('Get Data')}
              onClick={() => this._onMigrationModal('pull')}
            >
              <RetinaImg name="migration-icon-get.png" mode={RetinaImg.Mode.ContentPreserve} />
            </button>
            <button
              className="float small set"
              title={localized('Set Data')}
              onClick={() => this._onMigrationModal('push')}
            >
              <RetinaImg name="migration-icon-set.png" mode={RetinaImg.Mode.ContentPreserve} />
            </button>
          </div>
          : null}
        <button
          className="float"
          title={localized('Migration')}
          onClick={this._onMigrationButton}
        >
          <RetinaImg name="migration-icon.png" mode={RetinaImg.Mode.ContentPreserve} />
        </button>
      </div>
    );
  }
}

export default ListensToFluxStore(MigrationButton, {
  stores: [MigrationStore, FocusedPerspectiveStore],
  getStateFromStores() {
    return {
      devices: MigrationStore.devices(),
      perspective: FocusedPerspectiveStore.current(),
    };
  },
});
