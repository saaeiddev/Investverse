# Simulation definitions

All amounts and scenarios are fictional. No expected returns are assigned to an asset class.

## Allocation

Percentages are integers and sum to 100. When one asset changes, the remaining percentage is distributed across the other assets in proportion to their previous weights. Floors are assigned first, then leftover percentage points go to the largest fractional remainders. Ties follow category order. If every other weight was zero, the remainder is distributed evenly.

ETFs, mutual funds, stocks, bonds and REITs can overlap economically. This teaching model does not inspect underlying fund holdings. Presets illustrate mixes, not suitability or recommendations.

## Compound growth

Let annual return be `r`, annual proportional fee be `f`, annual inflation be `i`, and month-end contribution be `c`, all rates represented as decimals.

```
monthly_factor = ((1 + r) * (1 - f)) ** (1 / 12)
balance[m] = balance[m-1] * monthly_factor + c
real_value[m] = balance[m] / (1 + i) ** (m / 12)
contributions[m] = initial + c * m
gain_or_loss[m] = balance[m] - contributions[m]
```

The annual return is **effective**, not a nominal APR divided by 12. The fee is charged proportionally, so annual net return is `(1+r)*(1-f)-1`. Contributions are fixed nominal amounts made at **month end**, including the final month. A zero-return/no-fee case is handled by the recurrence and has no division-by-zero special case. Negative returns greater than −100% are supported.

Tax, variable rates, sequence-of-returns risk, transaction costs and varying contributions are not modeled. Inflation-adjusted value is in today's purchasing power. The 3D columns use sampled year-end results from this same calculation, normalized to a maximum height, and are illustrative rather than a separate forecast.

## Synthetic stress tests

`shocks` defines fictional percentage changes for each category. Users choose a scenario, a severity from 0 to 150%, exposure from 1× to 2× invested equity, an unhedged foreign share, and an FX move.

```
asset_shock[j] = max(-100, assumed_shock[j] * severity)
market_change = sum(weight[j] * asset_shock[j])
combined_change = ((1 + market_change/100)
                   * (1 + fx_change/100 * foreign_share/100) - 1)
                  * 100 * leverage
ending_equity = initial_equity * (1 + combined_change/100)
```

Individual unlevered holdings cannot fall below zero in this simplified model. Leveraged equity can become negative; it is intentionally not clamped to zero. The model ignores borrowing costs, margin calls, hedging, counterparty default and forced liquidation. FX is applied proportionally to the foreign share after the market shock. District scale depicts only the underlying asset shock, before leverage and FX.

Currency settings change the fictional unit label and formatting. They do **not** perform exchange-rate conversion.
