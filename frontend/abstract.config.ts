import { defineConfig } from '@abstract-money/cli'
import { react, registry, vanilla } from '@abstract-money/cli/plugins'

export default defineConfig({
  out: 'app/_generated/generated-abstract',
  contracts: [
    {
      name: "game-handler",
      path: "../backend/contracts/modules/game_handler/schema",
      namespace: "xion-adventures",
      version: "0.1.0",
      moduleType: "adapter",
    },
    {
      name: "xion-adventures-hub",
      path: "../backend/contracts/hub/schema",
      namespace: "xion-adventures",
      version: "0.1.0",
      moduleType: "adapter",
    }
  ],
  plugins: [
    react({
      disableAbstractAppFor: ['cw20-base']
    }),
    registry({
      contracts: []
    })],
})
