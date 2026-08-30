import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Precio de la luz hoy, por horas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #1295d8 0%, #56c9ef 52%, #dff4fb 100%)",
          color: "white",
          display: "flex",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 34, opacity: 0.82 }}>Precio de la luz hoy</span>
          <strong style={{ fontSize: 88, letterSpacing: "-0.06em", marginTop: 22 }}>
            Precio Luz
          </strong>
          <span style={{ fontSize: 34, marginTop: 20 }}>Consulta las horas más baratas</span>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: 36,
            color: "#0f172a",
            display: "flex",
            flexDirection: "column",
            padding: "34px 40px",
          }}
        >
          <span style={{ color: "#64748b", fontSize: 24 }}>Precio actual</span>
          <strong style={{ fontSize: 48, marginTop: 12 }}>€/kWh</strong>
          <span style={{ color: "#0f766e", fontSize: 23, marginTop: 14 }}>Datos de Red Eléctrica</span>
        </div>
      </div>
    ),
    size
  );
}