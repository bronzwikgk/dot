# Algo Stock Trading Domain Requirements

## Purpose

The Algo Stock Trading domain defines how An App can model, test, validate,
audit, and monitor algorithmic stock-trading strategies.

This domain is for research, simulation, backtesting, reporting, and governed
strategy development. Live trading is explicitly outside V1 unless a later
policy approves it.

## Core Entities

- trading_workspace
- market_data_source
- symbol
- timeframe
- market_bar
- feature
- derived_feature
- indicator
- signal
- rule
- strategy
- strategy_version
- backtest
- walk_forward_test
- paper_trade_run
- trade
- position
- order
- risk_rule
- portfolio
- benchmark
- regime
- finding
- experiment
- report
- dashboard
- audit_record

## Business Use Cases

- create trading research workspace
- import market data
- define symbols, timeframes, and data sources
- create indicators and derived features
- create rules and strategies
- create strategy versions
- run backtests
- run walk-forward validation
- compare strategies and versions
- detect market regimes
- validate hypotheses
- mine candidate expressions through templates
- stage candidate rules before promotion
- generate performance reports
- monitor risk, drawdown, latency, and validation results

## Pipelines

### Data Intake Pipeline

1. ingest market data
2. normalize OHLCV records
3. validate symbol, timeframe, date order, missing bars, and duplicates
4. calculate derived features
5. persist data quality report
6. audit source and transformation

### Strategy Creation Pipeline

1. ingest strategy description
2. parse rules, signals, filters, and risk constraints
3. build strategy tree and DAG
4. validate schema and approved operators
5. create strategy and version entities
6. stage untested rules as hypotheses
7. persist audit record

### Backtest Pipeline

1. load strategy version
2. load market data
3. validate dependencies
4. run strategy over bars
5. create trades and positions
6. calculate metrics
7. create findings
8. compose report
9. persist run audit

### Walk-Forward Pipeline

1. split data chronologically
2. train or select parameters on in-sample window
3. test on out-of-sample window
4. aggregate window results
5. detect unstable strategies
6. create acceptance/rejection findings
7. persist report and audit

## UI Requirements

Required layouts:

- notebook
- table_view
- chart_view
- dashboard
- workflow_canvas
- timeline_view
- document_view
- code_editor
- experiment workspace

Required surfaces:

- market data table
- chart panel
- linked chart panels
- strategy editor
- rule tree
- expression builder
- backtest report
- trade list
- equity curve
- drawdown chart
- metric dashboard
- findings panel
- version comparison
- audit panel

## Validation Requirements

Validation must check:

- data source provenance
- symbol validity
- timeframe validity
- OHLCV field completeness
- date order
- duplicate bars
- missing bars
- numeric precision
- indicator parameters
- rule operators
- strategy dependencies
- lookahead bias
- train/test separation
- risk limits
- benchmark references
- report metric formulas

## Metrics

Required metrics:

- total_return
- annualized_return
- win_rate
- profit_factor
- sharpe_ratio
- sortino_ratio
- calmar_ratio
- maximum_drawdown
- expectancy
- average_win
- average_loss
- trade_count
- exposure
- turnover
- slippage
- commission
- latency

## Contracts

Every market bar should include:

- `id`
- `symbol`
- `timeframe`
- `timestamp`
- `open`
- `high`
- `low`
- `close`
- `volume`
- `source_ref`
- `validation_status`

Every strategy should include:

- `id`
- `name`
- `version`
- `rule_refs`
- `signal_refs`
- `risk_rule_refs`
- `data_requirements`
- `status`
- `evidence_refs`
- `audit_ref`

Every backtest should include:

- `id`
- `strategy_version_ref`
- `market_data_refs`
- `date_range`
- `config`
- `trade_refs`
- `metric_refs`
- `finding_refs`
- `status`
- `audit_ref`

Every trade should include:

- `id`
- `backtest_ref`
- `symbol`
- `side`
- `entry_time`
- `entry_price`
- `exit_time`
- `exit_price`
- `quantity`
- `fees`
- `slippage`
- `pnl`
- `rule_refs`

## Dataset Needs

- trading_entity_names
- market_data_field_names
- timeframe_names
- order_side_names
- order_type_names
- position_status_names
- trade_status_names
- strategy_status_names
- indicator_type_names
- signal_type_names
- rule_operator_names
- regime_type_names
- backtest_metric_names
- risk_metric_names
- data_quality_issue_names
- validation_failure_reason_names

## Templates

Starter templates should include:

- trading research workspace template
- market data intake template
- indicator research template
- rule strategy template
- backtest template
- walk-forward validation template
- strategy comparison template
- risk dashboard template
- performance report template

## Non-Goals

This domain should not:

- execute live trades in V1
- connect to broker accounts without explicit future policy
- promote untested rules
- hide losing or failed runs
- use fabricated benchmark results
- allow lookahead bias
- bypass risk rules

## Minimum Complete V1

Minimum V1 should support:

- create one trading workspace
- import one market dataset
- create one strategy
- create one strategy version
- run one backtest
- calculate core metrics
- create findings
- compare two strategy versions
- render chart and dashboard views
- write audit record
