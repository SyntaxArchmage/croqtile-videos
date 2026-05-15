/**
 * remotion/compositions/CompileTimeSafety.tsx
 * Segment 4 — Compile-Time Safety (1:45–2:15, 30 s = 900 frames @ 30fps)
 *
 * Split screen: CroqTile compile error vs CUDA runtime crash; closing stats.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const FPS = THEME.video.fps;

const CROQ_LINES: { text: string; isBug: boolean }[] = [
  { text: "shared f16 [WARP_M, TILE_K] lhs_s;", isBug: false },
  {
    text: "tma.copy lhs.subspan(WARP_M, TILE_K * 2).at(bm, iv_k) => lhs_s;",
    isBug: true,
  },
  {
    text: "// compiler: error: span size mismatch — expected [64, 64], got [64, 128]",
    isBug: false,
  },
];

const CUDA_LINES: string[] = [
  "__global__ void fused_gemm(",
  "    half* __restrict__ out,",
  "    const half* __restrict__ lhs,",
  "    const half* __restrict__ rhs, int K) {",
  "  int tid = threadIdx.x + blockIdx.x * blockDim.x;",
  "  // unsafe slice: K mismatch at runtime",
  "  half v = lhs[tid * K + 128];  // OOB when K < 128",
  "  out[tid] = v;",
  "}",
];

const GpuGlyph: React.FC<{ frame: number }> = ({ frame }) => {
  const t = Math.max(0, frame - 240);
  const enter = spring({
    frame: Math.max(0, t - 6),
    fps: FPS,
    config: { damping: 15, stiffness: 110, mass: 0.75 },
    from: 0.82,
    to: 1,
  });
  const tremble =
    t > 55 && t < 130
      ? Math.sin(t * 0.95) * interpolate(t, [55, 75, 110, 130], [0, 4, 6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const glow = interpolate(t, [40, 90, 140], [0.2, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crack = interpolate(t, [95, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "24px 0 8px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 128,
          height: 128,
          transform: `scale(${enter}) translateX(${tremble}px) rotate(${tremble * 0.35}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: THEME.radius.lg,
            background: `radial-gradient(circle at 40% 35%, rgba(129,140,248,0.35), transparent 55%)`,
            opacity: glow,
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: THEME.radius.lg,
            background: `linear-gradient(145deg, #1F2937, #111827)`,
            border: `1px solid rgba(129,140,248,0.35)`,
            boxShadow: `${THEME.shadows.card}, 0 0 0 1px rgba(255,255,255,0.04) inset`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* GPU chip icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: `linear-gradient(180deg, #374151, #1F2937)`,
              border: `1px solid rgba(255,255,255,0.08)`,
              boxShadow: THEME.shadows.inset,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 14,
                borderRadius: 8,
                background:
                  "repeating-linear-gradient(90deg, rgba(110,231,183,0.15) 0 2px, transparent 2px 8px)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 28,
                height: 28,
                marginLeft: -14,
                marginTop: -14,
                borderRadius: 6,
                background: THEME.colors.accent,
                opacity: 0.35,
                boxShadow: `0 0 24px ${THEME.colors.accent}`,
              }}
            />
            {/* Crack overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(125deg, transparent 46%, rgba(248,113,113,${0.35 * crack}) 50%, transparent 54%)`,
                mixBlendMode: "screen",
                opacity: crack,
              }}
            />
          </div>
        </div>
      </div>
      <span
        style={{
          fontFamily: THEME.fonts.mono,
          fontSize: THEME.fontSize.xs,
          color: THEME.colors.textMuted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Device
      </span>
    </div>
  );
};

export const CompileTimeSafety: React.FC = () => {
  const frame = useCurrentFrame();

  // 0–120: code appears
  const panelEnter = interpolate(frame, [0, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelY = interpolate(frame, [0, 72], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 120–240: CroqTile bug + compiler error
  const bugPhase = frame - 120;
  const bugHighlight = interpolate(bugPhase, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const errorPop = spring({
    frame: bugPhase - 4,
    fps: FPS,
    config: { damping: 13, stiffness: 120, mass: 0.65 },
    from: 0.94,
    to: 1,
  });
  const errorOpacity = interpolate(bugPhase, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 240–420: CUDA crash sequence
  const cudaPhase = frame - 240;
  const cudaErrorOpacity = interpolate(cudaPhase, [95, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cudaErrorY = interpolate(cudaPhase, [95, 130], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 420–600: stats count
  const statFrame = frame - 420;
  const compileChecks = Math.round(
    interpolate(statFrame, [0, 150], [0, 353], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const runtimeAssertions = Math.round(
    interpolate(statFrame, [24, 168], [0, 1319], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const statsOpacity = interpolate(statFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statsScale = spring({
    frame: statFrame - 4,
    fps: FPS,
    config: { damping: 16, stiffness: 130, mass: 0.7 },
    from: 0.92,
    to: 1,
  });

  const lineFade = (i: number) =>
    interpolate(frame, [8 + i * 10, 28 + i * 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const cudaLineFade = (i: number) =>
    interpolate(frame, [12 + i * 11, 30 + i * 11], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <PageContainer tag="Safety" title="Caught at Compile Time">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.032} />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "row",
            gap: 40,
            alignItems: "stretch",
            opacity: panelEnter,
            transform: `translateY(${panelY}px)`,
          }}
        >
          {/* Left: CroqTile */}
          <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <DeviceShell
              title="tile_kernel.croq"
              width={880}
              height={540}
              style={{ width: "100%", height: "100%", maxHeight: 540 }}
            >
              <div
                style={{
                  height: "100%",
                  padding: "20px 24px 24px",
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.sm,
                  lineHeight: 1.65,
                  color: THEME.colors.textCode,
                  background: `linear-gradient(180deg, rgba(0,0,0,0.12), transparent)`,
                }}
              >
                {CROQ_LINES.map((line, i) => {
                  const lf = lineFade(i);
                  const isBug = line.isBug;
                  const bg = isBug
                    ? `rgba(248,113,113,${0.08 + 0.42 * bugHighlight})`
                    : "transparent";
                  const border = isBug
                    ? `1px solid rgba(248,113,113,${0.25 + 0.55 * bugHighlight})`
                    : "1px solid transparent";
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: lf,
                        padding: "4px 10px",
                        marginBottom: 4,
                        borderRadius: THEME.radius.sm,
                        background: bg,
                        border,
                        boxShadow: isBug
                          ? `0 0 0 1px rgba(248,113,113,${0.15 * bugHighlight}) inset, 0 8px 28px rgba(248,113,113,${0.12 * bugHighlight})`
                          : undefined,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {line.text}
                    </div>
                  );
                })}

                {/* Compiler error callout */}
                <div
                  style={{
                    marginTop: 16,
                    opacity: errorOpacity,
                    transform: `scale(${errorPop})`,
                    transformOrigin: "top left",
                  }}
                >
                  <div
                    style={{
                      borderRadius: THEME.radius.md,
                      border: `1px solid rgba(248,113,113,0.45)`,
                      background: "rgba(17,24,39,0.92)",
                      boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset`,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: THEME.fontSize.xs,
                          fontWeight: 700,
                          color: THEME.colors.danger,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Compile error
                      </span>
                      <span
                        style={{
                          flex: 1,
                          height: 1,
                          background: "linear-gradient(90deg, rgba(248,113,113,0.5), transparent)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: THEME.fontSize.xs,
                        color: THEME.colors.textSecondary,
                        fontFamily: THEME.fonts.mono,
                      }}
                    >
                      <span style={{ color: THEME.colors.textMuted }}>tile_kernel.croq:2:1</span>
                      <span style={{ color: THEME.colors.textMuted }}> — </span>
                      <span style={{ color: THEME.colors.danger }}>
                        span size mismatch: expected layout [64, 64], found [64, 128]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DeviceShell>
          </div>

          {/* Right: CUDA */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            <DeviceShell
              title="manual_kernel.cu"
              width={880}
              height={420}
              style={{ width: "100%", height: 420 }}
            >
              <div
                style={{
                  height: "100%",
                  padding: "20px 24px",
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.sm,
                  lineHeight: 1.62,
                  color: THEME.colors.textSecondary,
                  background: `linear-gradient(180deg, rgba(0,0,0,0.15), transparent)`,
                }}
              >
                {CUDA_LINES.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      opacity: cudaLineFade(i),
                      whiteSpace: "pre",
                      padding: "2px 0",
                    }}
                  >
                    {line.includes("half v =") ? (
                      <>
                        {line.split("half v")[0]}
                        <span style={{ color: THEME.colors.accentWarm }}>half v</span>
                        {line.slice(line.indexOf("=") - 1)}
                      </>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </DeviceShell>

            <div
              style={{
                position: "relative",
                height: 220,
                marginTop: 4,
                pointerEvents: "none",
              }}
            >
              <Sequence from={240} layout="none">
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <GpuGlyph frame={frame} />
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 12,
                      transform: `translateX(-50%) translateY(${cudaErrorY}px)`,
                      opacity: cudaErrorOpacity,
                      padding: "12px 18px",
                      borderRadius: THEME.radius.md,
                      background: "rgba(17,24,39,0.95)",
                      border: `1px solid rgba(248,113,113,0.5)`,
                      boxShadow: `0 16px 48px rgba(0,0,0,0.55)`,
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize.sm,
                      color: THEME.colors.danger,
                      whiteSpace: "nowrap",
                    }}
                  >
                    CUDA error: illegal memory access
                  </div>
                </div>
              </Sequence>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 56,
            paddingTop: 8,
            opacity: statsOpacity,
            transform: `scale(${statsScale})`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize["3xl"],
                fontWeight: 800,
                color: THEME.colors.primary,
                textShadow: `0 0 28px ${THEME.colors.primaryGlow}`,
              }}
            >
              {compileChecks.toLocaleString()}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.textSecondary,
                fontFamily: THEME.fonts.sans,
              }}
            >
              compile-time checks
            </div>
          </div>
          <div
            style={{
              width: 1,
              alignSelf: "stretch",
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)",
              margin: "8px 0",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize["3xl"],
                fontWeight: 800,
                color: THEME.colors.accent,
                textShadow: `0 0 28px rgba(129,140,248,0.35)`,
              }}
            >
              {runtimeAssertions.toLocaleString()}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.textSecondary,
                fontFamily: THEME.fonts.sans,
              }}
            >
              runtime assertions
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
