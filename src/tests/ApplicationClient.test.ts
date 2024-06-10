import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { ApplicationClient } from "../classes/application/ApplicationClient";
import { NodeAllocationBuilder } from "../classes/builder/NodeAllocationBuilder";
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
    }).catch((e) => { return 200 })
    testNodeId = await client.createNode(
      new PanelNodeBuilder()
        .setName("Test Node")
        .setLocationId(1)
        .setFqdn("test.de")
        .setMemory(1024)
        .setDisk(1024)
    ).then(async (node) => {
      await node.createAllocation(
        new NodeAllocationBuilder()
          .setIp("0.0.0.0")
          .setAlias("test-node.test.de")
          .addPort(25565)
          .addPorts([25566, 25567])
      )
      return node.id
    })
  })
  test("Try getting & managing users", async () => {
    // file deepcode ignore PromiseNotCaughtGeneral/test: These are the test, its "good" if they can fail

    await client.getUser(testUserId).then(async (user) => {
      console.log(user)
      const oldUsrData = await client.getUser(testUserId);
      await user.setEmail("test2@test.de").then(() => { })
      expect(user.email).toBe("test2@test.de");
      expect(oldUsrData.email).not.toBe("test2@test.de");

      await user.setUsername("test2")
      expect(user.username).toBe("test2");
      expect(oldUsrData.username).not.toBe("test2");

      await user.setFirstName("test2")
      expect(user.first_name).toBe("test2");
      expect(oldUsrData.first_name).not.toBe("test2");

      await user.setLastName("test2")
      expect(user.last_name).toBe("test2");
      expect(oldUsrData.last_name).not.toBe("test2");

      // NOT TESTABLE - There is no other language than en installed by default
      //await user.setLanguage("de")
      //expect(user.language).toBe("de");
      //expect(oldUsrData.language).not.toBe("de")

      await user.setPassword("test2")

      await user.setPanelAdmin(true)
      expect(user.root_admin).toBe(true);
      expect(oldUsrData.root_admin).toBe(false);
      console.log(user)

    });
  })

  test("Try getting & managing nodes", async () => {
    await client.getNode(testNodeId).then(async (node) => {
      console.log(node)

      const allocations = await node.getAllocations()
      console.log(allocations)

    })
  })

  afterAll(async () => {
    await (await client.getUser(testUserId)).delete()
    await (await client.getNode(testNodeId)).delete()
  })
});
