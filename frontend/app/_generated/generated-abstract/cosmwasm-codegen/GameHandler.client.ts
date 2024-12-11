/**
* This file was automatically generated by @abstract-money/ts-codegen@0.37.0-beta-3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { CamelCasedProperties } from "type-fest";
import { SigningCosmWasmClient, ExecuteResult } from "@abstract-money/cli/cosmjs";
import { AccountPublicClient, AccountWalletClient, AppExecuteMsg, AppExecuteMsgFactory, AdapterExecuteMsg, AdapterExecuteMsgFactory } from "@abstract-money/core";
import { StdFee } from "@abstract-money/cli/cosmjs";
import { AccountTrace, TruncatedChainId, Uint128, InstantiateMsg, AccountId, FixedMetadata, Coin, ExecuteMsg, Vec2, QueryMsg, MigrateMsg, ConfigResponse } from "./GameHandler.types";
import { GameHandlerQueryMsgBuilder, GameHandlerExecuteMsgBuilder } from "./GameHandler.message-builder";
export interface IGameHandlerAppQueryClient {
  moduleId: string;
  accountPublicClient: AccountPublicClient;
  _moduleAddress: string | undefined;
  config: () => Promise<ConfigResponse>;
  getAddress: () => Promise<string>;
}
export class GameHandlerAppQueryClient implements IGameHandlerAppQueryClient {
  accountPublicClient: AccountPublicClient;
  moduleId: string;
  _moduleAddress: string | undefined;

  constructor({
    accountPublicClient,
    moduleId
  }: {
    accountPublicClient: AccountPublicClient;
    moduleId: string;
  }) {
    this.accountPublicClient = accountPublicClient;
    this.moduleId = moduleId;
    this.config = this.config.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this._query(GameHandlerQueryMsgBuilder.config());
  };
  getAddress = async (): Promise<string> => {
    if (!this._moduleAddress) {
      const address = await this.accountPublicClient.getModuleAddress({
        id: this.moduleId
      });

      if (address === null) {
        throw new Error(`Module ${this.moduleId} not installed`);
      }

      this._moduleAddress = address;
    }

    return this._moduleAddress!;
  };
  _query = async (queryMsg: QueryMsg): Promise<any> => {
    return this.accountPublicClient.queryModule({
      moduleId: this.moduleId,
      moduleType: "adapter",
      queryMsg
    });
  };
}
export interface IGameHandlerAppClient extends IGameHandlerAppQueryClient {
  accountWalletClient: AccountWalletClient;
  createAccount: (params: CamelCasedProperties<Extract<ExecuteMsg, {
    create_account: unknown;
  }>["create_account"]>, fee_?: number | StdFee | "auto", memo_?: string, funds_?: Coin[]) => Promise<ExecuteResult>;
  movePlayer: (params: CamelCasedProperties<Extract<ExecuteMsg, {
    move_player: unknown;
  }>["move_player"]>, fee_?: number | StdFee | "auto", memo_?: string, funds_?: Coin[]) => Promise<ExecuteResult>;
}
export class GameHandlerAppClient extends GameHandlerAppQueryClient implements IGameHandlerAppClient {
  accountWalletClient: AccountWalletClient;

  constructor({
    accountPublicClient,
    accountWalletClient,
    moduleId
  }: {
    accountPublicClient: AccountPublicClient;
    accountWalletClient: AccountWalletClient;
    moduleId: string;
  }) {
    super({
      accountPublicClient,
      moduleId
    });
    this.accountWalletClient = accountWalletClient;
    this.createAccount = this.createAccount.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
  }

  createAccount = async (params: CamelCasedProperties<Extract<ExecuteMsg, {
    create_account: unknown;
  }>["create_account"]>, fee_: number | StdFee | "auto" = "auto", memo_?: string, funds_?: Coin[]): Promise<ExecuteResult> => {
    return this._execute(GameHandlerExecuteMsgBuilder.createAccount(params), fee_, memo_, funds_);
  };
  movePlayer = async (params: CamelCasedProperties<Extract<ExecuteMsg, {
    move_player: unknown;
  }>["move_player"]>, fee_: number | StdFee | "auto" = "auto", memo_?: string, funds_?: Coin[]): Promise<ExecuteResult> => {
    return this._execute(GameHandlerExecuteMsgBuilder.movePlayer(params), fee_, memo_, funds_);
  };
  _execute = async (msg: ExecuteMsg, fee_: number | StdFee | "auto" = "auto", memo_?: string, funds_?: Coin[]): Promise<ExecuteResult> => {
    const signingCwClient = await this.accountWalletClient.getSigningCosmWasmClient();
    const sender = await this.accountWalletClient.getSenderAddress();
    const accountAddress = await this.accountPublicClient.getAccountAddress();
    const moduleMsg: AdapterExecuteMsg<ExecuteMsg> = AdapterExecuteMsgFactory.executeAdapter({
      request: msg,
      accountAddress: accountAddress,
    });
    return await signingCwClient.execute(sender, await this.getAddress(), moduleMsg, fee_, memo_, funds_);
  };
}
