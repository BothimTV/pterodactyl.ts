import { readFileSync } from "fs";
import { createPool } from "mariadb";
import {
  GenericContainer,
  Network,
  StartedNetwork,
  StartedTestContainer,
} from "testcontainers";
import { RawNodeConfiguration } from "../src/types/application/nodeConfiguration";

let redis: StartedTestContainer;
let mysql: StartedTestContainer;
let panel: StartedTestContainer;
let wings: StartedTestContainer;
let network: StartedNetwork;

async function startContainers() {
  network = await new Network().start();
  console.log("Network is running");

  redis = await new GenericContainer("redis:latest")
    .withNetwork(network)
    .start();
  console.log("Redis is running: ", redis.getIpAddress(network.getName()));

  mysql = await new GenericContainer("mariadb:latest")
    .withNetwork(network)
    .withEnvironment({
      MARIADB_USER: "pterodactyl",
      MARIADB_PASSWORD: "password",
      MARIADB_DATABASE: "panel",
      MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: "1",
    })
    .withExposedPorts(3306)
    .start();

  await mysql.copyContentToContainer([
    {
      content: readFileSync("./tests/devSetup.sql", { encoding: "utf-8" }),
      target: "/docker-entrypoint-initdb.d/devSetup.sql",
    },
  ]);
  console.log(
    "Mysql is running: " + mysql.getIpAddress(network.getName()) + ":3006",
  );
  console.log("Mysql is running: localhost:", mysql.getMappedPort(3306));

  let panelUrl =
    "http://" +
    mysql
      .getIpAddress(network.getName())
      .split(".")
      .map((v, i) => (i === 3 ? 4 : v))
      .join(".");
  panel = await new GenericContainer("ghcr.io/pterodactyl/panel")
    .withNetwork(network)
    .withEnvironment({
      APP_URL: panelUrl,
      APP_DEBUG: "true",
      APP_TIMEZONE: "Europe/Berlin",
      DB_HOST: mysql.getIpAddress(network.getName()),
      DB_PORT: "3306",
      DB_DATABASE: "panel",
      DB_USERNAME: "pterodactyl",
      DB_PASSWORD: "password",
      CACHE_DRIVER: "redis",
      REDIS_HOST: redis.getIpAddress(network.getName()),
      REDIS_PORT: "6379",
      REDIS_PASSWORD: "",
      APP_KEY: "qRR876pqQ5pbn3zxC28aZ3TZjTwczXPp",
    })
    .withExposedPorts(80)
    .start();

  await new Promise(async (resolve) => {
    (await panel.logs()).on("data", (data: string) => {
      if (data.includes("Starting cron jobs.")) resolve("");
    });
  });

  await executeMysql(mysql.getMappedPort(3306));

  console.log("Panel is running", panel.getIpAddress(network.getName()));
  console.log("Panel url: http://localhost:" + panel.getMappedPort(80));
}

async function executeMysql(port: number) {
  const pool = createPool({
    host: "localhost",
    port: port,
    user: "pterodactyl",
    password: "password",
    database: "panel",
  });
  const queries = readFileSync("./tests/devSetup.sql", {
    encoding: "utf-8",
  }).split("\n");
  for (const query of queries) {
    await pool.execute(query).catch((err) => console.log(err));
  }
  await pool.end().catch((err) => console.log(err));
}

export function getNetwork(): StartedNetwork {
  return network;
}

export async function startWings(
  cfg: RawNodeConfiguration,
): Promise<StartedTestContainer> {
  console.log("Starting wings");
  wings = await new GenericContainer("ghcr.io/pterodactyl/wings")
    .withNetwork(network)
    .withCopyContentToContainer([
      {
        content: JSON.stringify(cfg),
        target: "/etc/pterodactyl/config.yml",
      },
    ])
    .start();
  console.log("Wings is running", wings.getIpAddress(network.getName()));
  return wings;
}

export async function getPanel(): Promise<StartedTestContainer> {
  await startContainers();
  return panel;
}

export async function cleanup(): Promise<void> {
  await panel.stop();
  await wings.stop();
  await mysql.stop();
  await redis.stop();
  await network.stop();
}
