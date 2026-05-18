/**
 * remotion/compositions/IterativeDev.tsx
 * 段 1 — 迭代开发的痛苦 + CroqTile 揭晓
 * 1470 帧 @30fps (~49.0s)
 *
 * 配音对齐 (相对帧号):
 *   0–163f      seg1-01 "不仅仅是因为复杂…"
 *   166–554f    seg1-02 "多轮编写——编译调试——性能剖析——参数调优"
 *   557–845f    seg1-03 "编程能力 + 硬件知识 + 性能优化经验"
 *   848–991f    seg1-04 "这些门槛大大限制了开发效率"
 *   994–1373f   seg1-05 "所以我们造了CroqTile"
 *   1373–1393f  淡出
 *   1393–1470f  片段 padding（总时长对齐 FullVideo）
 *
 * 画面设计 (严格对齐每句话):
 *   Phase 1 (0–163f):    代码片段 + "不只是复杂" — 引出问题
 *   Phase 2 (166–554f):  环形迭代流程图 + 错误闪烁 + 性能曲线 — 核心迭代痛苦
 *   Phase 3 (557–845f):  三组门槛关键词逐个浮现 — 门槛展示
 *   Phase 4 (848–991f):  三能力汇聚 → Development Efficiency — 结论
 *   Phase 5 (994–1393f): CroqTile logo 揭晓
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";

const TOTAL_FRAMES = 1470;

const CX = 960;
const CY = 440;

/* ── Phase 1: Code snippet + "not just complexity" (0–163f) ── */
const CODE_LINES_P1 = [
  "// immaTensorCoreGemm.cu — NVIDIA CUDA Samples",
  "// Integer GEMM using Warp Matrix Multiply (WMMA)",
  "#include <mma.h>",
  "#include <cuda_runtime.h>",
  "using namespace nvcuda;",
  "",
  "#define WARP_SIZE 32",
  "#define M 16",
  "#define N 16",
  "#define K 16",
  "#define M_TILES 256",
  "#define N_TILES 256",
  "#define K_TILES 256",
  "#define M_GLOBAL (M * M_TILES)",
  "#define N_GLOBAL (N * N_TILES)",
  "#define K_GLOBAL (K * K_TILES)",
  "#define WARPS_PER_BLOCK 8",
  "#define THREADS_PER_BLOCK (WARP_SIZE * WARPS_PER_BLOCK)",
  "#define CHUNK_K 8",
  "#define BLOCK_ROW_WARPS 2",
  "#define BLOCK_COL_WARPS 4",
  "#define WARP_ROW_TILES 4",
  "#define WARP_COL_TILES 2",
  "#define BLOCK_ROW_TILES (WARP_ROW_TILES*BLOCK_ROW_WARPS)",
  "#define BLOCK_COL_TILES (WARP_COL_TILES*BLOCK_COL_WARPS)",
  "#define SHMEM_STRIDE (N * BLOCK_ROW_TILES)",
  "#define SHMEM_OFFSET (N * WARP_ROW_TILES)",
  "#define SKEW_HALF 8",
  "#define C_LAYOUT wmma::mem_row_major",
  "",
  "__global__ void compute_gemm_imma(",
  "    const int8_t *A, const int8_t *B,",
  "    const int *C, int *D,",
  "    int alpha, int beta) {",
  "  extern __shared__ int8_t shmem[][CHUNK_K*K+SKEW_HALF];",
  "  const unsigned int warpId = threadIdx.x / WARP_SIZE;",
  "  const unsigned int laneId = threadIdx.x % WARP_SIZE;",
  "  const size_t shmem_idx_b_off = BLOCK_COL_TILES * M;",
  "",
  "  int *shmem_warp_tile_ptr = (int*)&shmem[0][0]",
  "    + (warpId / 2) * SHMEM_STRIDE * K * 2",
  "    + (warpId % 2) * SHMEM_OFFSET;",
  "  int *shmem_warp_stream_ptr = (int*)&shmem[0][0]",
  "    + warpId * SHMEM_STRIDE * K;",
  "",
  "  beta /= alpha;",
  "",
  "  // Persistent scheduling — CTA slides along tiles",
  "  for (unsigned int block_pos = blockIdx.x;;",
  "       block_pos += gridDim.x) {",
  "    const unsigned int block_tile_i =",
  "      ((block_pos * BLOCK_COL_TILES) / N_TILES)",
  "      * (BLOCK_ROW_WARPS * WARP_ROW_TILES);",
  "    const unsigned int block_tile_j =",
  "      (block_pos * BLOCK_COL_TILES) % N_TILES;",
  "    if (block_tile_i >= M_TILES) break;",
  "",
  "    // Stream C tiles to shared memory",
  "    const size_t gmem_idx =",
  "      (block_tile_i + warpId)*M*GLOBAL_MEM_STRIDE",
  "      + block_tile_j * N;",
  "    const int *src_gmem_warp_stream_ptr = &C[gmem_idx];",
  "#pragma unroll",
  "    for (int i = 0; i < K; i++) {",
  "      *((int4*)(shmem_warp_stream_ptr+SHMEM_STRIDE*i)",
  "        + laneId) = *((int4*)",
  "        (src_gmem_warp_stream_ptr+GLOBAL_MEM_STRIDE*i)",
  "        + laneId);",
  "    }",
  "    __syncthreads();",
  "",
  "    // Accumulator fragments",
  "    wmma::fragment<wmma::accumulator,M,N,K,int>",
  "      c[WARP_COL_TILES][WARP_ROW_TILES];",
  "#pragma unroll",
  "    for (int i = 0; i < WARP_COL_TILES; i++)",
  "      for (int j = 0; j < WARP_ROW_TILES; j++)",
  "        wmma::load_matrix_sync(c[i][j],",
  "          shmem_warp_tile_ptr+i*SHMEM_STRIDE*K+j*N,",
  "          SHMEM_STRIDE, C_LAYOUT);",
  "    __syncthreads();",
  "",
  "    // Scale C matrix",
  "#pragma unroll",
  "    for (int i = 0; i < WARP_COL_TILES; i++)",
  "      for (int j = 0; j < WARP_ROW_TILES; j++)",
  "        for (int t = 0; t < c[i][j].num_elements; t++)",
  "          c[i][j].x[t] *= beta;",
  "",
  "    // Warp-specialized copy: warps 0-3 copy A, 4-7 copy B",
  "    const int8_t *warp_ptr = (warpId < 4)",
  "      ? (&A[block_tile_i*M*K_GLOBAL]",
  "         + M*K_GLOBAL*(warpId%4)*2)",
  "      : (&B[block_tile_j*N*K_GLOBAL]",
  "         + N*K_GLOBAL*(warpId%4)*2);",
  "",
  "    // Main K-dimension loop",
  "#pragma unroll",
  "    for (int tile_k = 0; tile_k < K_TILES;",
  "         tile_k += CHUNK_K) {",
  "      // Copy A/B slices to shared memory",
  "      size_t shmem_idx = warpId < (WARPS_PER_BLOCK/2)",
  "        ? (M * (warpId % (WARPS_PER_BLOCK/2)) * 2)",
  "        : (N * (warpId % (WARPS_PER_BLOCK/2)) * 2",
  "           + shmem_idx_b_off);",
  "      shmem_idx += laneId / (WARP_SIZE / 2);",
  "      int4 *lane_ptr = (int4*)(warp_ptr + tile_k*K",
  "        + (laneId/(WARP_SIZE/2))*K_GLOBAL)",
  "        + (laneId % (WARP_SIZE/2));",
  "#pragma unroll",
  "      for (int i = 0; i < (WARP_SIZE/2); i++) {",
  "        *((int4*)&shmem[shmem_idx][0]",
  "          + (laneId % (WARP_SIZE/2))) = *lane_ptr;",
  "        lane_ptr = (int4*)((int8_t*)lane_ptr",
  "          + K_GLOBAL * 2);",
  "        shmem_idx += 2;",
  "      }",
  "      __syncthreads();",
  "",
  "      // Compute: MMA on shared memory tiles",
  "#pragma unroll",
  "      for (int k_step = 0; k_step < CHUNK_K;",
  "           k_step++) {",
  "        wmma::fragment<wmma::matrix_a,M,N,K,",
  "          int8_t,wmma::row_major> a[WARP_COL_TILES];",
  "        wmma::fragment<wmma::matrix_b,M,N,K,",
  "          int8_t,wmma::col_major> b[WARP_ROW_TILES];",
  "#pragma unroll",
  "        for (int i = 0; i < WARP_COL_TILES; i++) {",
  "          size_t shmem_idx_a =",
  "            (warpId/2)*M*2 + (i * M);",
  "          const int8_t *tile_ptr =",
  "            &shmem[shmem_idx_a][k_step * K];",
  "          wmma::load_matrix_sync(a[i], tile_ptr,",
  "            K * CHUNK_K + SKEW_HALF);",
  "#pragma unroll",
  "          for (int j = 0; j < WARP_ROW_TILES; j++) {",
  "            if (i == 0) {",
  "              size_t shmem_idx_b = shmem_idx_b_off",
  "                + (WARP_ROW_TILES*N)*(warpId%2)+(j*N);",
  "              wmma::load_matrix_sync(b[j],",
  "                &shmem[shmem_idx_b][k_step*K],",
  "                K * CHUNK_K + SKEW_HALF);",
  "            }",
  "            wmma::mma_sync(c[i][j],a[i],b[j],c[i][j]);",
  "          }",
  "        }",
  "      }",
  "      __syncthreads();",
  "    }",
  "",
  "    // Store D fragments via shared memory",
  "#pragma unroll",
  "    for (int i = 0; i < WARP_COL_TILES; i++)",
  "      for (int j = 0; j < WARP_ROW_TILES; j++) {",
  "        for (int t=0; t<c[i][j].num_elements; t++)",
  "          c[i][j].x[t] *= alpha;",
  "        wmma::store_matrix_sync(",
  "          shmem_warp_tile_ptr+i*SHMEM_STRIDE*K+j*N,",
  "          c[i][j], SHMEM_STRIDE, C_LAYOUT);",
  "      }",
  "    __syncthreads();",
  "",
  "    // Stream D from shared to global memory",
  "    int *dst_gmem_warp_stream_ptr = &D[gmem_idx];",
  "#pragma unroll",
  "    for (int i = 0; i < K; i++) {",
  "      *((int4*)(dst_gmem_warp_stream_ptr",
  "        + GLOBAL_MEM_STRIDE*i) + laneId) =",
  "        *((int4*)(shmem_warp_stream_ptr",
  "        + SHMEM_STRIDE*i) + laneId);",
  "    }",
  "    __syncthreads();",
  "  }",
  "}",
  "",
  "// Host: init matrices, launch kernel, verify",
  "int main(int argc, char **argv) {",
  "  int dev = findCudaDevice(argc, (const char**)argv);",
  "  cudaDeviceProp deviceProp;",
  "  cudaGetDeviceProperties(&deviceProp, dev);",
  "  if (deviceProp.major < 7) exit(EXIT_WAIVED);",
  "  ...",
  "}",
];
const TOTAL_LOC = 656;

