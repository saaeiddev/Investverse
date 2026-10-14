# Investverse educational content and source notes

Reviewed on **14 October 2026**. The bilingual learning content is in `src/data/investments.ts`. English and Persian are concise editorial paraphrases of the primary sources below, not quotations or translations of entire publications.

## Scope

Investverse explains investment mechanisms and trade-offs. It does not recommend a product, calculate a user's suitability, promise a return, present a market feed, or offer transaction execution. Category examples describe types of assets rather than named investments. Entry requirements are qualitative because product minimums, access and costs differ. No live or historical returns are supplied by this dataset.

The sources are from US regulators, a US self-regulatory organization, and the Australian securities regulator's consumer education service. They support general mechanics. Their legal rules, tax treatment, access conditions and investor protections must **not** be presented as universally applicable or as Iranian law. Persian localization does not make the content jurisdiction-specific.

Specific limits, tax concessions and regulatory eligibility thresholds have deliberately not been carried into the interface. US FDIC protection is an example of a jurisdiction-specific deposit insurance scheme, not coverage for every bank in every country. A fund, bond, cryptocurrency or other investment sold by a bank is not thereby an insured bank deposit.

## Interpreting the comparison scores

The 1–5 scores are editorial teaching aids, **not observed statistics, regulated ratings, probabilities, performance estimates or personal recommendations**. Display `scoreNotes` alongside comparisons and `categoryScoreNotes[id]` with a selected category. Higher means greater risk, easier liquidity, or greater complexity, depending on the dimension. A higher liquidity score is not a claim of guaranteed access.

| Category | Risk / liquidity / complexity | Illustration used |
| --- | --- | --- |
| Stocks | 4 / 4 / 3 | Ordinary listed shares with active trading, without borrowing |
| Real estate | 4 / 1 / 4 | Direct rental property; financing can amplify losses |
| Gold | 3 / 3 / 2 | Physical bullion without leverage or derivatives |
| Crypto assets | 5 / 3 / 5 | Direct holdings; token and platform liquidity can differ greatly |
| Bonds | 2 / 3 / 3 | Plain higher-credit-quality bonds of moderate maturity |
| ETFs | 3 / 4 / 2 | A diversified unleveraged portfolio, not every ETF |
| Bank savings | 1 / 5 / 1 | Accessible eligible deposits within applicable local insurance limits |
| Startups | 5 / 1 / 5 | Private early-stage equity with no assured exit |
| Mutual funds | 3 / 4 / 2 | An ordinary diversified open-end fund, not every fund |
| REITs | 4 / 4 / 3 | Listed equity REITs; non-traded and private REITs differ |

These judgments simplify multidimensional risks. The same category can contain products near either end of the scale. Scores must not be converted into expected returns, used to predict loss, or presented as universal asset rankings.

## Nuances preserved in the content

- **ETFs and mutual funds are structures.** Holdings, concentration, leverage and strategy determine their risks. A single-stock or leveraged ETF is unlike a broad unleveraged portfolio. The SEC ETF references concern registered investment-company ETFs; not every exchange-traded product has that structure.
- **Liquidity is not certainty.** Trading hours, halts, spreads, market stress, withdrawal rules and settlement can affect access. A continuously traded crypto asset can still be impossible to withdraw or sell.
- **Bonds are not deposits.** Credit risk remains; fixed-rate bond prices generally move inversely to market rates. A promised maturity payment is conditional on the issuer meeting its obligation. High-yield and long-duration bonds may differ greatly from the illustration.
- **Gold is not a guaranteed inflation hedge.** Physical gold has no inherent interest or dividend payment. Dealer spreads, authenticity, storage and insurance matter. A metal-linked exchange-traded product adds its own structure and fees.
- **Real estate has ongoing cash requirements.** Rental receipts are not profit: vacancy, repairs, financing and other expenses matter. Borrowing can amplify losses. Local property and tax rules are not generalized from Australian examples.
- **REITs differ by structure.** Listed property-owning REITs, mortgage REITs, non-traded public REITs and private REITs differ in risk and liquidity. Distributions can include capital returned to investors rather than operating income.
- **Startups may never provide an exit.** Failure, limited disclosure, dilution and contractual rights matter. Crowdfunding and private-placement access rules are country- and offering-specific.
- **Crypto ownership is not necessarily company ownership.** Token rights, custody and platform access must be understood separately. The older SEC and FINRA education pages are used for enduring product and custody risks, not as a statement of today's complete legal classification.
- **Nominal and real results differ.** The glossary defines real return as inflation-adjusted return and explicitly asks whether tax and fees are included; conventions vary. A longer horizon does not guarantee positive returns.

## Primary-source register

The IDs below are the stable IDs used by the application's `sources` and `sourceIds` exports. Links were retrieved for this work. Publication dates vary; retrieval does not imply a regulator has reviewed Investverse.

