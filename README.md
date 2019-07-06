# Soundboard 🔊

*Play your favorite sound bites from a familiar `sbzip` format.*

## Features 📣

- [x] Play sound bites from an uncompressed `.sbzip` folder
- [x] Hotkeys for each sound bite
- [ ] Load directly from `.sbzip` archive
- [ ] Load more than one soundboard archive at a time
- [ ] Remember last opened archives
- [ ] Edit & save sound bite mapping

## Install 🔔

Releases not yet available. See [Compiling](#Compiling).

Playing an existing soundboard currently requires uncompressing an archive manually to your user's Downloads folder.

```sh
unzip MySoundboard.sbzip
mv 0.soundboard/ ~/Downloads/
```

Resulting directory structure.

```
+ ~/Downloads/
+-+ 0.soundboard/
  +- Cache/
  | |- ..various..m4a
  +- Prerendered/
  | |- ..various..m4a
  |- Contents.xml
```

Then launch the app.

## Contribute 🙉

### Compiling

```bash
npm install
```

Both processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-dev
npm run start-main-dev
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
npm run start-dev
```

### Packaging
We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```

## License 📄

Forked from [Robinfr/electron-react-typescript](https://github.com/Robinfr/electron-react-typescript).

MIT © [Josh Carrier](https://github.com/joshjcarrier)
