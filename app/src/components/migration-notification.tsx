import React from 'react';
import MigrationModal from '../components/migration-modal';
import MigrationStore from '../flux/stores/migration-store';
import { ListensToFluxStore, RetinaImg } from 'mailspring-component-kit';
import { localized, Actions, FocusedPerspectiveStore, NativeNotifications } from 'mailspring-exports';
import { ipcRenderer, app } from 'electron';
import { upperFirst, isEqual } from 'lodash';

type MigrationNotificationProps = {
  notification?: {};
};


export class MigrationNotification extends React.Component<MigrationNotificationProps> {
  static displayName = 'MigrationNotification';


  constructor(props) {
    super(props);
    this.state = {
      showButtons: false,
    };
  }

  componentWillMount() {
    console.log('componentWillMount');
    // ipcRenderer.send('rsm:migration_store:notification', { action: 'init' });
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(nextProps) {
    if (
      Object.keys(nextProps.notification).length &&
      !isEqual(nextProps.notification, this.props.notification)
    ) {
      this._onNotification(nextProps.notification);
    }
  }

  _onNotification = (data) => {
    NativeNotifications.displayNotification({
      title: 'Device ' + upperFirst(data.type),
      subtitle: `${data.device.name} ${data.type} ${data.model_name}`,
      tag: '',
      canReply: false,
    });
  }

  render() {
    return (<span></span>);
  }
}

export default ListensToFluxStore(MigrationNotification, {
  stores: [MigrationStore, FocusedPerspectiveStore],
  getStateFromStores() {
    return {
      notification: MigrationStore.notification()
    };
  },
});
