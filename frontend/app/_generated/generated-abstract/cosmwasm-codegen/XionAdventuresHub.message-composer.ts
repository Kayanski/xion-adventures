// @ts-nocheck
          /**
* This file was automatically generated by @abstract-money/ts-codegen@0.37.0-beta-3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { AppExecuteMsg, AppExecuteMsgFactory } from "@abstract-money/core";
import { AccountTrace, TruncatedChainId, InstantiateMsg, AccountId, ExecuteMsg, PlayerLocation, XionAdventuresExtensionMsg, Vec2, QueryMsg, MigrateMsg, ConfigResponse, NextTokenIdResponse } from "./XionAdventuresHub.types";
export interface XionAdventuresHubMsg {
contractAddress: string;
sender: string;
ibcTransfer: ({
  recipientChain,
  tokenId
}: {
  recipientChain: TruncatedChainId;
  tokenId: string;
}, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
mint: ({
  metadata,
  moduleId,
  recipient,
  tokenUri
}: {
  metadata: XionAdventuresExtensionMsg;
  moduleId: string;
  recipient?: AccountId;
  tokenUri: string;
}, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
modifyMetadata: ({
  metadata,
  moduleId,
  tokenId
}: {
  metadata: XionAdventuresExtensionMsg;
  moduleId: string;
  tokenId: string;
}, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class XionAdventuresHubMsgComposer implements XionAdventuresHubMsg {
sender: string;
contractAddress: string;

constructor(sender: string, contractAddress: string) {
  this.sender = sender;
  this.contractAddress = contractAddress;
  this.ibcTransfer = this.ibcTransfer.bind(this);
  this.mint = this.mint.bind(this);
  this.modifyMetadata = this.modifyMetadata.bind(this);
}

ibcTransfer = ({
  recipientChain,
  tokenId
}: {
  recipientChain: TruncatedChainId;
  tokenId: string;
}, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
  const _msg = {
    ibc_transfer: {
      recipient_chain: recipientChain,
      token_id: tokenId
    }
  };
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender: this.sender,
      contract: this.contractAddress,
      msg: toUtf8(JSON.stringify(_msg)),
      funds: funds_
    })
  };
};
mint = ({
  metadata,
  moduleId,
  recipient,
  tokenUri
}: {
  metadata: XionAdventuresExtensionMsg;
  moduleId: string;
  recipient?: AccountId;
  tokenUri: string;
}, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
  const _msg = {
    mint: {
      metadata,
      module_id: moduleId,
      recipient,
      token_uri: tokenUri
    }
  };
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender: this.sender,
      contract: this.contractAddress,
      msg: toUtf8(JSON.stringify(_msg)),
      funds: funds_
    })
  };
};
modifyMetadata = ({
  metadata,
  moduleId,
  tokenId
}: {
  metadata: XionAdventuresExtensionMsg;
  moduleId: string;
  tokenId: string;
}, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
  const _msg = {
    modify_metadata: {
      metadata,
      module_id: moduleId,
      token_id: tokenId
    }
  };
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender: this.sender,
      contract: this.contractAddress,
      msg: toUtf8(JSON.stringify(_msg)),
      funds: funds_
    })
  };
};
}