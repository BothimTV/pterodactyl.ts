import { describe, test } from "@jest/globals";
import { ApplicationClient } from "../classes/application/ApplicationClient";

const client = new ApplicationClient({
    apikey: process.env.API_KEY || "",
    panel: process.env.PANEL || ""
});

describe("Test the Application API", () => {
  test("Try getting users", async () => {
    await client.getUsers().then((users) => {
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
    });
  })
});
