<span align="center">

<h1>
  Homebridge SmartRent
  <br />
  <small>@prismwizard/homebridge-smartrent</small>
</h1>

[![npm version](https://badgen.net/npm/v/@prismwizard/homebridge-smartrent?color=purple&icon=npm&label)](https://www.npmjs.com/package/@prismwizard/homebridge-smartrent)
[![npm downloads](https://badgen.net/npm/dw/@prismwizard/homebridge-smartrent?color=purple&icon=npm&label)](https://www.npmjs.com/package/@prismwizard/homebridge-smartrent)

Fork of [homebridge-smartrent](https://github.com/jabrown93/homebridge-smartrent) with broadened Node.js version support (>=20).

Unofficial [Homebridge](https://homebridge.io) plugin for [SmartRent](https://smartrent.com), allowing you to control your SmartRent devices with [Apple Home](https://www.apple.com/ios/home/).

</span>

## Changes from upstream

- **Broadened Node.js support**: Works with Node.js 20, 22, and 24+ (upstream required Node 24 only)
- **Removed automated release pipeline**: Manual `npm publish` for simplicity
- **Republished under `@prismwizard` scope**

## 🔄 Supported Devices

Homebridge SmartRent currently supports these devices through a SmartRent hub:

- 🔒 Locks
- 💧 Leak sensors
- 🔌 Switches
- 🌡 Thermostats
- 🎚 Multilevel (Dimmer) Switches

## ✅ Usage

### Installation

[Install Homebridge](https://github.com/homebridge/homebridge/wiki), add it to [Apple Home](https://github.com/homebridge/homebridge/blob/main/README.md#adding-homebridge-to-ios), then install and configure this plugin.

#### Via Homebridge UI

1. Open the [Homebridge UI](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-macOS#complete-login-to-the-homebridge-ui).
2. Open the Plugins tab, search for `@prismwizard/homebridge-smartrent`, and install the plugin.
3. Log in to SmartRent through the settings panel.

#### Manual

1. Install the plugin using NPM:

   ```sh
   npm i -g @prismwizard/homebridge-smartrent
   ```

2. Configure the SmartRent platform in `~/.homebridge/config.json` as shown in [`config.example.json`](./config.example.json).

3. Start Homebridge:

   ```sh
   homebridge -D
   ```

## Configuration

All configuration values are strings.

| Property    | Description                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `email`     | SmartRent account email                                                                                                              |
| `password`  | SmartRent account password                                                                                                           |
| `tfaSecret` | If you have enabled two-factor authentication on your SmartRent account, enter the secret used to seed the 2FA token                 |
| `unitName`  | Only necessary if you have multiple units in your SmartRent account. Get the name from the top of the More tab in the SmartRent app. |

## 🛠 Development

### Setup Development Environment

You need Node.js 20 or later and a modern code editor such as [VS Code](https://code.visualstudio.com/).

### Install Development Dependencies

```sh
npm install
```

### Build Plugin

```sh
npm run build
```

### Link To Homebridge

```sh
npm link
homebridge -D
```

## License

[GNU GENERAL PUBLIC LICENSE, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Disclaimer

This project is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by SmartRent Technologies, Inc or Apple Inc. All product and company names are the registered trademarks of their original owners. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder of their product brand.

## Upstream

Forked from [jabrown93/homebridge-smartrent](https://github.com/jabrown93/homebridge-smartrent).
