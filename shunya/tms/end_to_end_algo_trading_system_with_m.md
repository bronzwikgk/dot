# End-to-End Algo Trading System with m.Stock API
## Backtesting → Paper → Live Trading (Revised Complete Design & Specification)

---

## 1. Purpose

This document defines a **single, unified system design** for:

- Strategy research & backtesting
- Paper trading validation
- Live intraday algo trading

using **m.Stock API as the execution and market-data layer**, while **all intelligence, screening, and decision-making live outside the broker**.

The system is designed to be:
- Deterministic
- Reproducible
- Broker-agnostic in logic
- Identical across backtest and live

---

## 2. Core Principle (Critical)

> **m.Stock is NOT the brain.**

m.Stock provides:
- Market data (prices, candles)
- Order execution
- Position & order state

Your system provides:
- Screening
- Indicators
- State machines
- Risk logic
- Trade decisions

This separation is mandatory.

---

## 3. High-Level Architecture

```
Historical Data ──┐
                  │
Live Market Data ─┼──► Core Strategy Engine
(m.Stock API)     │        │
                  │        ▼
                  │   Decision State
                  │        │
                  └──► Execution Adapter (m.Stock)
                           │
                           ▼
                     Orders / Positions
```

---

## 4. Trading Lifecycle Overview

```
Backtest → Walk Forward → Paper Trade → Live Trade
```

Same rules. Same phases. Same data model.

---

## 5. Phase 0 – Environment & Risk Gate

### Inputs (from m.Stock / derived)
- Index opening price
- Gap size
- Early volatility

### Rules
- No trading first 15 minutes
- Skip extreme gap days without acceptance
- Daily max loss threshold

### Output
- `TRADE_DAY_ALLOWED`

---

## 6. Phase 1 – Index & Sector Momentum Engine

### Data Source
- Index OHLCV (5-min) from m.Stock
- Sector index OHLCV from m.Stock

### Trend Filter (Hard Gate)
- **Weekly VWAP** (computed internally)

Rules:
- Above Weekly VWAP → long-only bias
- Below Weekly VWAP → no longs
- Choppy around Weekly VWAP → NEUTRAL

### Intraday Confirmation
- Above intraday VWAP
- RSI 60–75
- MACD histogram expanding
- Volume expansion

### Output
- Allowed indices (STRONG / ACTIVE)
- Leading sectors

---

## 7. Phase 2 – Stock Screening Engine

### Data Source
- Stock OHLCV (5-min) via m.Stock

### Eligibility Rules
A stock is eligible ONLY IF:
- Belongs to allowed index
- Belongs to leading sector
- Above Weekly VWAP
- Above intraday VWAP
- RSI 65–78
- MACD histogram rising
- Volume ≥ 1.5× avg

### Output
- Dynamic intraday watchlist

---

## 8. Phase 3 – Trigger Candle Detection

### Trigger Definition (5-min candle)
- Bullish candle
- Body ≥ 65% of range
- Upper wick ≤ 25%
- Close > previous high
- Volume ≥ 1.5× avg

### Invalidations
- Candle size > 1.8%
- RSI > 78
- Long upper wick rejection

### Output
- `TRADE_SIGNAL`

---

## 9. Phase 4 – Execution via m.Stock API

### Order Placement
- Entry: market or tight limit near candle close
- Executed through m.Stock order endpoint

### Position Sizing
- Fixed capital risk per trade
- Quantity derived from stop distance

### Stop Loss
- Signal candle low OR
- Fixed 0.8–1% (whichever tighter)

### Target
- Fixed +2% OR
- Exit at next candle close

Orders are **tracked and enforced by your engine**, not the broker UI.

---

## 10. Phase 5 – Position Monitoring & Exit

### Data Source
- Live LTP from m.Stock

### Exit Conditions
- Target hit
- Stop loss hit
- Time-based exit
- Daily loss cap breached

### Post Exit
- Mark stock as cooling (no re-entry for X minutes)

---

## 11. Backtesting Design

### Data Requirements
- 5-min OHLCV (stocks, indices, sectors)
- Corporate action–adjusted data

### Backtest Rules
- Candle-close execution only
- Realistic slippage & fees
- Same stop/target logic as live

### Metrics
- Win rate
- Expectancy
- Max drawdown
- Trade duration
- Regime-wise performance

---

## 12. Walk-Forward Validation

- Segment data by market regime
- Tune parameters only on prior segments
- Validate on unseen data

---

## 13. Paper Trading Layer

### Purpose
Validate:
- API stability
- Timing correctness
- Order logic

Uses:
- Same m.Stock endpoints
- Zero capital risk

---

## 14. Live Trading Layer

### Safety Controls
- Max trades per day
- Max loss per day
- Kill switch
- Manual override

### Operational Rules
- No parameter changes intraday
- All trades logged

---

## 15. Data & State Management

### State Machine

```
IDLE → SCANNING → SIGNAL → IN_TRADE → EXITED → IDLE
```

No skipping states.

---

## 16. Logging & Audit Trail

Every event logged:
- Data snapshot
- Decision reason
- Order response
- Exit reason

Mandatory for trust & evolution.

---

## 17. Failure Modes & Protections

| Failure | Protection |
|------|-----------|
| API lag | Candle-close execution |
| False breakouts | Weekly VWAP gate |
| Overtrading | Cooldown rules |
| Volatility spikes | Candle size filter |

---

## 18. Deployment Checklist

- Backtest complete
- Walk-forward validated
- Paper trading stable
- Risk limits tested

Only then → LIVE.

---

## 19. Final System Summary

> **Strategy decides WHEN. m.Stock executes HOW. Discipline decides IF.**

This document defines a complete, broker-integrated yet broker-independent algo trading system suitable for professional deployment.

