import { defineConfig } from '@abstract-money/cli'
import { react, registry, vanilla } from '@abstract-money/cli/plugins'

export default defineConfig({
  out: 'app/_generated/generated-abstract',
  contracts: [
    {
      name: "game-handler",
      path: "../backend/schema/game_handler/game-handler/0.2.1/abstract",
      namespace: "xion-adventures",
      version: "0.2.1",
      moduleType: "adapter",
    },
    {
      name: "hub",
      path: "../backend/schema/hub/xion-adventures-hub/0.2.1/abstract",
      namespace: "xion-adventures",
      version: "0.2.1",
      moduleType: "adapter",
    },
  ],
  plugins: [
    react({
      disableAbstractAppFor: ['cw721-base']
    }),
    registry({
      contracts: [{
        name: "cw721-base",
        namespace: "cw-plus",
        version: "0.18"
      }]
    })],
})
