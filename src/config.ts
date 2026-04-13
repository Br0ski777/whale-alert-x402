import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "whale-alert",
  slug: "whale-alert",
  description: "Track large on-chain transactions (whale movements) via Etherscan-like APIs.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/whales",
      price: "$0.003",
      description: "Track large on-chain whale transactions",
      toolName: "crypto_track_whale_transactions",
      toolDescription: "Use this when you need to track large on-chain transactions (whale movements). Returns recent high-value transfers on Ethereum or Base with sender, receiver, value in ETH and USD estimate, and transaction hash. Do NOT use for wallet balance — use wallet_get_portfolio instead. Do NOT use for token prices — use crypto_get_token_price instead.",
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