| Source ID | Primary source | Main use |
| --- | --- | --- |
| `sec-products` | [SEC Investor.gov — Investment Products](https://www.investor.gov/introduction-investing/investing-basics/investment-products) | General risk, fees, liquidity and product context |
| `sec-intro` | [SEC Investor.gov — Introduction to Investing](https://www.investor.gov/introduction-investing) | Saving versus investing, reserves and compound growth; numerical return examples were not reused |
| `sec-diversification` | [SEC Investor.gov — Asset Allocation, Diversification and Rebalancing](https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset) | Allocation, diversification, time horizon and rebalancing |
| `sec-stocks` | [SEC Investor.gov — Stocks](https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks) | Ownership, dividends, company loss and trading |
| `asic-property` | [ASIC Moneysmart — Buying an Investment Property](https://moneysmart.gov.au/property-investment/buying-an-investment-property) | Direct-property income, vacancy, leverage and costs |
| `asic-property-overview` | [ASIC Moneysmart — Property Investment](https://moneysmart.gov.au/property-investment) | Direct and indirect property distinctions |
| `cftc-gold` | [CFTC — Gold Is No Safe Investment](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/gold_is_no_safe_investment.htm) | Gold-price uncertainty and the limits of safety or inflation-hedge claims |
| `cftc-metals` | [CFTC — Precious Metal Frauds](https://www.cftc.gov/LearnAndProtect/metalsfrauds) | No inherent dividends or earnings; storage and transaction costs |
| `finra-metals` | [FINRA / CFTC — 10 Things to Ask Before Buying Physical Metals](https://syndication.finra.org/content/investor-bulletin-10-things-ask-buying-physical-gold-silver-or-other-metals) | Physical-metal premiums, buy-back spread, authenticity and custody |
| `sec-crypto` | [SEC Investor.gov — Exercise Caution with Crypto Asset Securities](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/crypto-asset-securities) | Volatility, platform failure, fraud and withdrawal risks |
| `finra-crypto-custody` | [FINRA — Storing and Securing Cryptocurrencies](https://syndication.finra.org/content/storing-and-securing-cryptocurrencies) | Private keys, digital transfer, custody and loss |
| `finra-ico` | [FINRA — Initial Coin Offerings and Digital Assets](https://syndication.finra.org/content/initial-coin-offerings-icos-what-know-now-and-time-tested-tips-investors) | Token rights, innovation exposure and speculative risks |
| `finra-crypto-platforms` | [FINRA — Cryptocurrency Trading Platforms](https://syndication.finra.org/content/cryptocurrency-trading-platforms-do-your-homework) | Trading versus actual access to assets |
| `sec-bonds` | [SEC Investor.gov — Bonds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds) | Debt instruments, credit, inflation and resale risks |
| `sec-bond-rates` | [SEC Investor.gov — Interest Rates and Fixed-Rate Bond Prices](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86) | Rate-price relationship and maturity sensitivity |
| `asic-bonds` | [ASIC Moneysmart — Bonds](https://moneysmart.gov.au/investments-paying-interest/bonds) | Coupon, maturity, credit quality and yield |
| `sec-etfs` | [SEC Investor.gov — Exchange-Traded Funds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2) | ETF holdings, prices, strategy and risk |
| `sec-fund-structure` | [SEC Investor.gov — Characteristics of Mutual Funds and ETFs](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/characteristics-mutual-funds-exchange-traded-funds) | Trading versus redemption, NAV and diversification limits |
| `sec-fund-fees` | [SEC Investor.gov — Mutual Fund and ETF Fees and Expenses](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin) | Expense ratios, transaction costs and fee tables |
| `fdic-insurance` | [FDIC — Understanding Deposit Insurance](https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance) | Eligible deposits versus uninsured investment products |
| `fdic-faq` | [FDIC — Deposit Insurance FAQs](https://www.fdic.gov/resources/deposit-insurance/faq) | Account and coverage distinctions |
| `asic-diversification` | [ASIC Moneysmart — Investment Diversification](https://moneysmart.gov.au/how-to-invest/investment-diversification) | Inflation on cash and spreading exposure |
| `sec-crowdfunding` | [SEC Investor.gov — Regulation Crowdfunding for Investors](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated-11) | Early-stage failure, limited disclosure, valuation and exit restrictions |
| `sec-private-placement` | [SEC Investor.gov — Private Placements under Regulation D](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/private-placements-under-regulation-d-updated-investor-bulletin) | Private-investment terms, information limits and indefinite holdings |
| `sec-mutual-funds` | [SEC Investor.gov — Mutual Funds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs/mutual-funds) | Pooled portfolios, management, redemption and income |
| `sec-reits` | [SEC Investor.gov — Real Estate Investment Trusts](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/real) | Property exposure and REIT structures |
| `sec-nontraded-reits` | [SEC Investor.gov — Non-traded REITs](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-89) | Illiquidity, fees and distributions funded from principal |
| `asic-property-funds` | [ASIC Moneysmart — Property Funds](https://moneysmart.gov.au/property-investment/property-funds) | Listed/unlisted property, borrowing and interest cover |
| `sec-glossary` | [SEC Investor.gov — Investing Glossary](https://www.investor.gov/introduction-investing/investing-basics/glossary) | Foundational terminology, alongside category sources |
| `sec-expense-ratio` | [SEC Investor.gov — Expense Ratio](https://www.investor.gov/introduction-investing/investing-basics/glossary/expense-ratio) | Operating expenses relative to net assets |
| `sec-nav` | [SEC Investor.gov — Net Asset Value](https://www.investor.gov/introduction-investing/investing-basics/glossary/net-asset-value) | Total and per-unit NAV |
| `sec-liquidity` | [SEC Investor.gov — Liquidity](https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability) | Ease of sale and liquidity risk |

## Localization and editorial conventions

Persian uses professional, plain phrasing and Unicode Persian characters. `funds` means ordinary open-end mutual funds, translated as «صندوق‌های صدور و ابطال» to distinguish them from the separately displayed exchange-traded category. `REIT` is localized by its broad economic role; local legal forms may differ. Bonds are described as debt instruments rather than being equated with every local sukuk or profit-sharing product. No claim of Sharia compliance is made.

The data exports `educationalNotice`, `scoreNotes`, `scoreLabels` and `categoryScoreNotes` for display, plus 30 glossary entries. New investment content should retain the same distinctions and be reviewed against primary sources before replacing this source log.
