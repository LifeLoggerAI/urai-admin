import { headers } from "next/headers";

const VALID_NODE_KEYS = process.env.FEDERATION_NODE_KEYS?.split(",") || [];

export function verifyNodeRequest() {
  const key = headers().get("x-urai-node-key");

  if (!key || !VALID_NODE_KEYS.includes(key)) {
    throw new Error("Unauthorized federation node");
  }
}
