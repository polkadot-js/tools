# CHANGELOG

## 0.34.1 May 17, 2021

Upgrade priority: Low.

Changes:

- The vanity generator now expects an `ss58Format` as part of the options
- Updated to `@polkadot/util` 6.4.1
- Updated to `@polkadot/api` 4.10.1


## 0.33.1 Apr 25, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.3.1
- Updated to `@polkadot/api` 4.7.1


## 0.32.1 Apr 19, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.2.1
- Updated to `@polkadot/api` 4.6.2


## 0.31.1 Apr 12, 2021

Upgrade priority: Low.

Contributed:

- Added option to skip tx wait (Thanks to https://github.com/andresilva)

Changes:

- Convert to ESM library publish (tools execution stays cjs)
- Updated to `@polkadot/util` 6.1.1
- Updated to `@polkadot/api` 4.5.1


## 0.30.1 Feb 22, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 5.9.2
- Updated to `@polkadot/api` 3.11.1


## 0.29.1 Feb 22, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 5.7.1
- Updated to `@polkadot/api` 3.10.1


## 0.28.1 Feb 7, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 5.6.1
- Updated to `@polkadot/api` 3.8.1


## 0.27.1 Feb 1, 2021

Upgrade priority: Medium contains types for future Kusama & Polkadot updates and fixes cli parsing.

Changes:

- Add prompt for the signing payout if not specified
- Fix JSON argument parsing on api-cli
- Don't parse hex into numbers in signer-cli
- Updated to `@polkadot/util` 5.5.1
- Updated to `@polkadot/api` 3.7.1


## 0.26.1 Jan 25, 2021

Upgrade priority: Medium. Contains all the types for the next Kusama & Polkadot updates.

Changes:

- Updated to `@polkadot/util` 5.4.4
- Updated to `@polkadot/api` 3.6.3


## 0.25.1 Dec 14, 2020

Upgrade priority: Low. Recommended for Substrate master users.

Changes:

- Build esm output alongside cjs
- Updated to `@polkadot/util` 5.0.1
- Updated to `@polkadot/api` 3.0.1


## 0.24.1 Dec 7, 2020

Upgrade priority: Low. Recommended for parachain users.

Changes:

- Added `--types` param to api-cli
- Cleanup `api-signer` to oly use the API signer interfaces (no manual construction)
- Updated to `@polkadot/util` 4.2.1
- Updated to `@polkadot/api` 2.10.1
- Use `import type` in all packages


## 0.23.1 Nov 9, 2020

Upgrade priority: Low.

Contributed:

- Expand metadata compare to cater for storage (Thanks to https://github.com/apopiak)

Changes:

- Display specVersion changes in metadata compare
- Use node unhandledRejection interfaces in all cli commands
- Fix usage of yargs (numbers on commandline) to cater for latest
- Updated to `@polkadot/{keyring, util, util-crypto}` 4.0.1
- Updated to `@polkadot/api` 2.6.1


## 0.22.1 Oct 5, 2020

Upgrade priority: Low.

Changes:

- Add `metadata-cmp` package to compare metadata between upgrades


## 0.21.1 Sep 28, 2020

Upgrade priority: Medium, latest Substrate support.

Changes:

- Bump to `@polkadot/api` 2.0.1
- Bump to `@polkadot/util` 3.5.1


## 0.20.1 Aug 31, 2020

Upgrade priority: Medium if using `.at`-queries or Polkadot-related chains

Contributed:

- Hash payload for display, align with subkey (Thanks to https://github.com/cheme)

Changes:

- `@polkadot/api` 1.31.1
- `@polkadot/util` 3.4.1
- `@polkadot/wasm-crypto` 1.4.1


## 0.19.1 Aug 10, 2020

Upgrade priority: Low

Changes:

- `@polkadot/api` 1.28.1
- `@polkadot/util` 3.1.1
- `@polkadot/wasm-crypto` 1.3.1


## 0.18.1 Jul 27, 2020

Upgrade priority: Low

Changes:

- `@polkadot/api` 1.26.1
- `@polkadot/util` 3.0.1


## 0.17.1 Jul 21, 2020

Upgrade priority: Low

Changes:

- `@polkadot/api` 1.25.1
- `@polkadot/util` 2.18.1


## 0.16.2 Jul 3, 2020

Upgrade priority: Medium

Changes:

- Remove `strict()` from yargs, allowing "unknown" commands to follow


## 0.16.1 Jul 2, 2020

Contributed:

- Validate payload & seed formats before signing (Thanks to https://github.com/yjkimjunior)

Changes:

- `@polkadot/api` 1.22.1
- `@polkadot/util` 2.16.1


## 0.15.1 Jun 24, 2020

Changes:

- Support for latest Polkadot/Substrate types
- `@polkadot/api` 1.21.1
- `@polkadot/util` 2.15.1


## 0.14.1 Jun 16, 2020

Changes:

- Support for latest Polkadot/Substrate types
- `@polkadot/api` 1.19.1
- `@polkadot/util` 2.14.1


## 0.13.1 May 26, 2020

Changes:

- Polkadot CC1 support via API
- `@polkadot/api` 1.16.1
- `@polkadot/util` 2.11.1


## 0.12.1 May 14, 2020

Changes:

- `@polkadot/api` 1.14.1 including all latest types
- `@polkadot/util` 2.10.1


## 0.11.1 Apr 15, 2020

Contributed:

- Add vanitygen cli utility (moved from https://github.com/polkadot-js/apps)

Changes:

- Allow signer cli to use JSON params as inputs
- Swap to yarn 2 for this project
- `@polkadot/api 1.10`
- `@polkadot/util` 2.8


## 0.10.1 Feb 26, 2020

Contributed:

- Add support for file syntax for tx params (`@path`) to api-cli (Thanks to https://github.com/coriolinus)
- Add support for sudo txs (via `--sudo`) to api-cli (Thanks to https://github.com/coriolinus)
- Cleanup global install docs with correct argument order (Thanks to https://github.com/coriolinus)
- Allow passing signer tx params in file (Thanks to https://github.com/kwingram25)

Changes:

- Transaction submission output now is displayed in `.toHuman` format
- Update documentation for composite account support
- `@polkadot/api` 1.4.1
- `@polkadot/util` 2.5.1


## 0.9.1 Jan 30, 2020

Contributed:

- Allow for offline sending (Thanks to https://github.com/mzolkiewski)
- Fix readline imports (Thanks to https://github.com/joepetrowski)

Changes:

- `@polkadot/api` 1.0.1
- Add simple RPC query server


## 0.8.1 Nov 29, 2019

Contributed:

- Add option to specific longevity on cli-signer (Thanks to https://github.com/bison-brandon)
- Allow cli-api to submit objects for complex transactions (Thanks to https://github.com/benfen)

Changes:

- `@polkadot/api` 0.97.1
- Support for Kusama CC3
- Publish docker images directly from CI


## 0.7.1 Oct 25, 2019

Changes:

- `@polkadot/api` 0.95.1
- Support for Extrinsic v4 (i.e. as per Kusama)


## 0.6.1 Sep 10, 2019

Changes:

- `@polkadot/api` 0.91.1
- Add @polkadot/signer-cli tool


## 0.5.1 Aug 24, 2019

Changes:

- `@polkadot/api` 0.90.1
- Support for Kusama
- Updated api-cli examples to use sr25519 keys


## 0.4.1 Mar 29, 2019

Changes:

- `@polkadot/util` & `@polkadot/api` 0.75.1


## 0.3.1 Mar 28, 2019

Changes:

- Support sr25519 crypto
- Add docker image (and publish to https://cloud.docker.com/u/jacogr/repository/docker/jacogr/polkadot-js-tools)
- Bump upstream dependencies, including v2 & v3 metadata support via api


## 0.2.1 Mar 11, 2019

Changes:

- added api-cli for API queries via the command-line
- monotor-rpc `url` parameter renamed to `ws`


## 0.1.1 Dec 05, 2018

Changes:

- Initial
