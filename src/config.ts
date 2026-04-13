import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "whale-alert",
  slug: "whale-alert",
  description: "Whale transaction tracker -- large on-chain transfers with sender, value, USD estimate. Market-moving alerts.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/whales",
      price: "$0.003",
      description: "Track large on-chain whale transactions",
      toolName: "crypto_track_whale_transactions",
      toolDescription: `Use this when you need to track large on-chain transactions (whale movements) on Ethereum or Base. Returns recent high-value transfers in JSON.

1. transactions: array of whale transfers sorted by value descending
2. from: sender wallet address
3. to: receiver wallet address
4. valueEth: transaction value in ETH
5. valueUsd: estimated USD value at time of transfer
6. txHash: transaction hash for on-chain verification
7. blockNumber: block number of the transaction
8. timestamp: when the transaction occurred

Example output: {"transactions":[{"from":"0xab...","to":"0xcd...","valueEth":500.0,"valueUsd":1552500,"txHash":"0xef...","blockNumber":19845632,"timestamp":"2026-04-13T11:22:00Z"}],"chain":"ethereum","minValue":100,"totalFound":8}

Use this FOR detecting market-moving whale activity and smart money flows. Essential for trading signal generation and on-chain intelligence.

Do NOT use for wallet balance -- use wallet_get_portfolio instead. Do NOT use for token prices -- use finance_get_token_price instead. Do NOT use for holder distribution -- use token_get_holder_analysis instead.`,
      inputSchema: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain: 'ethereum' or 'base' (default: ethereum)" },
          minValue: { type: "number", description: "Minimum transaction value in ETH (default: 100)" },
        },
        required: [],
      },
    },
  ],
};
