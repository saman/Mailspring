import React from 'react';
import { localized, Actions } from 'mailspring-exports';
import { RetinaImg } from 'mailspring-component-kit';
import MigrationModal from '../../../src/components/migration-modal';
// OLD VERSION
// /Users/saman / Projects / asml - lang / Mailspring / app / src / components / migration - modal.tsx
// /Users/saman/Projects/asml-lang/Mailspring/app/internal_packages/composer/lib/migration-button.tsx
export default class MigrationButton extends React.Component {
  static displayName = 'MigrationButton';

  _onMigration = () => {
    // Actions.migrationWindow();
    Actions.openModal({
      component: <MigrationModal source="preferences" />,
      width: MigrationModal.IntrinsicWidth,
      height: MigrationModal.IntrinsicHeight,
    });
  };

  render() {
    return (
      <button
        className="btn btn-toolbar item-compose"
        title={localized('Run-time Migration')}
        onClick={this._onMigration}
      >
        <RetinaImg name="toolbar-migration.png" mode={RetinaImg.Mode.ContentIsMask} />
      </button>
    );
  }
}
