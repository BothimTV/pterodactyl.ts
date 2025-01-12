import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { ApplicationClient } from '../src/ApplicationClient/ApplicationClient';
import { PanelLocation } from '../src/ApplicationClient/PanelLocation';
import { PanelNode } from '../src/ApplicationClient/PanelNode';
import { PanelUser } from '../src/ApplicationClient/PanelUser';
import { LocationBuilder } from '../src/builder/LocationBuilder';
import { UserBuilder } from '../src/builder/UserBuilder';
import { NodeBuilder } from '../src/builder/NodeBuilder';

import { config } from 'dotenv';
config({ path: './tests/test.env' });

let applicationClient: ApplicationClient;
let location: PanelLocation;
let node: PanelNode;

let panelIp: string;

beforeAll(
  async () => {
    if (!process.env.VM_IP) throw new Error('No panel ip provided');
    panelIp = process.env.VM_IP ?? '';

    applicationClient = new ApplicationClient({
      panel: 'http://' + panelIp,
      apikey: process.env.APPLICATION_API_KEY ?? '',
    });

    // Set the location ip in order to reach it as its default is localhost
    location = await applicationClient.getLocation(1);
    node = await applicationClient.getNode(1);
  },
  2 * 60 * 1000,
);

describe('Test Location management', () => {
  let location: PanelLocation;
  test('Create a location', async () => {
    const locationBuilder = new LocationBuilder()
      .setShort('ni.hnvr')
      .setDescription('Example Location located in Lower Saxony, Germany');
    location = await applicationClient.createLocation(locationBuilder);
    expect(location).toBeInstanceOf(PanelLocation);
    expect(location.short).toBe('ni.hnvr');
    expect(location.long).toBe('Example Location located in Lower Saxony, Germany');
  });

  test('Get a location', async () => {
    expect(location).toBeInstanceOf(PanelLocation);
    expect(location.short).toBe('ni.hnvr');
    expect(location.long).toBe('Example Location located in Lower Saxony, Germany');
  });

  test('Update a location', async () => {
    await location.setShort('ni.hnvr2');
    await location.setDescription('Example Location located in Lower Saxony, Germany 2');
    expect(location.short).toBe('ni.hnvr2');
    expect(location.long).toBe('Example Location located in Lower Saxony, Germany 2');
  });

  test('Delete a location', async () => {
    await location.delete();
    expect(async () => await applicationClient.getLocation(2)).rejects.toThrow();
  });
});

describe('Test user management', () => {
  let user: PanelUser;
  test('Create a user', async () => {
    const userBuilder = new UserBuilder()
      .setEmail('anotherUsr@example.de')
      .setFirstName('Another')
      .setLastName('User')
      .setUsername('anotherUsr')
      .setPassword('somePassword')
      .setAdmin(true);
    user = await applicationClient.createUser(userBuilder);
    expect(user).toBeInstanceOf(PanelUser);
    expect(user.email).toBe('anotherUsr@example.de');
    expect(user.first_name).toBe('Another');
    expect(user.last_name).toBe('User');
    expect(user.username).toBe('anotherusr');
    expect(user.root_admin).toBe(true);
  });

  test('Get a user', async () => {
    const getUsr = await applicationClient.getUser(user.id);
    expect(getUsr).toBeInstanceOf(PanelUser);
  });

  test('Update a user', async () => {
    await user.setEmail('anotherUsr2@example.de');
    await user.setFirstName('Another2');
    await user.setLastName('User2');
    await user.setUsername('anotherUsr2');
    await user.setPanelAdmin(false);
    expect(user.email).toBe('anotherUsr2@example.de');
    expect(user.first_name).toBe('Another2');
    expect(user.last_name).toBe('User2');
    expect(user.username).toBe('anotherusr2');
    expect(user.root_admin).toBe(false);
  });

  test('Delete a user', async () => {
    await user.delete();
    expect(async () => await applicationClient.getUser(user.id)).rejects.toThrow();
  });
});

describe('Test node management', () => {
  let node: PanelNode;
  test(
    'Create a node',
    async () => {
      const nodeBuilder = new NodeBuilder()
        .setName('Test')
        .setDescription('Test Node')
        .setBehindProxy(false)
        .setDaemonBase('/var/lib/pterodactyl/volumes')
        .setFqdn('https://daemon.example.com')
        .setDaemonPort(8080)
        .setDaemonSftp(2022)
        .setLocationId(1)
        .setPublic(true)
        .setScheme('https')
        .setMemory(1024)
        .setMemoryOverallocate(0)
        .setDisk(10240)
        .setDiskOverallocate(0);
      node = await applicationClient.createNode(nodeBuilder);
      expect(node).toBeInstanceOf(PanelNode);
      expect(node.name).toBe('Test');
      // expect(node.description).toBe('Test Node'); -> Bug: see issue #83
      expect(node.behind_proxy).toBe(false);
      expect(node.daemon_base).toBe('/var/lib/pterodactyl/volumes');
      expect(node.fqdn).toBe('https://daemon.example.com');
      expect(node.daemon_listen).toBe(8080);
      expect(node.daemon_sftp).toBe(2022);
      expect(node.location_id).toBe(1);
      expect(node.public).toBe(true);
      expect(node.scheme).toBe('https');
      expect(node.memory).toBe(1024);
      expect(node.memory_overallocate).toBe(0);
      expect(node.disk).toBe(10240);
      expect(node.disk_overallocate).toBe(0);
    },
    2 * 60 * 1000,
  );

  test(
    'Get a node',
    async () => {
      const getNode = await applicationClient.getNode(node.id);
      expect(getNode).toBeInstanceOf(PanelNode);
      expect(getNode.name).toBe('Test');
      expect(getNode.location_id).toBe(1);
    },
    2 * 60 * 1000,
  );

  // Cannot test update, as the panel is very likely to reject the request as it cannot deploy the configuration

  test(
    'Delete a node',
    async () => {
      await node.delete();
      expect(async () => await applicationClient.getNode(node.id)).rejects.toThrow();
    },
    2 * 60 * 1000,
  );
});
