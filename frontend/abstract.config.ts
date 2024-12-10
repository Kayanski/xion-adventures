import { defineConfig } from '@abstract-money/cli'
import { react, registry, vanilla } from '@abstract-money/cli/plugins'

export default defineConfig({
  out: 'app/_generated/generated-abstract',
  contracts: [
    {
      name: "game-handler",
      path: "../backend/schema/game_handler/game-handler/0.1.0/abstract",
      namespace: "xion-adventures",
      version: "0.1.0",
      moduleType: "adapter",
    },
    {
      name: "xion-adventures-hub",
      path: "../backend/schema/hub/xion-adventures-hub/0.0.1/abstract",
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
