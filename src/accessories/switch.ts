import { CharacteristicValue, Service } from 'homebridge';
import { SmartRentPlatform } from '../platform.js';
import type { SmartRentAccessory } from './index.js';
import { SwitchData } from '../devices/index.js';
import { WSEvent } from '../lib/client.js';
import { findBoolean, attrToBoolean } from '../lib/utils.js';
import { ATTR } from '../lib/attributes.js';
import { BaseAccessory } from './base.js';

export class SwitchAccessory extends BaseAccessory {
  private readonly service: Service;
  private currentOn: boolean = false;

  constructor(platform: SmartRentPlatform, accessory: SmartRentAccessory) {
    super(platform, accessory, 'switches');

    const C = this.platform.api.hap.Characteristic;
    this.service =
      this.accessory.getService(this.platform.api.hap.Service.Switch) ||
      this.accessory.addService(this.platform.api.hap.Service.Switch);

    this.service.setCharacteristic(C.Name, accessory.context.device.name);

    this.service
      .getCharacteristic(C.On)
      .onGet(this.handleOnGet.bind(this))
      .onSet(this.handleOnSet.bind(this));

    this.startPolling();
  }

  async handleOnGet(): Promise<CharacteristicValue> {
    return this.hapCall('GET On', async () => {
      const attrs = await this.platform.smartRentApi.getState<SwitchData>(
        this.hubId,
        this.deviceId
      );
      this.currentOn = findBoolean(attrs, ATTR.ON);
      return this.currentOn;
    });
  }

  async handleOnSet(value: CharacteristicValue) {
    return this.hapCall('SET On', async () => {
      const desired = !!value;
      await this.platform.smartRentApi.setState<SwitchData>(
        this.hubId,
        this.deviceId,
        [{ name: ATTR.ON, state: desired }]
      );
      this.currentOn = desired;
    });
  }

  protected handleWsEvent(event: WSEvent) {
    if (event.name !== ATTR.ON) {
      return;
    }
    const next = attrToBoolean(event.last_read_state);
    const C = this.platform.api.hap.Characteristic;
    if (this.updateIfChanged(this.service, C.On, next, this.currentOn)) {
      this.currentOn = next;
    }
  }

  protected async pollState() {
    const attrs = await this.platform.smartRentApi.getState<SwitchData>(
      this.hubId,
      this.deviceId
    );
    const next = findBoolean(attrs, ATTR.ON);
    const C = this.platform.api.hap.Characteristic;
    if (this.updateIfChanged(this.service, C.On, next, this.currentOn)) {
      this.log.info(
        `[${this.accessory.displayName}] poll: switch → ${next ? 'ON' : 'OFF'}`
      );
      this.currentOn = next;
    }
  }
}
