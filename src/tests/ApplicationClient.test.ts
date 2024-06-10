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

      const oldNodeData = await client.getNode(testNodeId)
      await node.setName("test2")
      node = await client.getNode(testNodeId)
      expect(node.name).toBe("test2")
      expect(oldNodeData.name).not.toBe("test2")

      await node.setDescription("test2")
      node = await client.getNode(testNodeId)
      expect(node.description).toBe("test2")
      expect(oldNodeData.description).not.toBe("test2")

      // This is currently untestable as we don't create 2 locations
      // await node.setLocation(1)
      // expect(node.location_id).toBe(1)
      // expect(oldNodeData.location_id).not.toBe(1)

      await node.setPublic(false)
      node = await client.getNode(testNodeId)
      expect(node.public).toBe(false)
      expect(oldNodeData.public).toBe(true)

      await node.setFqdn("test2.de")
      node = await client.getNode(testNodeId)
      expect(node.fqdn).toBe("test2.de")
      expect(oldNodeData.fqdn).not.toBe("test2.de")

      await node.setScheme("http")
      node = await client.getNode(testNodeId)
      expect(node.scheme).toBe("http")
      expect(oldNodeData.scheme).not.toBe("http")

      await node.setBehindProxy(true)
      node = await client.getNode(testNodeId)
      expect(node.behind_proxy).toBe(true)
      expect(oldNodeData.behind_proxy).toBe(false)

      await node.setMaintenance(true)
      node = await client.getNode(testNodeId)
      expect(node.maintenance_mode).toBe(true)
      expect(oldNodeData.maintenance_mode).toBe(false)

      // Disable the maintenance mode to be able to use this node for later tests
      await node.setMaintenance(false)

      await node.setMemory(2048)
      node = await client.getNode(testNodeId)
      expect(node.memory).toBe(2048)
      expect(oldNodeData.memory).not.toBe(2048)

      await node.setMemoryOverAllocation(-1)
      node = await client.getNode(testNodeId)
      expect(node.memory_overallocate).toBe(-1)
      expect(oldNodeData.memory_overallocate).not.toBe(-1)

      await node.setDisk(2048)
      node = await client.getNode(testNodeId)
      expect(node.disk).toBe(2048)
      expect(oldNodeData.disk).not.toBe(2048)

      await node.setDiskOverAllocation(-1)
      node = await client.getNode(testNodeId)
      expect(node.disk_overallocate).toBe(-1)
      expect(oldNodeData.disk_overallocate).not.toBe(-1)

      await node.setUploadSizeLimit(200)
      node = await client.getNode(testNodeId)
      expect(node.upload_size).toBe(200)
      expect(oldNodeData.upload_size).not.toBe(200)

      await node.setDaemonPort(8443)
      node = await client.getNode(testNodeId)
      expect(node.daemon_listen).toBe(8443)
      expect(oldNodeData.daemon_listen).not.toBe(8443)

      await node.setDaemonSftpPort(2023)
      node = await client.getNode(testNodeId)
      expect(node.daemon_sftp).toBe(2023)
      expect(oldNodeData.daemon_sftp).not.toBe(2023)

      await node.resetDaemonMasterKey()
        
      console.log(node)
    })
  }, 60000)

  afterAll(async () => {
    await (await client.getUser(testUserId)).delete()
    //await (await client.getNode(testNodeId)).delete()
  })
});
