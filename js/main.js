let map, texture, c

const rules = {"1":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},"2":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},"3":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},"4":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},"5":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},"6":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[5,9,10,13,17,22]},"7":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},"8":{"1":[5,12,16,20,22],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},"9":{"1":[5,12,16,20,22],"2":[14,18,23,24],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},"10":{"1":[6,11,14,18,21],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]},"11":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},"12":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[8,11,15,19,21]},"13":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},"14":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},"15":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},"16":{"1":[5,12,16,20,22],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},"17":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},"18":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},"19":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},"20":{"1":[5,12,16,20,22],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},"21":{"1":[5,12,16,20,22],"2":[7,12,15,19,22],"3":[7,10,14,18,22],"4":[5,10,13,17,22]},"22":{"1":[6,11,14,18,21],"2":[6,9,13,17,21],"3":[8,9,16,20,21],"4":[8,11,15,19,21]},"23":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]},"24":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]}}

function getTiles(x, y) {
  let tiles = Object.keys(rules).map(v => parseInt(v))
  if (x - 1 > -1 && map.layers[0][y][x - 1])
    tiles = tiles.filter(t => rules[map.layers[0][y][x - 1]][2].includes(t))
  if (x + 1 < map.intW && map.layers[0][y][x + 1])
    tiles = tiles.filter(t => rules[map.layers[0][y][x + 1]][4].includes(t))
  if (y - 1 > -1 && map.layers[0][y - 1][x])
    tiles = tiles.filter(t => rules[map.layers[0][y - 1][x]][3].includes(t))
  if (y + 1 < map.intH && map.layers[0][y + 1][x])
    tiles = tiles.filter(t => rules[map.layers[0][y + 1][x]][1].includes(t))
  return tiles
}

function hasEmptySpace() {
  for (let i = 0; i < map.intH; i++)
    for (let j = 0; j < map.intW; j++)
      if (map.layers[0][i][j] === 0)
        return true
  return false
}

function getTileLowEntropy(openPos) {
  let lowEntropy = Infinity
  let smallest = null
  for(let i = 0; i < openPos.length; i++) {
    const tiles = getTiles(openPos[i][1][0])
    if (tiles.length < lowEntropy) {
      lowEntropy = tiles.length
      smallest = i
    }
  }
  return smallest
}

function fillMap() {
  let tries = 0
  const openPos = []
  openPos.push([Math.floor(Math.random() * map.intH), Math.floor(Math.random() * map.intW)])
  while (openPos.length) {
    const low = getTileLowEntropy(openPos)
    const [posY, posX] = openPos.splice(low, 1)[0]
    const tiles = getTiles(posX, posY)
    map.layers[0][posY][posX] = tiles[Math.floor(Math.random() * tiles.length)]
    if (posX - 1 >= 0 && !map.layers[0][posY][posX - 1])
      openPos.push([posY, posX - 1])
    if (posX + 1 < map.intW && !map.layers[0][posY][posX + 1])
      openPos.push([posY, posX + 1])
    if (posY - 1 >= 0 && !map.layers[0][posY - 1][posX])
      openPos.push([posY - 1, posX])
    if (posY + 1 < map.intH && !map.layers[0][posY + 1][posX])
      openPos.push([posY + 1, posX])
    tries += 1
    if (tries > map.intW * map.intH * 100) {
      return false
    }
  }
  return true
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
  for (let i = 0; i < map.intH; i++) {
    for (let j = 0; j < map.intW; j++) {
      const index = map.layers[0][i][j] - 1
      map.layers[0][i][j] = [Math.floor(index / 4), index % 4]
    }
  }
}

function init() {
  map = new Map(10, 10, 64, 32, 1, 1, 0)
  map.grid = false
  while(!fillMap()){
    fillMap()
  }
  convertMap()
  texture = new Texture('img/grass_and_water.png', 'grass_and_water.png', 64, 64, 0, 64, 32, 32, 1)
  texture.load(() => showMap(c))
}

init()

