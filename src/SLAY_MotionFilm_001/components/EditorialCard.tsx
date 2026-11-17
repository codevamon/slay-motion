import React from "react";
import {Img, staticFile} from "remotion";
import type {CardAsset} from "../assets";

const olive = "#3d4a2e";
const cream = "#f3f0e8";
const ink = "#1a1a1a";
const softGreen = "#c8d2a8";

const Photo: React.FC<{
  src?: string;
  style?: React.CSSProperties;
}> = ({src, style}) => {
  if (!src) {
    return <div style={{background: "#ddd", ...style}} />;
  }
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...style,
      }}
    />
  );
};

export const EditorialCard: React.FC<{
  asset: CardAsset;
  width: number;
  height: number;
}> = ({asset, width, height}) => {
  const base: React.CSSProperties = {
    width,
    height,
    overflow: "hidden",
    position: "relative",
    borderRadius: 0,
    background: cream,
  };

  switch (asset.recipe) {
    case "barcelona":
      return (
        <div style={{...base, background: ink, display: "flex", alignItems: "center", padding: "0 8%"}}>
          <div
            style={{
              color: cream,
              fontFamily: "Helvetica Neue, Arial Narrow, Arial, sans-serif",
              fontWeight: 700,
              fontSize: height * 0.22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            BARCELONA
          </div>
        </div>
      );

    case "flower-pale":
      return (
        <div style={base}>
          <Photo src={asset.photo} />
        </div>
      );

    case "numbers":
      return (
        <div
          style={{
            ...base,
            background: "#e8e6e1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10% 12%",
            color: olive,
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            fontWeight: 700,
            fontSize: height * 0.16,
            letterSpacing: "-0.02em",
          }}
        >
          <div>0034</div>
          <div style={{fontSize: height * 0.1}}>—</div>
          <div>0095</div>
        </div>
      );

    case "portrait-flower":
      // Provisional portrait crop already includes the geometric emblem.
      // When authentic slot art arrives, prefer a clean photo + <FlowerEmblem />.
      return (
        <div style={base}>
          <Photo src={asset.photo} />
        </div>
      );

    case "north-ave":
      return (
        <div style={{...base, background: cream, display: "flex"}}>
          <div style={{width: "9%", background: olive}} />
          <div style={{flex: 1, position: "relative", padding: "6%"}}>
            <div style={{width: "55%", height: "48%", overflow: "hidden"}}>
              <Photo src={asset.photo} />
            </div>
            <div
              style={{
                position: "absolute",
                right: "8%",
                bottom: "10%",
                fontFamily: "Georgia, Times New Roman, serif",
                fontSize: height * 0.14,
                color: olive,
                letterSpacing: "-0.03em",
              }}
            >
              north ave
            </div>
          </div>
          <div style={{width: "9%", background: olive}} />
        </div>
      );

    case "maple-street":
      return (
        <div style={{...base, background: cream, padding: "8% 10%"}}>
          <div
            style={{
              width: "70%",
              height: "42%",
              borderRadius: 999,
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            <Photo src={asset.photo} />
          </div>
          <div
            style={{
              marginTop: "8%",
              textAlign: "center",
              fontFamily: "Georgia, Times New Roman, serif",
              fontSize: height * 0.055,
              lineHeight: 1.35,
              color: olive,
              maxWidth: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Maple Street is a lovely avenue with lush trees.
          </div>
        </div>
      );

    case "circles-74k":
      return (
        <div style={{...base, background: cream}}>
          <Photo src={asset.photo} />
          <div
            style={{
              position: "absolute",
              left: "8%",
              bottom: "10%",
              color: cream,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 800,
              fontSize: height * 0.2,
              letterSpacing: "-0.04em",
              textShadow: "0 0 12px rgba(0,0,0,0.25)",
            }}
          >
            74K
          </div>
        </div>
      );

    case "meadow":
    case "meadow-soft":
    case "orange-bloom":
      return (
        <div style={base}>
          <Photo src={asset.photo} />
        </div>
      );

    case "fresh":
      return (
        <div style={{...base, background: ink, display: "flex", alignItems: "flex-start", padding: "10% 8%"}}>
          <div
            style={{
              color: softGreen,
              fontFamily: "Helvetica Neue, Arial Black, Arial, sans-serif",
              fontWeight: 800,
              fontSize: height * 0.28,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}
          >
            FRESH
          </div>
        </div>
      );

    case "nov-2026":
      return (
        <div style={{...base, background: olive, display: "flex", flexDirection: "column"}}>
          <div
            style={{
              color: cream,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 700,
              fontSize: height * 0.12,
              padding: "6% 8% 2%",
              letterSpacing: "0.06em",
            }}
          >
            2026
          </div>
          <div style={{flex: 1, margin: "0 8%", overflow: "hidden"}}>
            <Photo src={asset.photo} />
          </div>
          <div
            style={{
              color: cream,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 700,
              fontSize: height * 0.12,
              padding: "2% 8% 6%",
              letterSpacing: "0.12em",
            }}
          >
            NOV
          </div>
        </div>
      );

    default:
      return <div style={base} />;
  }
};
