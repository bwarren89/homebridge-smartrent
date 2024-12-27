import { DeviceData } from './base';

export type ThermostatFanMode = 'auto' | 'on';
export type ThermostatMode = 'off' | 'cool' | 'heat' | 'auto';

export type ThermostatData = DeviceData<'thermostat', false>;
