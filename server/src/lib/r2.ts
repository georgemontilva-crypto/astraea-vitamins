import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxx.r2.dev or a custom domain

export const r2 = new S3Client({
  region: "auto",
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

/**
 * Uploads a file to R2 and returns its public URL.
 * `key` should include a folder prefix, e.g. "products/ashwagandha-ksm-66.png"
 * or "labels/AST-05.pdf" or "coa/ashwagandha-ksm-66/26-0114.pdf".
 */
export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  if (!bucket) throw new Error("R2_BUCKET_NAME is not set");
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrlFor(key);
}

export function publicUrlFor(key: string) {
  if (!publicUrl) throw new Error("R2_PUBLIC_URL is not set");
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

/** For private buckets / signed access — not needed while using the public dev URL. */
export function getObjectCommand(key: string) {
  if (!bucket) throw new Error("R2_BUCKET_NAME is not set");
  return new GetObjectCommand({ Bucket: bucket, Key: key });
}
