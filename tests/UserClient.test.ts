import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { UserClient } from '../src/UserClient/UserClient';

let userClient: UserClient;

let panelIp: string;

import { config } from 'dotenv';
config({ path: './tests/test.env' });

beforeAll(async () => {
  if (!process.env.VM_IP) throw new Error('No panel ip provided');
  panelIp = process.env.VM_IP ?? '';

  userClient = new UserClient({
    panel: 'http://' + panelIp,
    apikey: process.env.USER_API_KEY ?? '',
  });
});

describe('Test the UserClient', () => {
  test('test', () => {
    expect(1).toBe(1);
  });
});

afterAll(async () => {
  console.log('Done');
}, 2 * 60 * 1000);
