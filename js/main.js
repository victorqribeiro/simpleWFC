let map, texture, c

const rules = {
  '1': ['1', '2'],
  '2': ['2', '3', '1'],
  '3': ['3', '2']
}

function getRandomTile(x, y) {
  let tiles = Object.keys(rules)
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue
      if (x + j < 0 || x + j > map.intW - 1 || y + i < 0 || y + i > map.intH - 1) continue
      if (!map.layers[0][y + i][j + x]) continue
      tiles = tiles.filter(tile => rules[map.layers[0][y + i][j + x]].includes(tile))
    }
  }
  return tiles[Math.floor(Math.random() * tiles.length)]
}

function hasEmptySpace() {
  for (let i = 0; i < map.intH; i++)
    for (let j = 0; j < map.intW; j++)
      if (map.layers[0][i][j] === 0)
        return true
  return false
}

function fillMap() {
  while (hasEmptySpace()) {
    const posX = Math.floor(Math.random() * map.intW)
    const posY = Math.floor(Math.random() * map.intH)
    if (map.layers[0][posY][posX]) continue
    map.layers[0][posY][posX] = getRandomTile(posX, posY)
  }
}

function showMap() {
  const canvas = document.querySelector('canvas')
  canvas.width = map.intW * texture.tileWidth
  canvas.height = map.intH * texture.tileHeight + texture.bottomOffset
  canvas.imageSmoothingEnabled = false
  c = canvas.getContext('2d')
  map.show(c)
}

function convertMap() {
  for (let i = 0; i < map.intH; i++)
    for (let j = 0; j < map.intW; j++)
      map.layers[0][i][j] = [0, map.layers[0][i][j] - 1]
}

function init() {
  map = new Map(10, 10, 111, 66, 1, 1, 0)
  map.grid = false
  fillMap()
  convertMap()
  texture = new Texture('img/tiles.png', 'tiles.pgn', 111, 128, 0, 111, 66, 128 - 66, 1)
  texture.load(() => showMap(c))
}

init()

