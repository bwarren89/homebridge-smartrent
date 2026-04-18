import { CharacteristicValue, Service } from 'homebridge';
import { SmartRentPlatform } from '../platform.js';
import type { SmartRentAccessory } from './index.js';
import { SwitchMultilevelData } from '../devices/index.js';
import { WSEvent } from '../lib/client.js';
import { findNumber, attrToBoolean, attrToNumber } from '../lib/utils.js';
import { ATTR } from '../lib/attributes.js';
import { BaseAccessory } from './base.js';

/**
 * Multilevel switch (dimmer) accessory.
 *
 * SmartRent represents these as having both an `on` boolean and a `level`
 * (0-100) integer. We expose both via HomeKit's Lightbulb service.
 */
export class SwitchMultilevelAccessory extends BaseAccessory {
  private readonly service: Service;
  private currentOn: boolean = false;
  private currentBrightness: number = 0;

  constructor(platform: SmartRentPlatform, accessory: SmartRentAccessory) {
    super(platform, accessory, 'switches');

    const C = this.platform.api.hap.Characteristic;
    this.service =
      this.accessory.getService(this.platform.api.hap.Service.Lightbulb) ||
      this.accessory.addService(this.platform.api.hap.Service.Lightbulb);

    this.service.setCharacteristic(C.Name, accessory.context.device.name);

    this.service
      .getCharacteristic(C.On)
      .onGet(this.handleOnGet.bind(this))
      .onSet(this.handleOnSet.bind(this));

    this.service
      .getCharacteristic(C.Brightness)
      .onGet(this.handleBrightnessGet.bind(this))
      .onSet(this.handleBrightnessSet.bind(this));

    this.startPolling();
  }

  private clampBrightness(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async handleOnGet(): Promise<CharacteristicValue> {
    return this.hapCall('GET On', async () => {
      const attrs =
        await this.platform.smartRentApi.getState<SwitchMultilevelData>(
          this.hubId,
          this.deviceId
        );
      const level = findNumber(attrs, ATTR.LEVEL);
      this.currentBrightness = this.clampBrightness(level);
      this.currentOn = level > 0;
      return this.currentOn;
    });
  }

  async handleOnSet(value: CharacteristicValue) {
    return this.hapCall('SET On', async () => {
      const desired = !!value;
      // Restore previous brightness when turning on (or 100 if it was 0).
      const targetLevel = desired
        ? this.currentBrightness > 0
          ? this.currentBrightness
          : 100
        : 0;
      await this.platform.smartRentApi.setState<SwitchMultilevelData>(
        this.hubId,
        this.deviceId,
        [{ name: ATTR.LEVEL, state: targetLevel }]
      );
      this.currentOn = desired;
      this.currentBrightness = targetLevel;
    });
  }

  async handleBrightnessGet(): Promise<CharacteristicValue> {
    return this.hapCall('GET Brightness', async () => {
      const attrs =
        await this.platform.smartRentApi.getState<SwitchMultilevelData>(
          this.hubId,
          this.deviceId
        );
      const level = this.clampBrightness(findNumber(attrs, ATTR.LEVEL));
      this.currentBrightness = level;
      this.currentOn = level > 0;
      return level;
    });
  }

  async handleBrightnessSet(value: CharacteristicValue) {
    return this.hapCall('SET Brightness', async () => {
      const level = this.clampBrightness(Number(value));
      await this.platform.smartRentApi.setState<SwitchMultilevelData>(
        this.hubId,
        this.deviceId,
        [{ name: ATTR.LEVEL, state: level }]
      );
      this.currentBrightness = level;
      this.currentOn = level > 0;
    });
  }

  /**
   * BUG FIX: previous implementation only handled the `on` event and
   * hardcoded `current = 0`, which silently turned every dimmer off in
   * HomeKit on every state change. Also never handled `level` events at
   * all, so brightness changes from outside HomeKit never propagated.
   */
  protected handleWsEvent(event: WSEvent) {
    const C = this.platform.api.hap.Characteristic;
    if (event.name === ATTR.ON) {
      const next = attrToBoolean(event.last_read_state);
      if (this.updateIfChanged(this.service, C.On, next, this.currentOn)) {
        this.currentOn = next;
      }
    } else if (event.name === ATTR.LEVEL) {
      const level = this.clampBrightness(attrToNumber(event.last_read_state));
      const isOn = level > 0;
      if (
        this.updateIfChanged(
          this.service,
          C.Brightness,
          level,
          this.currentBrightness
        )
      ) {
        this.currentBrightness = level;
      }
      if (this.updateIfChanged(this.service, C.On, isOn, this.currentOn)) {
        this.currentOn = isOn;
      }
    }
  }

  protected async pollState() {
    const attrs =
      await this.platform.smartRentApi.getState<SwitchMultilevelData>(
        this.hubId,
        this.deviceId
      );
    const level = this.clampBrightness(findNumber(attrs, ATTR.LEVEL));
    const isOn = level > 0;
    const C = this.platform.api.hap.Characteristic;
    if (
      this.updateIfChanged(
        this.service,
        C.Brightness,
        level,
        this.currentBrightness
      )
    ) {
      this.currentBrightness = level;
    }
    if (this.updateIfChanged(this.service, C.On, isOn, this.currentOn)) {
      this.log.info(
        `[${this.accessory.displayName}] poll: dimmer → ${isOn ? `ON @ ${level}%` : 'OFF'}`
      );
      this.currentOn = isOn;
    }
  }
}
