![Known Vulnerabilities](https://snyk.io/test/github/BothimTV/PterodactykAPI/badge.svg)
[![Build Status](https://github.com/BothimTV/PterodactylAPI/actions/workflows/build.yml/badge.svg)](https://github.com/BothimTV/PterodactylAPI/actions/workflows/build.yml)
[![Publish Package to npm and github](https://github.com/BothimTV/PterodactylAPI/actions/workflows/publish.yml/badge.svg)](https://github.com/BothimTV/PterodactylAPI/actions/workflows/publish.yml)
[![Jest Tests](https://github.com/BothimTV/pterodactyl.ts/actions/workflows/test.yml/badge.svg)](https://github.com/BothimTV/pterodactyl.ts/actions/workflows/test.yml)

# Pterodactyl.ts

This is a easy to use typescript based api wrapper for the pterodactyl api.

# Quick start

## ApplicationClient

With the ApplicationClient you can manage servers, nodes, users, and more.  
This requires an panel api key with the specific permissions.

```ts
import { ApplicationClient } from 'pterodactyl.ts';
const applicationClient = new ApplicationClient({
  apikey: process.env.PTERODACTYL_API_KEY,
  panel: process.env.PTERODACTYL_PANEL,
});
```

### Create a new user

```ts
const newUser = new UserBuilder()
  .setEmail('mail@example.de')
  .setFirstName('Max')
  .setLastName('Mustermann')
  .setUsername('exampleGamer420')
  .setPassword(process.env.MAX_PASSWORD);

await applicationClient.createUser(newUser);
```

### Create a new server

```ts
const newServer = new ServerBuilder()
  .setName('Hello world!')
  .setDescription('This is my fancy game server')
  .setOwnerId(1) // The user id for the owner
  .setAllocationId(1) // The allocation id for the server
  .setLimits({
    memory: 512,
    swap: 0,
    disk: 5120,
    io: 500,
    cpu: 100,
    threads: undefined,
  })
  .setFeatureLimits({
    databases: 1,
    backups: 5,
    allocations: 2,
  });
// TODO Env setup (variables, egg, etc.)

await applicationClient.createServer(newServer).then((server) => {
  console.log('The server is currently ' + server.status);
});
```

### Create new allocations

```ts
const newAllocation = new AllocationBuilder()
  .setIp('1.2.3.4')
  .setAlias('example.com')
  .addPort(25565)
  .addPort('3000-3005')
  .addPorts([25566, 25567]);

await applicationClient.getNode(0).then((node) => {
  node.createAllocation(newAllocation);
});
```

[Documentation](https://pterots.bothimtv.com/classes/ApplicationClient.html)

## UserClient

With the ApplicationClient you can manage servers, subusers, backups, files and more.  
This is from user perspective and you’ll need an api key from your user settings.

> [!WARNING]  
> Your hosting provider may have limits on your requests, please make sure you don’t spam a panel!  
> Abusing your hosting providers panel may result in suspension or ip bans!

```ts
import { UserClient } from 'pterodactyl.ts';
const userClient = new UserClient({
  apikey: process.env.PTERODACTYL_API_KEY,
  panel: process.env.PTERODACTYL_PANEL,
});
```

### Establish a server console connection

```ts
// Get a specific server from your account
import { SocketEvent } from 'pterodactyl.ts';
const server = await userClient.getServer('someId');

/**
 * Console connection
 */
// The authentication is done automatically
const socket = await server.getConsoleSocket();
await socket.connect(true);

// Get the logs, when the server is offline you'll receive a generated log message
const logs = await socket.getLogs();

// Get live console logging
socket.on(SocketEvent.CONSOLE_OUTPUT, (log) => {
  console.log(log);
});

socket.disconnect();
```

### Upload, read, download, compress a file on a server

```ts
import fs from 'fs';

const server = await userClient.getServer('someId');

// Accepts a filepath, buffer or blob
await server.uploadFile('/', 'hello.world', 'hello.world');

server.getFiles('/').then((files) => {
  console.log('Files in "/"": ' + files.map((file) => file.name).join(', '));

  const helloWorldFile = files.find((file) => file.name === 'hello.world');
  if (!helloWorldFile) {
    console.error('File not found');
    return;
  }

  helloWorldFile.getContent().then((contents) => {
    console.log('Contents of hello.world: ' + contents);
  });

  helloWorldFile.downloadUrl().then((url) => {
    console.log('You can download hello.world via: ' + url);
  });

  helloWorldFile.compress().then(async (archive) => {
    console.log('Compressed hello.world');
    await archive.downloadStream().then((stream) => {
      stream.pipe(fs.createWriteStream('hello.world.tar.gz'));
    });
    archive.delete();
  });
});
```

### Create a server backup

```ts
const newBackup = new BackupBuilder()
  .setName('Backup of server')
  .setLocked(true)
  .setIgnored(['logs', 'cache']);

server.createBackup(newBackup);
```

### Manage server subusers

```ts
import { USER_PERMISSION } from 'pterodactyl.ts';

const newSubUser = new SubUserBuilder()
  .setEmail('mail@example.de')
  .setPermissions([USER_PERMISSION.ACTIVITY_READ, USER_PERMISSION.CONTROL_RESTART])
  .addPermission(USER_PERMISSION.CONTROL_CONSOLE);

await server.createSubuser(newSubUser).then(async (subUser) => {
  await subUser.updatePermissions([USER_PERMISSION.CONTROL_START, USER_PERMISSION.CONTROL_STOP]);
  console.log('The user has ' + subUser.permissions.length + ' permissions');
  await subUser.delete();
});
```

### Create a server schedule with tasks

```ts
const newTask = new ScheduleTaskBuilder()
  .setAction('backup')
  .setContinueOnFailure(true)
  .setPayload('cache, logs'); // For backups the payload are the ignored files

const newTask2 = new ScheduleTaskBuilder()
  .setAction('command')
  .setPayload('say Backup completed!'); // For commands the payload contains the command

const newTask3 = new ScheduleTaskBuilder()
  .setAction('power')
  .setPayload(SERVER_SIGNAL.RESTART); // For power actions the payload contains the server signal

const newSchedule = new ScheduleBuilder()
  .setActive(true)
  .setName('Daily Backup')
  .setMinute('0')
  .setHour('0')
  .setMonth('*')
  .setDayOfMonth('*')
  .setDayOfWeek('*')
  .setOnlyWhenOnline(false);

server.createSchedule(newSchedule).then(async (schedule) => {
  await schedule.createTask(newTask);
  await schedule.createTask(newTask2);
  await schedule.createTask(newTask3);
});
```

[Documentation](https://pterots.bothimtv.com/classes/UserClient.html)

## Disclaimer

Use is at own risk!  
You can easily delete everything - be cautious!
