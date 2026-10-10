let map, texture, c

const rules = {
  "1":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},
  "2":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},
  "3":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},
  "4":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},
  "5":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},
  "6":{"1":[1,2,3,4,7,8,15,19],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[5,9,10,13,17,22]},
  "7":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},
  "8":{"1":[5,12,16,20,22],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[1,2,3,4,6,7,14,18]},
  "9":{"1":[5,12,16,20,22],"2":[14,18,23,24],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},
  "10":{"1":[6,11,14,18,21],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]},
  "11":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},
  "12":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[8,11,15,19,21]},
  "13":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},
  "14":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},
  "15":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},
  "16":{"1":[5,12,16,20,22],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},
  "17":{"1":[1,2,3,4,7,8,15,19],"2":[6,9,13,17,21],"3":[11,12,15,19,23,24],"4":[5,10,13,17,22]},
  "18":{"1":[6,11,14,18,21],"2":[1,2,3,4,5,8,16,20],"3":[7,10,14,18,22],"4":[9,12,16,20,23,24]},
  "19":{"1":[9,10,13,17,23,24],"2":[7,12,15,19,22],"3":[1,2,3,4,5,6,13,17],"4":[8,11,15,19,21]},
  "20":{"1":[5,12,16,20,22],"2":[10,11,14,18,23,24],"3":[8,9,16,20,21],"4":[1,2,3,4,6,7,14,18]},
  "21":{"1":[5,12,16,20,22],"2":[7,12,15,19,22],"3":[7,10,14,18,22],"4":[5,10,13,17,22]},
  "22":{"1":[6,11,14,18,21],"2":[6,9,13,17,21],"3":[8,9,16,20,21],"4":[8,11,15,19,21]},
  "23":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]},
  "24":{"1":[9,10,13,17,23,24],"2":[10,11,14,18,23,24],"3":[11,12,15,19,23,24],"4":[9,12,16,20,23,24]}
}

const directions = [[0, -1, 1], [1, 0, 2], [0, 1, 3], [-1, 0, 4]]

function propagate(options, stack) {
  while (stack.length) {
    const [y, x] = stack.pop()
    for (const [dx, dy, dir] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= map.intW || ny >= map.intH)
        continue
      const allowed = new Set(options[y][x].flatMap(t => rules[t][dir]))
      const remaining = options[ny][nx].filter(t => allowed.has(t))
      if (!remaining.length)
        return false
      if (remaining.length < options[ny][nx].length) {
        options[ny][nx] = remaining
        stack.push([ny, nx])
      }
    }
  }
  return true
}

function getLowestEntropy(options) {
  let lowEntropy = Infinity
  let smallest = null
  for (let i = 0; i < map.intH; i++) {
    for (let j = 0; j < map.intW; j++) {
      if (options[i][j].length > 1 && options[i][j].length < lowEntropy) {
        lowEntropy = options[i][j].length
        smallest = [i, j]
      }
    }
  }
  return smallest
}

function tryFillMap() {
  const tiles = Object.keys(rules).map(v => parseInt(v))
  const options = Array(map.intH).fill().map(_ => Array(map.intW).fill(tiles))
  let pos
  while ((pos = getLowestEntropy(options))) {
    const [posY, posX] = pos
    const choices = options[posY][posX]
    options[posY][posX] = [choices[Math.floor(Math.random() * choices.length)]]
    if (!propagate(options, [pos]))
      return false
  }
  for (let i = 0; i < map.intH; i++)
    for (let j = 0; j < map.intW; j++)
      map.layers[0][i][j] = options[i][j][0]
  return true
}

function fillMap(maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++)
    if (tryFillMap())
      return
  throw new Error(`Could not fill the map after ${maxAttempts} attempts, check the rules`)
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
  fillMap()
  convertMap()
  texture = new Texture('img/grass_and_water.png', 'grass_and_water.png', 64, 64, 0, 64, 32, 32, 1)
  texture.load(() => showMap(c))
}

init()

