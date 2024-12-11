// @ts-nocheck
          /**
* This file was automatically generated by @abstract-money/ts-codegen@0.37.0-beta-3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { AccountTrace, TruncatedChainId, InstantiateMsg, AccountId, ExecuteMsg, PlayerLocation, XionAdventuresExtensionMsg, Vec2, QueryMsg, MigrateMsg, ConfigResponse, NextTokenIdResponse } from "./Hub.types";
import { CamelCasedProperties } from "type-fest";
export abstract class HubExecuteMsgBuilder {
static ibcTransfer = ({
  recipientChain,
  tokenId
}: CamelCasedProperties<Extract<ExecuteMsg, {
  ibc_transfer: unknown;
}>["ibc_transfer"]>): ExecuteMsg => {
  return {
    ibc_transfer: ({
      recipient_chain: recipientChain,
      token_id: tokenId
    } as const)
  };
};
static mint = ({
  metadata,
  moduleId,
  recipient,
  tokenUri
}: CamelCasedProperties<Extract<ExecuteMsg, {
  mint: unknown;
}>["mint"]>): ExecuteMsg => {
  return {
    mint: ({
      metadata,
      module_id: moduleId,
      recipient,
      token_uri: tokenUri
    } as const)
  };
};
static modifyMetadata = ({
  metadata,
  moduleId,
  tokenId
}: CamelCasedProperties<Extract<ExecuteMsg, {
  modify_metadata: unknown;
}>["modify_metadata"]>): ExecuteMsg => {
  return {
    modify_metadata: ({
      metadata,
      module_id: moduleId,
      token_id: tokenId
    } as const)
  };
};
}
export abstract class HubQueryMsgBuilder {
static config = (): QueryMsg => {
  return {
    config: ({} as const)
  };
};
static nextTokenId = (): QueryMsg => {
  return {
    next_token_id: ({} as const)
  };
};
}