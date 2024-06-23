import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { StartedTestContainer } from "testcontainers";
import { ApplicationClient, LocationBuilder, NodeBuilder, PanelLocation, PanelNode, UserClient } from "../dist";
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


});

afterAll(async () => {
  await cleanup()
}, 2 * 60 * 1000)