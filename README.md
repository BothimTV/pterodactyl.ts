![Known Vulnerabilities](https://snyk.io/test/github/BothimTV/PterodactykAPI/badge.svg)
[![Build Status](https://github.com/BothimTV/PterodactylAPI/actions/workflows/build.yml/badge.svg)](https://github.com/BothimTV/PterodactylAPI/actions/workflows/main.yml)

# Pterodactyl.ts
This is a easy to use typescript based api wrapper for the pterodactyl api.

# Quick start
Most functions are tested, if something doesn't work please open an issue on github.

## ApplicationClient
With the ApplicationClient you can manage servers, nodes, users, and more.
```ts
import { ApplicationClient } from "pterodactyl.ts"
const applicationClient = new ApplicationClient({
    apikey: "",
    panel: ""
})
```
[Documentation](https://pterots.bothimtv.com/classes/ApplicationClient.html)

## UserClient
With the ApplicationClient you can manage servers, subusers, backups, files and more.
```ts
import { UserClient } from "pterodactyl.ts"
const userClient = new UserClient({
    apikey: "",
    panel: ""
})
```
```ts
// Get a specific server from your account
const server = await userClient.getServer("someId")

/**
 * Console connection
 */ 
// The authentication is done automatically
const socket = await server.getConsoleSocket()
await socket.connect(true)

// Get the logs, when the server is offline you'll receive a generated log message 
const logs = await socket.getLogs()

// Get live console logging
socket.on("console_output", log => {
    console.log(log)
})

socket.disconnect()

/**
 * File management
 */
// Accepts a filepath, buffer or blob
await server.uploadFile("/", "hello.world", "hello.world")
```
[Documentation](https://pterots.bothimtv.com/classes/UserClient.html)

## Disclaimer
Use is at own risk!  
You can easily delete everything - be cautious!