import { PlatformConfig } from 'homebridge';

export interface SmartRentPlatformConfig extends PlatformConfig {
  platform: 'SmartRent';
  unitName?: string;
  email: string;
  password: string;
  tfaCode?: string;
  enableLeakSensors?: boolean;
  enableLocks?: boolean;
  enableSwitches?: boolean;
  enableThermostats?: boolean;
  enableSwitchMultiLevels?: boolean;
}
