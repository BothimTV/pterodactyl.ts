const { readFileSync, writeFileSync } = require('fs')

const data = JSON.parse(readFileSync('./package.json', 'utf8'))

data.name = "@bothimtv/pterodactyl.ts"

writeFileSync("./package.json", JSON.stringify(data, null, 2), "utf8")