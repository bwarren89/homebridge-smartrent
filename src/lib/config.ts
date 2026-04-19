import { Logger, PlatformConfig } from 'homebridge';

export interface SmartRentPlatformConfig extends PlatformConfig {
  platform: 'SmartRent';
  unitName?: string;
  email: string;
  password: string;
  tfaSecret?: string;

  // Device toggles
  enableLeakSensors?: boolean;
  enableLocks?: boolean;
  enableSwitches?: boolean;
  enableThermostats?: boolean;
  enableSwitchMultiLevels?: boolean;
  enableContactSensors?: boolean;
  enableMotionSensors?: boolean;

  // Lock behavior
  enableAutoLock?: boolean;
  autoLockDelayInMinutes?: number;

  // Sensor behavior
  /**
   * Some SmartRent contact sensors report `true` for "open" instead of
   * "closed". Set this to `true` to invert the polarity for all contact
   * sensors. Defaults to `false`.
   */
  contactInverted?: boolean;

  // Tuning
  /** TTL for the per-device attribute cache. Default 5 seconds. */
  cacheTtlSeconds?: number;
  /** Fallback polling interval in seconds. Default 30. Set to 0 to disable. */
  pollingIntervalSeconds?: number;
  /** Per-device-type polling overrides (in seconds). */
  pollingOverrides?: {
    locks?: number;
    thermostats?: number;
    switches?: number;
    sensors?: number;
  };
  /** Display thermostat temperature in Celsius instead of Fahrenheit. */
  useCelsiusDisplay?: boolean;
}

/**
 * Validate config and log a clear error for each missing/invalid field.
 * Returns true if the config is usable.
 */
export function validateConfig(
  config: Partial<SmartRentPlatformConfig>,
  log: Logger
): config is SmartRentPlatformConfig {
  let ok = true;

  if (!config.email || typeof config.email !== 'string') {
    log.error('Config error: "email" is required.');
    ok = false;
  }
  if (!config.password || typeof config.password !== 'string') {
    log.error('Config error: "password" is required.');
    ok = false;
  }
  if (
    config.tfaSecret !== undefined &&
    (typeof config.tfaSecret !== 'string' || config.tfaSecret.length === 0)
  ) {
    log.error('Config error: "tfaSecret" must be a non-empty string if set.');
    ok = false;
  }
  if (
    config.autoLockDelayInMinutes !== undefined &&
    (typeof config.autoLockDelayInMinutes !== 'number' ||
      config.autoLockDelayInMinutes <= 0)
  ) {
    log.error(
      'Config error: "autoLockDelayInMinutes" must be a positive number.'
    );
    ok = false;
  }
  if (
    config.cacheTtlSeconds !== undefined &&
    (typeof config.cacheTtlSeconds !== 'number' || config.cacheTtlSeconds < 0)
  ) {
    log.error('Config error: "cacheTtlSeconds" must be a non-negative number.');
    ok = false;
  }
  if (
    config.pollingIntervalSeconds !== undefined &&
    (typeof config.pollingIntervalSeconds !== 'number' ||
      config.pollingIntervalSeconds < 0)
  ) {
    log.error(
      'Config error: "pollingIntervalSeconds" must be a non-negative number.'
    );
    ok = false;
  }
  if (
    config.contactInverted !== undefined &&
    typeof config.contactInverted !== 'boolean'
  ) {
    log.error('Config error: "contactInverted" must be a boolean.');
    ok = false;
  }

  return ok;
}
