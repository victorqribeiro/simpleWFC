let map, c

const rules = {}

for (let i = 0; i < 24; i++) {
  rules[i + 1] = {}
  for (let j = 0; j < 4; j++) {
    rules[i + 1][j + 1] = []
  }
}

function showMap() {
  const canvas = document.querySelector('canvas')
  canvas.width = map.intW * texture.tileWidth
  canvas.height = map.intH * texture.tileHeight + texture.bottomOffset
  c = canvas.getContext('2d')
  map.show(c)
}

function init() {
  map = new Map(3, 3, 64, 32, 1, 1, 0)
  map.grid = true
  texture = new Texture('img/grass_and_water.png', 'grass_and_water.png', 64, 64, 0, 64, 32, 16, 1)
  texture.load(() => showMap(c))
}

init()

let current_tile = 0

let current_looking = 0

let index = 0

function next() {
  const x = current_tile % 4
  const y = Math.floor(current_tile / 4)

  const x1 = index % 4
  const y1 = Math.floor(index / 4)

  map.layers[0][1][1] = [y, x]
  
  if (current_looking == 0) {
    map.layers[0][0][1] = [y1, x1]
  } else if (current_looking == 1) {
    map.layers[0][1][2] = [y1, x1]
  } else if (current_looking == 2) {
    map.layers[0][2][1] = [y1, x1]
  } else if (current_looking == 3) {
    map.layers[0][1][0] = [y1, x1]
  }
  
  map.show(c)
  
  index += 1
  
  if (index == 24) {
    current_looking += 1
    index = 0
    map.layers[0][0][1] = 0
    map.layers[0][1][2] = 0
    map.layers[0][2][1] = 0
    map.layers[0][1][0] = 0
  }
  
  if (current_looking == 4) {
    current_tile += 1
    current_looking = 0
  }
}

function saveTile() {
  rules[current_tile + 1][current_looking + 1].push(index + 1)
  next()
}

function save() {
  const URL = window.URL || window.webkitURL
  const blob = new Blob([JSON.stringify(rules)], {type: 'text/json'})
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'rules.json'
  link.click()
}
