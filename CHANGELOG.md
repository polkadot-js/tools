# CHANGELOG

## 0.63.13 July 30, 2025

Changes:
- Updated polkadot deps([#624](https://github.com/polkadot-js/tools/pull/624))


## 0.63.12 July 15, 2025

Changes:
- Updated polkadot deps([#622](https://github.com/polkadot-js/tools/pull/622))


## 0.63.11 July 2, 2025

Changes:
- Updated polkadot deps([#620](https://github.com/polkadot-js/tools/pull/620))


## 0.63.10 June 18, 2025

Changes:
- Updated polkadot deps([#617](https://github.com/polkadot-js/tools/pull/617))
- Rebuild yarn.lock ([#618](https://github.com/polkadot-js/tools/pull/618))


## 0.63.9 June 5, 2025

Changes:
- Updated polkadot deps([#615](https://github.com/polkadot-js/tools/pull/615))


## 0.63.8 May 28, 2025

Changes:
- Updated polkadot deps([#612](https://github.com/polkadot-js/tools/pull/612))


## 0.63.7 May 14, 2025

Changes:
- Updated polkadot deps([#610](https://github.com/polkadot-js/tools/pull/610))


## 0.63.6 Apr 17, 2025

Changes:
- Updated polkadot deps([#608](https://github.com/polkadot-js/tools/pull/608))
  

## 0.63.5 Apr 2, 2025

Changes:
- Bump @polkadot deps([#606](https://github.com/polkadot-js/tools/pull/606))
  

## 0.63.4 Mar 21, 2025

Changes:
- Bump @polkadot deps([#604](https://github.com/polkadot-js/tools/pull/604))
  

## 0.63.3 Mar 4, 2025

Changes:
- Bump polkadotJS deps([#602](https://github.com/polkadot-js/tools/pull/602)) 


## 0.63.2 Feb 18, 2025

Changes:
- Bump polkadotJS deps([#600](https://github.com/polkadot-js/tools/pull/600)):
  - api to 15.6.1
  - common to 13.4.3


## 0.63.1 Feb 4, 2025

Breaking Changes:

- Set metadata cli to use v15, and add --legacy flag ([#597](https://github.com/polkadot-js/tools/pull/597))

  **NOTE**: This change adjusts the internal usage of RPC calls. If your chain does not support v15 you will have to use --legacy flag to have support for v14.

Changes:
- Bump polkadotJS deps to 15.4.5.2 ([#598](https://github.com/polkadot-js/tools/pull/598))


## 0.62.2 Jan 21, 2025

Changes:

- Bump api to 15.4.1 ([#594](https://github.com/polkadot-js/tools/pull/594))
- Bump dev to 0.83.2 ([#593](https://github.com/polkadot-js/tools/pull/593))


## 0.62.1 Jan 7, 2025

Changes:

- Upgrade api to 15.2.1, and common to 13.3.1 ([#590](https://github.com/polkadot-js/tools/pull/590))
    - Ensures compatibility with NodeJS v22.12
- Bump dev w/ @types ([#591](https://github.com/polkadot-js/tools/pull/591))


## 0.61.2 Jan 1, 2025

Changes:

- Bump yarn to 4.6.0 ([#583](https://github.com/polkadot-js/tools/pull/583))
- Upgrade polkadot api, and dev ([#584](https://github.com/polkadot-js/tools/pull/584))
- Update Headers to 2025 ([#587](https://github.com/polkadot-js/tools/pull/587))


## 0.61.1 Dec 2, 2024

Changes:

- Bump yarn to 4.5.3 ([#581](https://github.com/polkadot-js/tools/pull/581))
- Upgrade polkadot-js/api to 15.0.1 ([#580](https://github.com/polkadot-js/tools/pull/580))
    - Contains breaking changes where the signer can now modify the payload call data. This only affects the signer-cli.


## 0.60.3 Nov 11, 2024

Changes:

- Bump dev to 0.82.1 w/ tslib ([#577](https://github.com/polkadot-js/tools/pull/577))
- Upgrade common to 13.2.3 and api to 14.3.1 ([#578](https://github.com/polkadot-js/tools/pull/578))


## 0.60.2 Oct 30, 2024

Changes:

- Upgrade common to 13.2.2, and api to 14.2.1 ([#575](https://github.com/polkadot-js/tools/pull/575))


## 0.60.1 Oct 22, 2024

Changes:

- Bump yarn to 4.5.1 ([#573](https://github.com/polkadot-js/tools/pull/573))
- Upgrade polkadot/api to 14.1.1 ([#572](https://github.com/polkadot-js/tools/pull/572))
- Upgrade polkadot/common to 13.2.2 ([#572](https://github.com/polkadot-js/tools/pull/572))
- Bump dev to 0.81.2 ([#571](https://github.com/polkadot-js/tools/pull/571))
    - This allows for correct CJS and ESM targetting


## 0.59.1 Oct 3, 2024

- Upgrade polkadot-js to 14.0.1 ([#569](https://github.com/polkadot-js/tools/pull/569))
    - This is an important upgrade since it gives support for extrinsic v5.


## 0.58.3 Sep 23, 2024

- Upgrade polkadot-js to 13.2.1 ([#567](https://github.com/polkadot-js/tools/pull/567))


## 0.58.2 Sep 18, 2024

- Ensure resolutions are set for polkadot-js repos ([#565](https://github.com/polkadot-js/tools/pull/565))


## 0.58.1 Sep 18, 2024

Changes:

- Upgrade polkadot-js/api to 13.1.1, and polkadot-js/common to 13.1.1 ([#562](https://github.com/polkadot-js/tools/pull/562))
- Bump Dev and Typescript ([#560](https://github.com/polkadot-js/tools/pull/560))
- Bump yarn to 4.5.0 ([#563](https://github.com/polkadot-js/tools/pull/563))


## 0.57.4 Aug 19, 2024

Changes:

- Bump yarn to 4.4.0
- Upgrade polkadot-js/api to 12.4.1


## 0.57.3 Aug 5, 2024

Changes:

- Upgrade polkadot/api to 12.3.1 ([#555](https://github.com/polkadot-js/tools/pull/555))


## 0.57.2 July 29, 2024

Changes:

- Upgrade polkadot/api to 12.2.3


## 0.57.1 July 13, 2024

Changes:

- Upgrade polkadot/api to 12.2.1
- Upgrade polkadot/common to 13.0.2
- Bump yarn to 4.3.1


## 0.56.14 June 27, 2024

Changes:

- Bump polkadot/api to 12.0.2


## 0.56.13 June 25, 2024

Changes:

- Bump polkadot/api to 12.0.1


## 0.56.12 June 18, 2024

Changes:

- Bump polkadot/api to 11.3.1


## 0.56.11 May 22, 2024

Changes:

- Bump polkadot/api to 11.1.1
- Bump yarn to 4.2.2
- Bump polkadot/dev to 0.79.3 w/ topo sort


## 0.56.10 May 8, 2024

Changes:

- Bump polkadot/api to 11.0.3


## 0.56.9 Apr 27, 2024

Changes:

- Bump polkadot/api to 11.0.2


## 0.56.8 Apr 23, 2024

Changes:

- Update polkadot/api to 11.0.1


## 0.56.7 Apr 17, 2024

Changes:

- Update polkadot/dev to 0.78.13
- Update polkadot/api to 10.13.1
- Update CI checkout and setup_node to v4
- Bump yarn to 4.1.1


## 0.56.6 Mar 20, 2024

Changes:

- Upgrade to `@polkadot/*` api packages to 10.12.4


## 0.56.5 Mar 13, 2024

Changes:

- Upgrade to `@polkadot/*` api packages to 10.12.2


## 0.56.4 Mar 13, 2024

Changes:

- Upgrade to `@polkadot/api` 10.12.2


## 0.56.3 Feb 28, 2024

Contributed:

- Avoid infinite wait on failed txs (Thanks to https://github.com/serban300)

Changes:

- Upgrade to `@polkadot/api` 10.11.3
- Bump yarn to 4.1.0


## 0.56.2 Dec 18, 2023

Contributed:

- Add nonce argument to cli (Thanks to https://github.com/svyatonik)

Changes:

- Upgrade to `@polkadot/util` 12.6.2
- Upgrade to `@polkadot/api` 10.11.2


## 0.56.1 Nov 18, 2023

Changes:

- Upgrade to `@polkadot/util` 12.6.1
- Upgrade to `@polkadot/api` 10.11.1
- Drop support for Node 16 (EOL 11 Sep 2023)


## 0.55.3 Jun 12, 2023

Changes:

- Adjust object index access for stricter tsconfig settings
- Upgrade to `@polkadot/util` 12.3.2
- Upgrade to `@polkadot/api` 10.9.1


## 0.55.2 Jun 5, 2023

Changes:

- Upgrade to `@polkadot/util` 12.2.2
- Upgrade to `@polkadot/api` 10.8.1


## 0.55.1 May 29, 2023

Contributed:

- Properly compare modules without extrinsics (Thanks to https://github.com/nathanwhit)

Changes:

- Upgrade to `@polkadot/api` 10.7.3


## 0.54.4 May 13, 2023

Changes:

- Upgrade to `@polkadot/util` 12.2.1
- Upgrade to `@polkadot/api` 10.7.1


## 0.54.3 May 7, 2023

Changes:

- Upgrade to `@polkadot/util` 12.1.2
- Upgrade to `@polkadot/api` 10.6.1


## 0.54.2 Apr 30, 2023

Changes:

- Upgrade to `@polkadot/util` 12.1.1
- Upgrade to `@polkadot/api` 10.5.1


## 0.54.1 Apr 22, 2023

Changes:

- Upgrade to `@polkadot/util` 12.0.1
- Upgrade to `@polkadot/api` 10.4.1
- Drop support for Node 14 (EOL 30 Apr 2023)


## 0.53.11 Apr 16, 2023

Changes:

- Upgrade to `@polkadot/api` 10.3.4


## 0.53.10 Apr 10, 2023

Changes:

- Upgrade to `@polkadot/api` 10.3.2


## 0.53.9 Apr 9, 2023

Changes:

- Upgrade to `@polkadot/api` 10.3.1


## 0.53.8 Apr 1, 2023

Changes:

- Upgrade to `@polkadot/api` 10.2.2
- Upgrade to `@polkadot/util` 11.1.3


## 0.53.7 Mar 25, 2023

Changes:

- Upgrade to `@polkadot/api` 10.2.1
- Upgrade to `@polkadot/util` 11.1.2


## 0.53.6 Mar 19, 2023

Changes:

- Upgrade to `@polkadot/api` 10.1.4
- Upgrade to `@polkadot/util` 11.1.1


## 0.53.5 Mar 11, 2023

Contributed:

- Push all created docker tags to dockerhub (Thanks to https://github.com/wilwade)

Changes:

- Upgrade to `@polkadot/api` 10.1.1
- Upgrade to `@polkadot/util` 11.0.2


## 0.53.4 Mar 10, 2023

Changes:

- Remove python dep from docker (attempt to fix docker build)


## 0.53.3 Mar 10, 2023

Contributed:

- Tag specific docker image version in addition to latest (Thanks to https://github.com/wilwade)

Changes:

- Swap docker image to `ubunto:latest` & `node:lts`
- Prepare sources for future TS `moduleResolution: nodenext`


## 0.53.2 Mar 8, 2023

Changes:

- Add executable header to script files (& move to explicit script .mjs)


## 0.53.1 Mar 5, 2023

Changes:

- Swap TS -> JS compiler to use tsc (from babel)
- Adjust all tests to use `node:test` runner (ESM variants)
- Upgrade to `@polkadot/api` 10.0.1
- Upgrade to `@polkadot/util` 11.0.1


## 0.52.29 Feb 19, 2023

Changes:

- Upgrade to `@polkadot/api` 9.14.2
- Upgrade to `@polkadot/util` 10.4.2


## 0.52.28 Feb 13, 2023

Changes:

- Upgrade to `@polkadot/api` 9.14.1


## 0.52.27 Feb 5, 2023

Changes:

- Upgrade to `@polkadot/api` 9.13.6


## 0.52.26 Feb 1, 2023

Changes:

- Upgrade to `@polkadot/api` 9.13.4


## 0.52.25 Jan 29, 2023

Changes:

- Upgrade to `@polkadot/api` 9.13.1
- Upgrade to `@polkadot/util` 10.3.1


## 0.52.24 Jan 22, 2023

Changes:

- Upgrade to `@polkadot/api` 9.12.1


## 0.52.23 Jan 16, 2023

Changes:

- Upgrade to `@polkadot/api` 9.11.3
- Upgrade to `@polkadot/util` 10.2.6


## 0.52.22 Jan 8, 2023

Changes:

- Upgrade to `@polkadot/api` 9.11.1
- Upgrade to `@polkadot/util` 10.2.3


## 0.52.21 Dec 26, 2022

Changes:

- Upgrade to `@polkadot/api` 9.10.4


## 0.52.20 Dec 16, 2022

Changes:

- Upgrade to `@polkadot/api` 9.10.3


## 0.52.19 Dec 5, 2022

Changes:

- Fix for 0.52.18 publish (now on latest API)


## 0.52.18 Dec 5, 2022

Changes:

- Upgrade to `@polkadot/api` 9.10.1
- Upgrade to `@polkadot/util` 10.2.1


## 0.52.17 Nov 28, 2022

Changes:

- Upgrade to `@polkadot/api` 9.9.2
- Upgrade to `@polkadot/util` 10.1.14


## 0.52.16 Nov 13, 2022

Changes:

- Upgrade to `@polkadot/api` 9.8.1
- Upgrade to `@polkadot/util` 10.1.12


## 0.52.15 Nov 6, 2022

Changes:

- Upgrade to `@polkadot/api` 9.7.1


## 0.52.14 Oct 31, 2022

Changes:

- Upgrade to `@polkadot/api` 9.6.2


## 0.52.13 Oct 23, 2022

Changes:

- Upgrade to `@polkadot/api` 9.6.1


## 0.52.12 Oct 17, 2022

Changes:

- Upgrade to `@polkadot/api` 9.5.2
- Upgrade to `@polkadot/util` 10.1.11


## 0.52.11 Oct 8, 2022

Changes:

- Upgrade to `@polkadot/api` 9.5.1
- Upgrade to `@polkadot/util` 10.1.10


## 0.52.10 Oct 2, 2022

Changes:

- Upgrade to `@polkadot/api` 9.4.3


## 0.52.9 Sep 24, 2022

Changes:

- Upgrade to `@polkadot/api` 9.4.2
- Upgrade to `@polkadot/util` 10.1.9


## 0.52.8 Sep 17, 2022

Changes:

- Upgrade to `@polkadot/api` 9.4.1
- Upgrade to `@polkadot/util` 10.1.8


## 0.52.7 Sep 4, 2022

Changes:

- Upgrade to `@polkadot/api` 9.3.2


## 0.52.6 Sep 3, 2022

Changes:

- Upgrade to `@polkadot/api` 9.3.1
- Upgrade to `@polkadot/util` 10.1.7


## 0.52.5 Aug 29, 2022

Changes:

- Upgrade to `@polkadot/api` 9.2.4


## 0.52.4 Aug 21, 2022

Changes:

- Upgrade to `@polkadot/api` 9.2.3
- Upgrade to `@polkadot/util` 10.1.5


## 0.52.3 Aug 13, 2022

Changes:

- Upgrade to `@polkadot/api` 9.2.1
- Upgrade to `@polkadot/util` 10.1.4


## 0.52.2 Aug 8, 2022

Changes:

- Upgrade to `@polkadot/api` 9.1.1
- Upgrade to `@polkadot/util` 10.1.3


## 0.52.1 Jul 30, 2022

Changes:

- Upgrade to `@polkadot/api` 9.0.1
- Upgrade to `@polkadot/util` 10.1.2


## 0.51.17 Jul 23, 2022

Changes:

- Upgrade to `@polkadot/api` 8.14.1
- Upgrade to `@polkadot/util` 10.1.1


## 0.51.16 Jul 16, 2022

Changes:

- Upgrade to `@polkadot/api` 8.13.1


## 0.51.15 Jul 9, 2022

Changes:

- Upgrade to `@polkadot/api` 8.12.1
- Upgrade to `@polkadot/util` 10.0.1


## 0.51.14 Jul 4, 2022

Changes:

- Upgrade to `@polkadot/api` 8.11.2
- Upgrade to `@polkadot/util` 9.7.2


## 0.51.13 Jul 2, 2022

Changes:

- Upgrade to `@polkadot/api` 8.11.1
- Upgrade to `@polkadot/util` 9.7.1


## 0.51.12 Jun 26, 2022

Changes:

- Upgrade to `@polkadot/api` 8.10.1
- Upgrade to `@polkadot/util` 9.6.2


## 0.51.11 Jun 19, 2022

Changes:

- Upgrade to `@polkadot/api` 8.9.1
- Upgrade to `@polkadot/util` 9.5.1


## 0.51.10 Jun 12, 2022

Changes:

- Upgrade to `@polkadot/api` 8.8.1


## 0.51.9 Jun 4, 2022

Changes:

- Upgrade to `@polkadot/api` 8.7.1
- Upgrade to `@polkadot/util` 9.4.1


## 0.51.8 May 30, 2022

Changes:

- Upgrade to `@polkadot/api` 8.6.1
- Upgrade to `@polkadot/util` 9.3.1


## 0.51.7 May 22, 2022

Changes:

- Upgrade to `@polkadot/api` 8.5.1


## 0.51.6 May 14, 2022

Changes:

- Upgrade to `@polkadot/api` 8.4.1
- Upgrade to `@polkadot/util` 9.2.1


## 0.51.5 May 9, 2022

Changes:

- Upgrade to `@polkadot/api` 8.3.2


## 0.51.4 May 1, 2022

Changes:

- Upgrade to `@polkadot/api` 8.3.1
- Upgrade to `@polkadot/util` 9.1.1


## 0.51.3 Apr 24, 2022

Changes:

- Fix metadata-cmp import location for `creatSiName`
- Updated to `@polkadot/api` 8.2.1


## 0.51.2 Apr 18, 2022

Changes:

- Updated to `@polkadot/api` 8.1.1


## 0.51.1 Apr 10, 2022

- **Breaking change** In this version the commonjs outputs are moved to a sub-folder. Since the export map and main field in package.json does reflect this change, there should be no usage changes. However the packages here will all need to be on the same version for internal linkage.

Changes:

- Output commonjs files under the `cjs/**` root
- Upgrade to `@polkadot/api` 8.0.1
- Upgrade to `@polkadot/util` 9.0.1


## 0.50.7 Apr 3, 2022

Changes:

- Updated to `@polkadot/api` 7.15.1


## 0.50.6 Mar 29, 2022

Changes:

- Updated to `@polkadot/api` 7.14.3 (fix CJS environment)


## 0.50.5 Mar 27, 2022

Changes:

- Updated to `@polkadot/api` 7.14.1
- Updated to `@polkadot/util` 8.7.1


## 0.50.4 Mar 19, 2022

Changes:

- Updated to `@polkadot/api` 7.13.1
- Updated to `@polkadot/util` 8.6.1


## 0.50.3 Mar 13, 2022

Changes:

- Updated to `@polkadot/api` 7.12.1
- Updated to `@polkadot/util` 8.5.1


## 0.50.2 Mar 8, 2022

Contributed:

- Allow for ecdsa signatures in api cli (Thanks to https://github.com/nathanwhit)

Changes:

- Really bump to latest api (resolution fix)


## 0.50.1 Mar 7, 2022

Contributed:

- Allow for ecdsa signatures in signer cli (Thanks to https://github.com/nathanwhit)

Changes:

- Adjust for bundlers where `import.meta.url` is undefined
- Updated to `@polkadot/api` 7.11.1


## 0.49.5 Feb 27, 2022

Changes:

- Updated to `@polkadot/api` 7.10.1


## 0.49.4 Feb 21, 2022

Changes:

- Updated to `@polkadot/api` 7.9.1


## 0.49.3 Feb 14, 2022

Changes:

- Updated to `@polkadot/api` 7.8.1
- Updated to `@polkadot/util` 8.4.1


## 0.49.2 Feb 6, 2022

Changes:

- Updated to `@polkadot/api` 7.7.1


## 0.49.1 Jan 30, 2022

Changes:

- Adjust error messages for not-exposed pallets and methods
- Updated to `@polkadot/api` 7.6.1


## 0.48.13 Jan 23, 2022

Changes:

- Updated to `@polkadot/api` 7.5.1
- Updated to `@polkadot/util` 8.3.3


## 0.48.12 Jan 16, 2022

Changes:

- Updated to `@polkadot/api` 7.4.1
- Updated to `@polkadot/util` 8.3.2


## 0.48.11 Jan 9, 2022

Changes:

- Updated to `@polkadot/api` 7.3.1
- Updated to `@polkadot/util` 8.3.1


## 0.48.10 Jan 3, 2022

Changes:

- Updated to `@polkadot/api` 7.2.1


## 0.48.9 Dec 26, 2021

Changes:

- Updated to `@polkadot/api` 7.1.1


## 0.48.8 Dec 20, 2021

Changes:

- Updated to `@polkadot/api` 7.0.1
- Updated to `@polkadot/util` 8.2.2


## 0.48.7 Dec 14, 2021

Changes:

- Updated to `@polkadot/api` 6.12.1


## 0.48.6 Dec 6, 2021

Changes:

- Updated to `@polkadot/api` 6.11.1
- Updated to `@polkadot/util` 8.1.2


## 0.48.5 Nov 30, 2021

Changes:

- Updated to `@polkadot/api` 6.10.2
- Updated to `@polkadot/util` 8.0.4


## 0.48.4 Nov 21, 2021

Changes:

- Updated to `@polkadot/api` 6.9.1
- Updated to `@polkadot/util` 7.9.1


## 0.48.3 Nov 7, 2021

Changes:

- Updated to `@polkadot/api` 6.7.1
- Updated to `@polkadot/util` 7.8.2


## 0.48.2 Nov 1, 2021

Changes:

- Updated to `@polkadot/api` 6.6.1
- Updated to `@polkadot/util` 7.7.1


## 0.48.1 Oct 25, 2021

Contributed:

- Add specName/Version diffs to metadata compares (Thanks to https://github.com/apopiak)

Changes:

- Updated to `@polkadot/api` 6.5.1
- Updated to `@polkadot/api` 7.6.1


## 0.47.4 Oct 19, 2021

Changes:

- Updated to `@polkadot/api` 6.4.2


## 0.47.3 Oct 18, 2021

Changes:

- Updated to `@polkadot/api` 6.4.1


## 0.47.2 Oct 10, 2021

Changes:

- Updated to `@polkadot/api` 6.3.1


## 0.47.1 Oct 4, 2021

Upgrade priority: Low.

Contributed:

- Add support for `tip` and `assetId` payment options (Thanks to https://github.com/apopiak)
- Add example for complex params to README (Thanks to https://github.com/PierreBesson)

Changes:

- Updated to `@polkadot/api` 6.2.1


## 0.46.2 Sep 20, 2021

Upgrade priority: Low.

Changes:

- Adjust metadata compare for edge-case failures
- Updated to `@polkadot/api` 6.0.5


## 0.46.1 Sep 20, 2021

Upgrade priority: Low.

Changes:

- Cater for new metadata v14 compares
- Updated to `@polkadot/util` 7.4.1
- Updated to `@polkadot/api` 6.0.4


## 0.45.5 Sep 14, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/api` 5.9.1


## 0.45.4 Sep 6, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/api` 5.8.2


## 0.45.3 Aug 30, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 7.3.1
- Updated to `@polkadot/api` 5.7.1


## 0.45.2 Aug 23, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/api` 5.6.1


## 0.45.1 Aug 15, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 7.2.1
- Updated to `@polkadot/api` 5.5.1


## 0.44.1 Aug 2, 2021

Upgrade priority: Low.

Contributed:

- Add Ethereum-compatible keypair support (Thanks to https://github.com/joelamouche)

Changes:

- Adjust documentation display to cater for current API series
- Updated to `@polkadot/util` 7.1.1
- Updated to `@polkadot/api` 5.3.1


## 0.43.1 Jul 26, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 7.0.3
- Updated to `@polkadot/api` 5.2.1


## 0.42.1 Jul 11, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 7.0.1
- Updated to `@polkadot/api` 5.0.1


## 0.41.1 Jul 5, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.11.1
- Updated to `@polkadot/api` 4.17.1


## 0.40.1 Jun 26, 2021

Upgrade priority: Low.

Changes:

- Fix running of tools directly from repo
- Updated to `@polkadot/util` 6.10.1
- Updated to `@polkadot/api` 4.16.1


## 0.39.1 Jun 22, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.9.1
- Updated to `@polkadot/api` 4.15.1


## 0.38.1 Jun 14, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.8.1
- Updated to `@polkadot/api` 4.14.1


## 0.37.1 Jun 7, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.7.1
- Updated to `@polkadot/api` 4.13.1


## 0.36.1 May 30, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.6.1
- Updated to `@polkadot/api` 4.12.1


## 0.35.1 May 25, 2021

Upgrade priority: Low.

Changes:

- Updated to `@polkadot/util` 6.5.1
- Updated to `@polkadot/api` 4.11.2


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
