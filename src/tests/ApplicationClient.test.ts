import { afterAll, beforeAll, describe, test } from "@jest/globals";
import { ApplicationClient } from "../classes/application/ApplicationClient";
import { PanelNodeBuilder } from "../classes/builder/PanelNodeBuilder";
import { PanelUserBuilder } from "../classes/builder/PanelUserBuilder";

const client = new ApplicationClient({
    apikey: process.env.API_KEY || "",
    panel: process.env.PANEL || ""
});

describe("Test the Application API", () => {
  var testUserId: number
  var testNodeId: number
  beforeAll(async () => {
    testUserId = await client.createUser(
      new PanelUserBuilder()
        .setEmail("test@test.de")
        .setUsername("test")
        .setFirstName("test")
        .setLastName("test")
        .setPassword("test")
    ).then((user) => {
      return user.id
    }).catch((e) => {return 200})
    testNodeId = await client.createNode(
      new PanelNodeBuilder()
        .setName("Test Node")
        .setLocationId(1)
        .setFqdn("test.de")
        .setMemory(1024)
        .setDisk(1024)
    ).then((node) => {
      return node.id
    })
  })
  test("Try getting users", async () => {
    // file deepcode ignore PromiseNotCaughtGeneral/test: These are the test, its "good" if they can fail

    await client.getUser(testUserId).then(async (user) => {
      console.log(user)
    });

    await client.getNode(testNodeId).then(async (node) => {
      console.log(node)
    })

    

    /*await client.getUsers().then((users) => {
      console.log(users);
    });
    await client.getLocations().then((locations) => {
      console.log(locations);
    });
    await client.getNodes().then((nodes) => {
      console.log(nodes);
    });
    await client.getServers().then((servers) => {
      console.log(servers);
    });*/
  })

  afterAll(async () => {
    await (await client.getUser(testUserId)).delete()
    await (await client.getNode(testNodeId)).delete()
  })
});
