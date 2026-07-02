# Whale Alert API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://whale-alert.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Whale transaction tracker -- large on-chain transfers with sender, value, USD estimate. Market-moving alerts. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "whale-alert": {
      "url": "https://whale-alert.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://whale-alert.api.klymax402.com/api/whales" \
  -H "Content-Type: application/json" \
  -d '{}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `crypto_track_whale_transactions` | POST | `/api/whales` | $0.003 | Track large on-chain whale transactions |

### `crypto_track_whale_transactions`

Use this when you need to track large on-chain transactions (whale movements) on Ethereum or Base. Returns recent high-value transfers in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `chain` | string | no | Blockchain: 'ethereum' or 'base' (default: ethereum) |
| `minValue` | number | no | Minimum transaction value in ETH (default: 100) |

**Returns**

- `transactions` -- array of whale transfers sorted by value descending
- `from` -- sender wallet address
- `to` -- receiver wallet address
- `valueEth` -- transaction value in ETH
- `valueUsd` -- estimated USD value at time of transfer
- `txHash` -- transaction hash for on-chain verification
- `blockNumber` -- block number of the transaction
- `timestamp` -- when the transaction occurred

Example response:

```json
{"transactions":[{"from":"0xab...","to":"0xcd...","valueEth":500.0,"valueUsd":1552500,"txHash":"0xef...","blockNumber":19845632,"timestamp":"2026-04-13T11:22:00Z"}],"chain":"ethereum","minValue":100,"totalFound":8}
```

**When to use**: detecting market-moving whale activity and smart money flows. Essential for trading signal generation and on-chain intelligence.

**Not for**: wallet balance (use `wallet_get_portfolio`), token prices (use `finance_get_token_price`), holder distribution (use `token_get_holder_analysis`).

## Example agent prompts

- "Track large on-chain transactions (whale movements) on Ethereum or Base"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
