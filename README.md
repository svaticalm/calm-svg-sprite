#CALM SVG SPRITE
Easily create optimized SVG sprites.

* Removes all styles and unnecessary attributes, optimizes, and adds the 'fill' property with the value 'currentColor' for more convenient further use.
* Creates a JavaScript file with an array containing the names of all icons, suitable for use in a UI kit.

## Install

```zsh
npm i -g calm-svg-sprite
```

## Usage
```zsh
calm-svg-sprite <source-files> <output-folder>
```

## Example

```zsh
calm-svg-sprite ./icons ./img
```
* Will automatically create files calm-sprite.svg and calmIcons.js in the /img folder.

## API

#### source-files

Default: `./`

#### output-folder

Default: `./`

