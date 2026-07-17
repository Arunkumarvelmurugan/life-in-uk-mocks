import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Life in UK Mocks - Practice Tests for the Life in the UK Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "src/app/icon.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori (next/og) requires a plain <img>, not next/image */}
        <img src={logoSrc} alt="" width={160} height={160} style={{ borderRadius: 32 }} />
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "#ffffff",
            marginTop: 32,
          }}
        >
          Life in UK Mocks
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#c7d2fe",
            marginTop: 16,
            maxWidth: 880,
            textAlign: "center",
          }}
        >
          Pass the Life in the UK test, first time.
        </div>
      </div>
    ),
    { ...size }
  );
}
