// Copyright 2018-2022 @polkadot/api-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ArgV {
  [argName: string]: unknown;
  _: (string | number)[];
  $0: string | number;
}
