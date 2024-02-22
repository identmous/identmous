import { exportPKCS8, exportSPKI, generateKeyPair } from "jose";

const cache: {
  privateKey?: string;
  publicKey?: string;
} = {};

export async function getPublicKey(env: App.Env): Promise<string> {
  if (cache.publicKey) return cache.publicKey;

  const publicKey = await env.KV.get("public_key");

  if (!publicKey) {
    await generate(env);
    return await getPublicKey(env);
  }

  cache.publicKey = publicKey;

  return publicKey;
}

export async function getPrivateKey(env: App.Env): Promise<string> {
  if (cache.privateKey) return cache.privateKey;

  const privateKey = await env.KV.get("private_key");

  if (!privateKey) {
    await generate(env);
    return await getPublicKey(env);
  }

  cache.privateKey = privateKey;

  return privateKey;
}

export async function generate(env: App.Env) {
  const { publicKey, privateKey } = await generateKeyPair("ES256", {
    extractable: true,
  });

  await env.KV.put("public_key", await exportSPKI(publicKey));
  await env.KV.put("private_key", await exportPKCS8(privateKey));
}