function colorCodeLine(line: string) {
  if (line.trim() === "") return "#D4D4D4";
  if (line.includes("//")) return "#6A9955";
  if (line.startsWith("#include") || line.startsWith("#define") || line.includes("#pragma")) return "#C586C0";
  if (line.includes("using namespace")) return "#C586C0";
  if (line.includes("__global__") || line.includes("__shared__") || line.includes("extern") || line.includes("__restrict__") || line.includes("const ") || line.match(/\b(int|uint|unsigned|void|size_t|int8_t|int4|char)\b/) || line.match(/\b(for|while|if|break|return|exit)\b/)) return "#569CD6";
  if (line.includes("half") || line.includes("float")) return "#4EC9B0";
  if (line.includes("wmma::") || line.includes("__syncthreads") || line.includes("compute_gemm") || line.includes("cudaGet") || line.includes("findCuda")) return "#DCDCAA";
  return "#D4D4D4";
}

const CodeIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const codeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const VISIBLE_WINDOW = 16;
  const totalLines = CODE_LINES_P1.length;
  const typedLines = Math.floor(
    interpolate(frame, [3, 30], [0, VISIBLE_WINDOW], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const scrollOffset = Math.floor(
    interpolate(frame, [30, 100], [0, totalLines - VISIBLE_WINDOW], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    })
  );
  const visibleStart = scrollOffset;
  const visibleEnd = Math.min(visibleStart + typedLines, totalLines);

  const codeScale = interpolate(frame, [102, 135], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const codeMoveY = interpolate(frame, [102, 135], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const locCounterOpacity = interpolate(frame, [30, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const runningLoc = Math.round(
    interpolate(frame, [30, 100], [1, TOTAL_LOC], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );
  const locLabelOpacity = interpolate(frame, [98, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const locSize = interpolate(frame, [30, 100, 102, 135], [36, 48, 48, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const locMoveToCenter = interpolate(frame, [102, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const xScale = interpolate(frame, [133, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2.5)),
  });
  const xRotate = interpolate(frame, [133, 148], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(frame, [155, 163], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const locX = interpolate(locMoveToCenter, [0, 1], [CX + 160, CX - 90]);
  const locY = interpolate(locMoveToCenter, [0, 1], [620, CY - 40]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: codeOpacity * fadeOut }}>
      {/* Code block — shrinks upward */}
      <div
        style={{
          position: "absolute",
          left: CX - 520,
          top: 100 + codeMoveY,
          transform: `scale(${codeScale})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            background: "#1E1E1E",
            borderRadius: 14,
            border: "1px solid rgba(60,60,60,0.6)",
            padding: "20px 28px",
            minWidth: 1030,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ borderBottom: "1px solid #333", paddingBottom: 10, marginBottom: 14, fontSize: 17, color: "#888", fontFamily: THEME.fonts.mono }}>
            immaTensorCoreGemm.cu
          </div>
          {CODE_LINES_P1.slice(visibleStart, visibleEnd).map((line, i) => (
            <div
              key={visibleStart + i}
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 20,
                lineHeight: "31px",
                color: colorCodeLine(line),
                whiteSpace: "pre",
              }}
            >
              <span style={{ color: "#858585", marginRight: 18, userSelect: "none", display: "inline-block", width: 32, textAlign: "right" }}>
                {visibleStart + i + 1}
              </span>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* LOC counter — starts during scroll, enlarges with code shrink */}
      <div
        style={{
          position: "absolute",
          left: locX,
          top: locY,
          opacity: locCounterOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span style={{
          fontFamily: THEME.fonts.mono,
          fontSize: locSize,
          fontWeight: 800,
          color: THEME.colors.textSecondary,
          lineHeight: 1,
        }}>
          {runningLoc}
        </span>
        <span style={{
          fontFamily: THEME.fonts.mono,
          fontSize: locSize * 0.35,
          color: THEME.colors.textMuted,
          opacity: locLabelOpacity,
        }}>
          lines
        </span>
      </div>

      {/* ✕ stamps on the LOC number */}
      <div
        style={{
          position: "absolute",
          left: locX - 20,
          top: locY - 30,
          opacity: xScale,
          transform: `scale(${xScale}) rotate(${xRotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        <span
          style={{
            fontSize: locSize * 1.2,
            color: THEME.colors.danger,
            fontWeight: 300,
            lineHeight: 1,
            textShadow: "0 0 40px rgba(248,113,113,0.5)",
          }}
        >
          ✕
        </span>
      </div>
    </div>
  );
};

/* ── Phase 2: Iterative cycle ring (166–554f) ── */
const STAGES = [
  { label: "Code", icon: "{ }", color: "#60A5FA" },
  { label: "Debug", icon: "!!", color: "#F87171" },
  { label: "Profile", icon: "▶", color: "#FBBF24" },
  { label: "Tune", icon: "⚙", color: "#34D399" },
];

const _RING_RADIUS = 260;

const CODE_FLASHES = [
  "cp.async.cg.shared [smem], [src], 16;",
  "wmma::mma_sync(c, a, b, c);",
  "__syncthreads();",
  "atomicAdd(&output[idx], val);",
];
const DEBUG_ERRORS = [
  "✕ CUDA error: illegal memory access",
  "✕ Shape mismatch: [64,64] vs [64,128]",
  "✕ DMA buffer overflow at line 187",
  "✕ Bank conflict: 32-way on smem",
];
const PROFILE_NUMS = ["312 TFLOPS", "387 TFLOPS", "421 TFLOPS", "398 TFLOPS"];
const TUNE_PATTERNS = ["TILE_K: 64→128", "WARP_M: 4→8", "PIPELINE: 2→3", "SWIZZLE: 128B"];

function flashItemOpacity(frame: number, idx: number, startFrame: number): number {
  const cycle = 60;
  const offset = idx * 15;
  const local = ((frame - startFrame + offset) % cycle + cycle) % cycle;
  return interpolate(local, [0, 3, 18, 26], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const RING_CX = 460;
const RING_CY = CY + 10;

const PERF_DATA = [
  0.10, 0.18, 0.28, 0.35, 0.42, 0.48, 0.55, 0.60, 0.66, 0.71, 0.76, 0.80,
];

const IterationCycle: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [360, 388], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(frame, [50, 388], [0, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.05, 0.3, 1),
  });

  const iterationCount = Math.floor(
    interpolate(frame, [50, 360], [1, 12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const showFlashes = frame > 50 && frame < 388;

  const ringRadius = 200;
  const nodePositions = STAGES.map((_, i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    return { x: RING_CX + Math.cos(angle) * ringRadius, y: RING_CY + Math.sin(angle) * ringRadius };
  });

  const chartLeft = 900;
  const chartTop = 135;
  const chartW = 690;
  const chartH = 550;
  const chartOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const visiblePoints = Math.min(iterationCount, PERF_DATA.length);
  const pathPoints = PERF_DATA.slice(0, visiblePoints).map((v, i) => {
    const px = (i / (PERF_DATA.length - 1)) * chartW;
    const py = chartH - v * chartH;
    return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(" ");

  const lastPoint = visiblePoints > 0 ? {
    x: ((visiblePoints - 1) / (PERF_DATA.length - 1)) * chartW,
    y: chartH - PERF_DATA[visiblePoints - 1] * chartH,
  } : null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut, zIndex: 3 }}>
      {/* Ring circle -- left side */}
      <div
        style={{
          position: "absolute",
          left: RING_CX - ringRadius,
          top: RING_CY - ringRadius,
          width: ringRadius * 2,
          height: ringRadius * 2,
          borderRadius: "50%",
          border: "2px solid rgba(110,231,183,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RING_CX - ringRadius - 5,
          top: RING_CY - ringRadius - 5,
          width: ringRadius * 2 + 10,
          height: ringRadius * 2 + 10,
          borderRadius: "50%",
          border: "4px solid transparent",
          borderTopColor: THEME.colors.primary,
          borderRightColor: "rgba(110,231,183,0.25)",
          transform: `rotate(${rotation}deg)`,
          filter: "drop-shadow(0 0 8px rgba(110,231,183,0.3))",
        }}
      />

      {/* Stage nodes */}
      {STAGES.map((stage, i) => {
        const pos = nodePositions[i];
        const nodeEntry = interpolate(frame, [8 + i * 8, 28 + i * 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isActive = Math.floor(((rotation % 360) + 360) % 360 / 90) === i;
        return (
          <div key={stage.label} style={{
            position: "absolute",
            left: pos.x - 52, top: pos.y - 52,
            width: 104, height: 104,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            opacity: nodeEntry,
            transform: `scale(${isActive ? 1.15 : 1})`,
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: 16,
              background: `${stage.color}18`, border: `2px solid ${stage.color}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isActive ? `0 0 28px ${stage.color}40` : "none",
            }}>
              <span style={{ fontSize: 32, color: stage.color }}>{stage.icon}</span>
            </div>
            <span style={{
              marginTop: 6, fontSize: 22, fontFamily: THEME.fonts.mono,
              color: stage.color, fontWeight: 700, letterSpacing: "0.04em",
            }}>
              {stage.label}
            </span>
          </div>
        );
      })}

      {/* Iteration counter -- center of ring */}
      <div style={{ position: "absolute", left: RING_CX - 60, top: RING_CY - 36, width: 120, textAlign: "center" }}>
        <span style={{ fontSize: 64, fontWeight: 800, fontFamily: THEME.fonts.mono, color: THEME.colors.textPrimary }}>
          {iterationCount}
        </span>
        <div style={{ fontSize: 18, color: THEME.colors.textMuted, fontFamily: THEME.fonts.mono, letterSpacing: "0.12em", marginTop: 4 }}>
          ITERATION
        </div>
      </div>

      {/* ── Performance curve chart -- right side ── */}
      <div style={{
        position: "absolute", left: chartLeft, top: chartTop,
        width: chartW + 60, height: chartH + 80,
        opacity: chartOpacity,
      }}>
        {/* Chart title */}
        <div style={{
          fontSize: 28, fontFamily: THEME.fonts.mono, color: THEME.colors.textSecondary,
          fontWeight: 700, marginBottom: 16, letterSpacing: "0.06em",
        }}>
          Tuning Performance
        </div>

        <svg width={chartW + 60} height={chartH + 60} style={{ overflow: "visible" }}>
          {/* Y-axis */}
          <line x1={45} y1={0} x2={45} y2={chartH} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={0} y={14} fill={THEME.colors.textMuted} fontSize={20} fontFamily={THEME.fonts.mono}>100%</text>
          <text x={0} y={chartH / 2 + 6} fill={THEME.colors.textMuted} fontSize={20} fontFamily={THEME.fonts.mono}>50%</text>
          <text x={18} y={chartH + 6} fill={THEME.colors.textMuted} fontSize={20} fontFamily={THEME.fonts.mono}>0</text>
          {/* Y-axis label */}
          <text x={-chartH / 2} y={-8} fill={THEME.colors.textMuted} fontSize={20} fontFamily={THEME.fonts.mono}
            transform="rotate(-90)" textAnchor="middle">
            % cuBLAS
          </text>

          {/* X-axis */}
          <line x1={45} y1={chartH} x2={45 + chartW} y2={chartH} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={45 + chartW / 2} y={chartH + 40} fill={THEME.colors.textMuted} fontSize={20}
            fontFamily={THEME.fonts.mono} textAnchor="middle">
            Iteration
          </text>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((v) => (
            <line key={v} x1={45} y1={chartH - v * chartH} x2={45 + chartW} y2={chartH - v * chartH}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4,6" />
          ))}

          {/* Performance curve */}
          <g transform="translate(45, 0)">
            {pathPoints && (
              <path d={pathPoints} fill="none" stroke={THEME.colors.primary} strokeWidth={4}
                strokeLinecap="round" strokeLinejoin="round"
                filter="drop-shadow(0 0 8px rgba(110,231,183,0.4))" />
            )}
            {/* Animated dot at current point */}
            {lastPoint && (
              <circle cx={lastPoint.x} cy={lastPoint.y} r={8}
                fill={THEME.colors.primary} stroke="#0A0E1A" strokeWidth={3}
                filter="drop-shadow(0 0 10px rgba(110,231,183,0.6))" />
            )}
            {/* Data points */}
            {PERF_DATA.slice(0, visiblePoints).map((v, i) => (
              <circle key={i}
                cx={(i / (PERF_DATA.length - 1)) * chartW}
                cy={chartH - v * chartH}
                r={4} fill={THEME.colors.primary} opacity={0.6} />
            ))}
          </g>

          {/* Current perf label */}
          {lastPoint && visiblePoints > 0 && (
            <text
              x={45 + lastPoint.x + 14} y={lastPoint.y - 12}
              fill={THEME.colors.primary} fontSize={26} fontWeight={700} fontFamily={THEME.fonts.mono}>
              {Math.round(PERF_DATA[visiblePoints - 1] * 100)}%
            </text>
          )}
        </svg>
      </div>

      {/* Contextual flashes near each node (repositioned for left layout) */}
      {showFlashes && (
        <>
          {CODE_FLASHES.map((code, ci) => (
            <div key={`code-${ci}`} style={{
              position: "absolute",
              left: nodePositions[0].x - 180 + ci * 25,
              top: nodePositions[0].y - 90 - ci * 28,
              opacity: flashItemOpacity(frame, ci, 50),
              fontSize: 18, fontFamily: THEME.fonts.mono, color: "#9CDCFE",
              whiteSpace: "nowrap",
              background: "rgba(30,30,30,0.8)", borderRadius: 6, padding: "3px 10px",
            }}>
              {code}
            </div>
          ))}
          {DEBUG_ERRORS.map((err, di) => (
            <div key={`debug-${di}`} style={{
              position: "absolute",
              left: nodePositions[1].x + 55,
              top: nodePositions[1].y - 35 + di * 32,
              opacity: flashItemOpacity(frame, di, 60),
              fontSize: 18, fontFamily: THEME.fonts.mono, color: THEME.colors.danger,
              whiteSpace: "nowrap",
              background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 6, padding: "3px 10px",
            }}>
              {err}
            </div>
          ))}
          {PROFILE_NUMS.map((num, pi) => (
            <div key={`prof-${pi}`} style={{
              position: "absolute",
              left: nodePositions[2].x - 70 + pi * 25,
              top: nodePositions[2].y + 55 + pi * 30,
              opacity: flashItemOpacity(frame, pi, 70),
              fontSize: 22, fontFamily: THEME.fonts.mono, color: THEME.colors.accentWarm,
              fontWeight: 600, whiteSpace: "nowrap",
            }}>
              {num}
            </div>
          ))}
          {TUNE_PATTERNS.map((pat, ti) => (
            <div key={`tune-${ti}`} style={{
              position: "absolute",
              left: Math.max(10, nodePositions[3].x - 190),
              top: nodePositions[3].y - 30 + ti * 32,
              opacity: flashItemOpacity(frame, ti, 80),
              fontSize: 18, fontFamily: THEME.fonts.mono, color: THEME.colors.primary,
              whiteSpace: "nowrap",
              background: "rgba(110,231,183,0.06)", borderRadius: 6, padding: "3px 10px",
            }}>
              {pat}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

/* ── Phase 3: Three barrier keywords (557–845f, relative: 0–288f) ── */
const BarrierKeywords: React.FC = () => {
  const frame = useCurrentFrame();

  const barriers = [
    {
      label: "Programming Skills",
      icon: "</>",
      x: 200, y: 250,
      entryStart: 0, entryEnd: 40,
    },
    {
      label: "Hardware Knowledge",
      icon: "GPU",
      x: 1200, y: 250,
      entryStart: 80, entryEnd: 120,
    },
    {
      label: "Optimization Experience",
      icon: "perf",
      x: CX - 220, y: 520,
      entryStart: 170, entryEnd: 210,
    },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
      {barriers.map((b, i) => {
        const entryProgress = interpolate(frame, [b.entryStart, b.entryEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(frame, [b.entryStart, b.entryEnd], [0.7, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.5)),
        });
        const glowPulse = 0.2 + Math.sin((frame - b.entryEnd) * 0.08) * 0.1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              opacity: entryProgress,
              transform: `scale(${scale})`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{
              fontSize: 28, fontFamily: THEME.fonts.mono, color: THEME.colors.primary,
              background: "rgba(110,231,183,0.12)", border: "2px solid rgba(110,231,183,0.3)",
              borderRadius: 10, padding: "8px 14px", fontWeight: 700,
            }}>{b.icon}</span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.accentWarm,
                textShadow: `0 0 ${20 + glowPulse * 40}px rgba(251,191,36,${glowPulse})`,
              }}
            >
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Phase 4: Barriers converge (848–991f, relative: 0–143f) ── */
const BarriersConverge: React.FC = () => {
  const frame = useCurrentFrame();

  const convergeProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const barriersScale = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const pulseGlow = Math.sin(frame * 0.12) * 0.3 + 0.7;

  const arrowOpacity = interpolate(frame, [70, 90], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [120, 143], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const keywords = [
    { label: "Programming Skills", icon: "</>", startX: 200, startY: 250 },
    { label: "Hardware Knowledge", icon: "GPU", startX: 1200, startY: 250 },
    { label: "Optimization Experience", icon: "perf", startX: CX - 220, startY: 520 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut, zIndex: 7 }}>
      {/* Converging keywords */}
      {keywords.map((kw, i) => {
        const x = interpolate(convergeProgress, [0, 1], [kw.startX, CX - 100]);
        const y = interpolate(convergeProgress, [0, 1], [kw.startY, CY - 60 + i * 5]);
        const kwOpacity = interpolate(convergeProgress, [0.6, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: kwOpacity,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{
              fontSize: 28, fontFamily: THEME.fonts.mono, color: THEME.colors.primary,
              background: "rgba(110,231,183,0.12)", border: "2px solid rgba(110,231,183,0.3)",
              borderRadius: 10, padding: "8px 14px", fontWeight: 700,
            }}>{kw.icon}</span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.accentWarm,
              }}
            >
              {kw.label}
            </span>
          </div>
        );
      })}

      {/* Development Efficiency text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY - 50,
          textAlign: "center",
          opacity: barriersScale,
          transform: `scale(${barriersScale})`,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: THEME.fonts.sans,
            color: THEME.colors.primary,
            letterSpacing: "0.06em",
            textShadow: `0 0 ${pulseGlow * 40}px rgba(110,231,183,${pulseGlow * 0.5})`,
          }}
        >
          Development Efficiency
        </span>
      </div>

      {/* Efficiency arrow */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 50,
          textAlign: "center",
          opacity: arrowOpacity,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontFamily: THEME.fonts.mono,
            color: THEME.colors.textMuted,
            letterSpacing: "0.05em",
          }}
        >
          Programming + Hardware + Optimization = Efficiency
        </span>
      </div>
    </div>
  );
};

/* ── Phase 5: CroqTile logo reveal (994–1393f, relative: 0–399f) ── */
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 0.6,
    to: 1,
  });
  const logoOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowSize = interpolate(frame, [50, 100, 150, 200], [0, 48, 32, 40], {
    extrapolateRight: "clamp",
  });

  const taglineWords = ["5× Productivity.", "AI-native."];
  const taglineStart = 66;

  const subtitleOpacity = interpolate(frame, [126, 156], [0, 1], {
    extrapolateRight: "clamp",
  });

  const endFade = interpolate(frame, [379, 399], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        opacity: bgOpacity * endFade,
        zIndex: 15,
      }}
    >
      {/* Mascot Logo + Brand */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500 + glowSize * 2,
            height: 500 + glowSize * 2,
            borderRadius: THEME.radius.full,
            background: THEME.colors.primaryGlow,
            filter: `blur(${glowSize * 1.5}px)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />
        <Img
          src={staticFile("logo-mascot-sm.png")}
          style={{
            width: 480,
            height: 480,
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
          }}
        />
        <span
          style={{
            fontSize: THEME.fontSize["4xl"],
            fontWeight: 800,
            color: THEME.colors.textPrimary,
            letterSpacing: "-0.03em",
            position: "relative",
            zIndex: 1,
            marginTop: -10,
          }}
        >
          Croq<span style={{ color: THEME.colors.primary }}>Tile</span>
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          gap: 12,
          fontSize: THEME.fontSize.xl,
          fontWeight: 500,
          color: THEME.colors.textSecondary,
          zIndex: 1,
        }}
      >
        {taglineWords.map((word, i) => {
          const wordStart = taglineStart + i * 15;
          const opacity = interpolate(frame, [wordStart, wordStart + 10], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const y = interpolate(frame, [wordStart, wordStart + 15], [12, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          return (
            <span
              key={word}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                color: i === 0 ? THEME.colors.primary : THEME.colors.textPrimary,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <p
        style={{
          opacity: subtitleOpacity,
          fontSize: THEME.fontSize.base,
          color: THEME.colors.textMuted,
          margin: 0,
          fontFamily: THEME.fonts.mono,
          letterSpacing: "0.05em",
          zIndex: 1,
        }}
      >
        The next-gen GPU & DSA kernel programming language
      </p>
    </AbsoluteFill>
  );
};

/* ── Main composition ───────────────────────────── */
export const IterativeDev: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ background: THEME.colors.bgBase, fontFamily: THEME.fonts.sans }}
    >
      <NoiseOverlay opacity={0.03} />

      {/* Phase 1: Code intro (0–163f) */}
      <Sequence from={0} durationInFrames={164}>
        <CodeIntro />
      </Sequence>

      {/* Phase 2: Iterative cycle (166–554f) */}
      <Sequence from={166} durationInFrames={389}>
        <IterationCycle />
      </Sequence>

      {/* Phase 3: Barrier keywords (557–846f) */}
      <Sequence from={557} durationInFrames={289}>
        <BarrierKeywords />
      </Sequence>

      {/* Phase 4: Skills converge → Development Efficiency (846–993f) */}
      <Sequence from={846} durationInFrames={148}>
        <BarriersConverge />
      </Sequence>

      {/* Phase 5: CroqTile logo reveal (994–1393f) */}
      <Sequence from={994} durationInFrames={399}>
        <LogoReveal />
      </Sequence>
    </AbsoluteFill>
  );
};
