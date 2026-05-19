# Seg 6 — Born for Agentic AI Programming

## Status: script-redesign-in-progress

## Content Direction (aligned with slides Chapter 4)
- **6A**: AI-native intro — designed for agentic AI from day one
- **6B**: AI tuning convergence benchmarks — matmul FP16 486 TFLOPS (115% cuBLAS), blockscale 711 TFLOPS (155%, 6 iters), SPMM 84% win rate +16.7%
- **6C**: Why CroqTile fits AI — Lowest Token Footprint (303 vs 2350 CUTLASS), 5x iterations, single code change site
- **6D**: Compiler message as guardrail — CUDA runtime errors vs CroqTile compile-time diagnosis, 353 compile checks, 3-8s vs 30-90s per iteration
- **6E**: AI enhancement layers — unified profiler CLI + CroqTile Skills
- **6F**: Real results — autonomous structural changes, 671→1127 TFLOPS convergence, new upstream AI paradigm

## Timeline
- Absolute start frame: 5772
- Duration: 4650 frames (155s)
- Absolute end frame: 10421

## Sub-segments (18 cues across 6 sub-segments)
| Sub | Abs Start | Rel Start | Content |
|-----|-----------|-----------|---------|
| 6A | 5772 | 0 | AI-native intro (2 cues) |
| 6B | ~6222 | ~450 | AI tuning convergence results (3 cues) |
| 6C | ~6972 | ~1200 | Token footprint + change sites (3 cues) |
| 6D | ~7722 | ~1950 | Compiler guardrails vs CUDA (3 cues) |
| 6E | ~8472 | ~2700 | Profiler CLI + Skills (3 cues) |
| 6F | ~9372 | ~3600 | Results + new paradigm (4 cues) |

## Script Updated
- [x] Subtitles rewritten to match slides Chapter 4
- [ ] Voiceover re-generation needed (CN+EN, 18 cues)
- [ ] Animation redesign needed (AINative.tsx)
- [ ] User review pending
