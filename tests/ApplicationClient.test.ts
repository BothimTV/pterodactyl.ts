import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { StartedTestContainer } from "testcontainers";
import { AllocationBuilder, Egg, Nest, NodeAllocation, PanelUser, UserBuilder } from "../src";
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
  let panelNodes: Array<PanelNode>
  let panelUsers: Array<PanelUser>
  let panelLocations: Array<PanelLocation>
  let me: PanelUser
  test("Test initial data", async () => {
    panelNodes = await applicationClient.getNodes()
    panelUsers = await applicationClient.getUsers()
    panelLocations = await applicationClient.getLocations()

    let findMe = panelUsers.find(u => u.username == "admin") 
    if (!findMe) throw new Error("Admin user not found")
    me = findMe

    expect(panelNodes.length).toBe(1)
    expect(panelUsers.length).toBe(1)
    expect(panelLocations.length).toBe(1)
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

  let allocations: Array<NodeAllocation>
  test("Allocation create", async () => {
    await node.createAllocation(
      new AllocationBuilder()
        .addPort("25565-25566")
        .addPorts([25577, "25578-25579"])
        .setAlias("testNode.bothimtv.com")
        .setIp(node.fqdn)
    )
    allocations = await node.getAllocations()
    expect(allocations.length).toBe(5)
  })

  test("Allocation delete", async () => {
    await allocations[4]?.delete()
    expect((await node.getAllocations()).length).toBe(4)
  })

  let nests: Array<Nest>
  let minecraftEggs: Array<Egg>
  test("Get all nests", async () => {
    nests = await applicationClient.getNests()
    expect(nests.length).toBe(4)
  })

  test("Get all minecraft eggs", async () => {
    var mcNest = nests.find(n => n.name == "Minecraft")
    if (!mcNest) throw new Error("Minecraft nest not found")
    minecraftEggs = await applicationClient.getEggs(mcNest.id)
    expect(minecraftEggs.length).toBe(5)
  })

});

afterAll(async () => {
  await cleanup()
}, 2 * 60 * 1000)