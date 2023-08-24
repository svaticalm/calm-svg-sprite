const { parse } = require('svgson')
const { renderToStaticMarkup } = require('react-dom/server')
const { createElement: e } = require('react')
const Element = require('./createElement')
const { optimize: optimizeSVG } = require('svgo');

const svgoDefaultConfig = {
    plugins: [
    // enable built-in plugins by name
        'prefixIds',
        { name: 'removeStyleElement', active: true },
        { name: 'removeScriptElement', active: true },
        { name: 'removeViewBox', active: false },
        { name: 'removeTitle', active: false },
        {
            name: 'removeAttrs',
            params: {
                attrs: [
                    '(stroke|fill|opacity|width|height)',
                    '(class|style)',
                    'xlink:href',
                    'aria-labelledby',
                    'aria-describedby',
                    'xmlns:xlink',
                    'data-name',
                ],
                
            },
        },
        {
            name: 'addAttributesToSVGElement',
            params: {
                attributes: [
                    {
                        fill: 'currentColor',
                        width: '100%',
                        height: '100%',
                    },
                ],
            },
        },
    ],
    multipass: true,
}

const replaceTag = (icon) => ({ ...icon, name: 'symbol' })
const createIcon = (obj, key) => e(Element, { obj, key })
const createSprite = (icons) => {
  return e('svg', { width: 0, height: 0, className: 'hidden' }, icons)
}

const markup = (elem) => renderToStaticMarkup(elem)

const generateSprite = (result) => {
  const multiResult = Array.isArray(result)
  const icons = multiResult
    ? result.map(replaceTag).map(createIcon)
    : createIcon(replaceTag(result))
  const sprite = createSprite(icons)
  const spriteOutput = markup(sprite)
  const spriteDefs = spriteOutput
  return {
    defs: spriteDefs
  }
}

module.exports = async (
  input,
  {
    optimize = true,
    svgoConfig = svgoDefaultConfig,
    processId = (n) => `Icon_${n}`
  } = {}
) => {
  let n = 0

  const transformNode = (node) => {
    if (Array.isArray(node)) {
      return node.map(transformNode)
    } else {
      if (node.name === 'svg') {
        const id = processId(n++)
        const { viewBox, width, height, ...extra } = node.attributes
        let defViewBox = viewBox || `0 0 ${width} ${height}`
        return {
          ...node,
          attributes: {
            ...extra,
            viewBox: defViewBox,
            id,
          },
          'data-iconid': id,
        }
      }
      return node
    }
  }

  let icons = []
  let optimized = []
  if (optimize) {
    try {
      for (const icon of input) {
        const iconOpt = optimizeSVG(icon, svgoConfig)
        optimized.push(iconOpt.data)
      }
      icons = optimized
    } catch (err) {
      // console.log({ err })
    }
  } else {
    icons = input
  }

  icons = icons.join(' ')

  const processed = await parse(icons, { transformNode, camelcase: true })

  return generateSprite(processed)
}