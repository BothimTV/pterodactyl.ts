const { readdirSync, writeFileSync } = require("fs")

const classFolders = ["ApplicationClient", "UserClient", "builder"]
const additionalExports = ["export * from \"./functions/util\";", "export { SocketEvent, PowerState, StatsWsJson, BackupCompletedJson } from \"./types/user/consoleSocket\";"]

const res = ["/* Auto generated */"]

for (const folder of classFolders) {
    res.push(`\n/* ${folder} */`)
    const files = readdirSync(`./src/${folder}`)
        .filter(file => file.endsWith(".ts"))
    for (const file of files) {
        res.push(`export { ${file.split(".")[0]} } from "./${folder}/${file.split(".")[0]}";`)
    }
}

res.push(`\n/* types/base */`)
const files = readdirSync(`./src/types/base`)
    .filter(file => file.endsWith(".ts"))
for (const file of files) {
    res.push(`export * from "./types/base/${file.split(".")[0]}";`)
}

res.push("\n/* Additional */")
res.push(...additionalExports)

writeFileSync("./src/index.ts", res.join("\n"))
console.log(`Successfully created ${res.length} exports`)