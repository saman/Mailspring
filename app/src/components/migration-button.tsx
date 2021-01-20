import React from 'react';
import { localized, Actions } from 'mailspring-exports';
import { RetinaImg } from 'mailspring-component-kit';
import MigrationModal, { MigrationModalConfig } from '../components/migration-modal';

export default class MigrationButton extends React.Component {
  static displayName = 'MigrationButton';

  _onMigration = () => {
    // Actions.migrationWindow();

    Actions.openModal({
      component: <MigrationModal />,
      width: MigrationModalConfig.IntrinsicWidth,
      height: MigrationModalConfig.IntrinsicHeight,
    });
  };

  render() {
    return (
      <div className="migration-btn">
        <button
          style={{ display: 'none' }} className="float"
          title={localized('Run-time Migration')}
          onClick={this._onMigration}
        >
          <RetinaImg name="migration-icon.png" mode={RetinaImg.Mode.ContentPreserve} />
        </button>
      </div>
    );
  }
}
