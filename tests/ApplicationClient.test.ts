import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { ApplicationClient } from '../src/ApplicationClient/ApplicationClient';
import { Egg } from '../src/ApplicationClient/Egg';
import { Nest } from '../src/ApplicationClient/Nest';
import { NodeAllocation } from '../src/ApplicationClient/NodeAllocation';
import { PanelLocation } from '../src/ApplicationClient/PanelLocation';
import { PanelNode } from '../src/ApplicationClient/PanelNode';
import { PanelUser } from '../src/ApplicationClient/PanelUser';
import { UserClient } from '../src/UserClient/UserClient';
import { AllocationBuilder } from '../src/builder/AllocationBuilder';
import { LocationBuilder } from '../src/builder/LocationBuilder';
import { NodeBuilder } from '../src/builder/NodeBuilder';
import { UserBuilder } from '../src/builder/UserBuilder';

import { config } from 'dotenv';
config({ path: './tests/test.env' });

let applicationClient: ApplicationClient;
let location: PanelLocation;
let node: PanelNode;

let panelIp: string;

beforeAll(async () => {
  if (!process.env.VM_IP) throw new Error('No panel ip provided');
  panelIp = process.env.VM_IP ?? '';

  applicationClient = new ApplicationClient({
    panel: 'http://' + panelIp,
    apikey: process.env.APPLICATION_API_KEY ?? '',
  });

  // Set the location ip in order to reach it as its default is localhost
  location = await applicationClient.getLocation(1);
  node = await applicationClient.getNode(1);
}, 2 * 60 * 1000);

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
    location.setShort('ni.hnvr2');
    location.setDescription('Example Location located in Lower Saxony, Germany 2');
    expect(location.short).toBe('ni.hnvr2');
    expect(location.long).toBe('Example Location located in Lower Saxony, Germany 2');
  });

  test('Delete a location', async () => {
    await location.delete();
    expect(async () => await applicationClient.getLocation(2)).rejects.toThrow();
  });
});

afterAll(async () => {
  console.log('Done');
}, 2 * 60 * 1000);
