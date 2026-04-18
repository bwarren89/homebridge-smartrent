/**
 * Centralized SmartRent device attribute names.
 *
 * SmartRent's API uses these short string keys to identify device attributes
 * in both REST responses and WebSocket events. Centralizing them avoids typos
 * and makes it easy to discover what each device exposes.
 */
export const ATTR = {
  // Lock
  LOCKED: 'locked',

  // Switch / dimmer
  ON: 'on',
  LEVEL: 'level',

  // Leak / contact / motion / tamper
  LEAK: 'leak',
  CONTACT: 'contact',
  MOTION: 'motion',
  TAMPER: 'tamper',

  // Thermostat
  MODE: 'mode',
  FAN_MODE: 'fan_mode',
  CURRENT_TEMP: 'current_temp',
  CURRENT_HUMIDITY: 'current_humidity',
  COOL_SETPOINT: 'cool_target_temp',
  HEAT_SETPOINT: 'heat_target_temp',

  // Battery / health
  BATTERY_LEVEL: 'battery_level',
  LOW_BATTERY: 'low_battery',

  // Misc
  NOTIFICATIONS: 'notifications',
} as const;

export type AttrName = (typeof ATTR)[keyof typeof ATTR];
