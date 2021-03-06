import React from 'react';
import PropTypes from 'prop-types';
import { webFrame } from 'electron';
import Webview from './webview';
import { IdentityStore } from '../flux/stores/identity-store';
import { Flexbox, ScrollRegion } from 'mailspring-component-kit';
import { ipcRenderer, app } from 'electron';
import { Actions, NativeNotifications } from 'mailspring-exports';


type MigarationModalProps = {
  devices?: [];
  method: string;
  model: string;
};

type MigarationModalState = {
  device: string;
  // devices: [];
};

export default class MigrationModal extends React.Component<MigarationModalProps, MigarationModalState> {
  static IntrinsicWidth = 412;
  static IntrinsicHeight = 250;

  _mounted: boolean = false;
  _initialZoom: number;

  constructor(props) {
    super(props);
    this.state = {
      device: '',
      // devices: [],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._mounted = true;
  }

  /**
   * The Migaration modal can get closed for any number of reasons. The user
   * may push escape, click continue below, or click outside of the area.
   * Regardless of the method, Actions.closeModal will fire. The
   * FeatureUsageStore listens for Actions.closeModal and looks at the
   * to determine if the user succesffully paid us or not.
   */
  componentWillUnmount() {
    this._mounted = false;
  }


  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps-modal', nextProps);
  //   this.setState({ devices: nextProps.devices });
  // }

  _onMigrate = () => {
    // alert('migrate');
    const { device } = this.state;

    if (device.length) {
      const { model, method } = this.props;
      ipcRenderer.send(`rsm:${model}`, { action: method, data: { device } });

      Actions.closeModal();
    } else {
      alert('Please select a device');
    }
  }

  _onDeviceChange = (e) => {
    this.setState({
      device: e.currentTarget.value
    });
  }


  render() {
    const { model, method, devices } = this.props;
    // const { devices } = this.state;
    console.log('devices', devices);
    return (
      <div className="modal-wrap migaration-modal" tabIndex={1}>
        <Flexbox direction="column">
          <h4 style={{ color: '#434648' }}>Run-time State Migration</h4>
          {/* <p>Migration Method: {this.state.method}</p> */}
          {/* <p>Migration Model: {this.state.model}</p> */}
          <p>You are migrating the data of <b>{model}</b> {method == 'pull' ? 'from' : 'to'} a device.</p>
          <div style={{ color: 'rgba(35, 31, 32, 0.5)', fontSize: '12px' }}>Please select a device</div>
          <ScrollRegion style={{ margin: '0 30px', height: '100px' }}>
            <Flexbox
              direction="row"
              height="auto"
              style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}
            >
              {devices.map((d, i) =>
                <div className="item" key={d['_id']}>
                  <input onChange={this._onDeviceChange} checked={this.state.device == d['_id']} id={d['_id']} type="radio" value={d['_id']} name="devices" />
                  <label htmlFor={d['_id']} >{d['name']}</label>
                </div>
              )}
            </Flexbox>
          </ScrollRegion>

          <div className="button-wrapper">
            <button onClick={this._onMigrate} className="btn">Migrate</button>
          </div>
        </Flexbox>
      </div >
    );
  }
}

