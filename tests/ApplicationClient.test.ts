import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { StartedTestContainer } from "testcontainers";
import { PanelUser, UserBuilder } from "../src";
import { ApplicationClient } from "../src/ApplicationClient/ApplicationClient";
import { PanelLocation } from "../src/ApplicationClient/PanelLocation";
import { PanelNode } from "../src/ApplicationClient/PanelNode";
import { UserClient } from "../src/UserClient/UserClient";
import { LocationBuilder } from "../src/builder/LocationBuilder";
import { NodeBuilder } from "../src/builder/NodeBuilder";
import { cleanup, getNetwork, getPanel, startWings } from "./containerProvider";

let applicationClient: ApplicationClient
let userClient: UserClient
let location: PanelLocation
let node: PanelNode

let panel: StartedTestContainer
let wings: StartedTestContainer

beforeAll(async () => {
  panel = await getPanel()
  console.log("Received panel")
  applicationClient = new ApplicationClient({
    panel: "http://localhost:" + panel.getMappedPort(80),
    apikey: "ptla_CiTiqLaesSlv6MwQq0ZgvmQAeopqTFBfgO7vKXuBIAv"
  })
  userClient = new UserClient({
    panel: "http://localhost:" + panel.getMappedPort(80),
    apikey: "ptlc_A06HxoSpOGMuEa7lYCZPezVXfWogd2YSn2CiEZwS2Id"
  })

  location = await applicationClient.createLocation(
    new LocationBuilder()
      .setShort("test")
      .setDescription("Test Location")
  )
  console.log("Created location: " + location.id)

  node = await applicationClient.createNode(
    new NodeBuilder()
      .setName("test")
      .setDescription("Test Node")
      .setLocationId(location.id)
      .setPublic(true)
      .setFqdn(panel.getIpAddress(getNetwork().getName()).split(".").map((v, i) => i === 3 ? 5 : v).join("."))
      .setScheme("http")
      .setDisk(1000)
      .setMemory(1000)
  )
  console.log("Created node: " + node.id)
  wings = await startWings(await node.getConfiguration())

}, 2 * 60 * 1000)

describe("Test the ApplicationClient", () => {
  test("Test initial data", async () => {
    const nodes = await applicationClient.getNodes()
    const users = await applicationClient.getUsers()
    const locations = await applicationClient.getLocations()

    expect(nodes.length).toBe(1)
    expect(users.length).toBe(1)
    expect(locations.length).toBe(1)
  })

  let testUser: PanelUser
  test("User creation", async () => {
    testUser = await applicationClient.createUser(
      new UserBuilder()
        .setAdmin(false)
        .setEmail("test@bothimtv.com")
        .setFirstName("test")
        .setLastName("test")
        .setPassword("test")
        .setUsername("test")
    )
    expect(testUser.root_admin).toBe(false)
    expect(testUser.email).toBe("test@bothimtv.com")
    expect(testUser.first_name).toBe("test")
    expect(testUser.last_name).toBe("test")
    expect(testUser.username).toBe("test")
  })

  test("User update", async () => {
    await testUser.setPanelAdmin(true)
    await testUser.setEmail("newTest@bothimtv.com")
    await testUser.setFirstName("newTest")
    await testUser.setLastName("newTest")
    await testUser.setUsername("newTest")
    await testUser.setPassword("newTest")

    expect(testUser.root_admin).toBe(true)
    expect(testUser.email).toBe("newTest@bothimtv.com")
    expect(testUser.first_name).toBe("newTest")
    expect(testUser.last_name).toBe("newTest")
    expect(testUser.username).toBe("newtest") // Usernames are stored lower case
  })

  test("User delete", async () => {
    await testUser.delete()
    const emptyList = await applicationClient.getUsers({ email: "newTest@bothimtv.com", username: "newTest", uuid: testUser.uuid })
    expect(emptyList.length).toBe(0)
  })
});

afterAll(async () => {
  await cleanup()
}, 2 * 60 * 1000)