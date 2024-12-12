const main = async () => {
  try {
    const cosmwasm = await import('@cosmjs/cosmwasm-stargate');
    const { CosmWasmClient } = cosmwasm;
    console.log("Connecting to Neutron...");
    const client = await CosmWasmClient.connect("https://neutron-rpc.polkachu.com");
    const contractAddress = "neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp";

    // Query total locked tokens
    console.log("Querying total locked tokens...");
    const totalLockedTokensResponse = await client.queryContractSmart(contractAddress, {
      total_locked_tokens: {}
    });
    console.log("\nTotal Locked Tokens:", totalLockedTokensResponse.total_locked_tokens);

    // Query contract constants
    console.log("\nQuerying contract constants...");
    const constantsResponse = await client.queryContractSmart(contractAddress, {
      constants: {}
    });
    console.log("\nContract Constants:", constantsResponse.constants);

    // Query the number of users with lockups
    console.log("\nQuerying the number of users with lockups...");
    const numUsersWithLockups = await getNumUsersWithLockups(client, contractAddress);
    console.log("\nNumber of users with lockups:", numUsersWithLockups);
  } catch (error) {
    console.error("\nError querying contract:", error.message);
    if (error.stack) {
      console.error("\nStack trace:", error.stack);
    }
  }
};

async function getNumUsersWithLockups(client, contractAddress, startFrom = 0, limit = 100) {
  const seenUsers = new Set();
  let totalUsers = 0;

  while (true) {
    console.log({
      all_user_lockups: {
        address: "neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp",
        start_from: startFrom,
        limit: limit
      }
    })
    const allUserLockupsResponse = await client.queryContractSmart(contractAddress, {
      all_lockups: {
        start_from: startFrom,
        limit: limit
      }
    });

    for (const lockup of allUserLockupsResponse.lockups) {
      if (!seenUsers.has(lockup.address)) {
        seenUsers.add(lockup.address);
        totalUsers++;
      }
    }

    if (allUserLockupsResponse.lockups.length < limit) {
      break;
    }

    startFrom += limit;
  }

  return totalUsers;
}

main();