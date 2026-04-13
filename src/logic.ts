import type { Hono } from "hono";

const RPC_URLS: Record<string, string> = {
  ethereum: "https://eth.llamarpc.com",
  base: "https://mainnet.base.org",
};

async function rpcCall(rpcUrl: string, method: string, params: any[]): Promise<any> {
  const resp = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const json = await resp.json() as any;
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

function hexToEth(hex: string): number {
  return parseInt(hex, 16) / 1e18;
}

export function registerRoutes(app: Hono) {
  app.post("/api/whales", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const chain: string = (body?.chain || "ethereum").toLowerCase();
    const minValue: number = body?.minValue || 100;

    const rpcUrl = RPC_URLS[chain];
    if (!rpcUrl) {
      return c.json({ error: `Unsupported chain: ${chain}. Supported: ethereum, base` }, 400);
    }

    try {
      // Get latest block number
      const latestBlockHex = await rpcCall(rpcUrl, "eth_blockNumber", []);
      const latestBlock = parseInt(latestBlockHex, 16);

      // Scan last 5 blocks for large transactions
      const whaleTransactions: any[] = [];
      const blocksToScan = 5;

      for (let i = 0; i < blocksToScan && whaleTransactions.length < 20; i++) {
        const blockNum = "0x" + (latestBlock - i).toString(16);
        const block = await rpcCall(rpcUrl, "eth_getBlockByNumber", [blockNum, true]);

        if (!block?.transactions) continue;

        for (const tx of block.transactions) {
          const valueEth = hexToEth(tx.value);
          if (valueEth >= minValue) {
            whaleTransactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              valueEth: parseFloat(valueEth.toFixed(4)),
              blockNumber: parseInt(tx.blockNumber, 16),
              gasPrice: tx.gasPrice ? parseFloat((parseInt(tx.gasPrice, 16) / 1e9).toFixed(2)) + " Gwei" : null,
            });
          }
        }
      }

      // Sort by value descending
      whaleTransactions.sort((a, b) => b.valueEth - a.valueEth);

      return c.json({
        chain,
        minValueEth: minValue,
        latestBlock,
        blocksScanned: blocksToScan,
        whaleCount: whaleTransactions.length,
        transactions: whaleTransactions.slice(0, 20),
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      return c.json({ error: `Failed to fetch whale transactions: ${e.message}` }, 500);
    }
  });
}
