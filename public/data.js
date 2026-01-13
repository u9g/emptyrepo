// Data about Minecraft repositories commonly referenced in mixins
// This data represents popular repos that other mods frequently target with mixins
// Reference counts are estimates based on GitHub search data and community knowledge

const mixinRepoData = [
  {
    id: 1,
    name: "Minecraft (Base Game)",
    repo: "mojang/minecraft",
    github_url: null,
    description: "The base Minecraft game. Nearly every mod that uses mixins targets the base game code.",
    mixin_references: 15000,
    category: "Base Game",
    stars: null,
    common_mixin_targets: [
      "net.minecraft.client.MinecraftClient",
      "net.minecraft.server.MinecraftServer",
      "net.minecraft.entity.player.PlayerEntity",
      "net.minecraft.world.World",
      "net.minecraft.block.Block",
      "net.minecraft.item.Item"
    ],
    notes: "Decompiled/remapped via official mappings, Yarn, or MCP"
  },
  {
    id: 2,
    name: "Fabric API",
    repo: "FabricMC/fabric",
    github_url: "https://github.com/FabricMC/fabric",
    description: "The core library for Fabric mods. Provides essential hooks and APIs that many mods extend.",
    mixin_references: 2850,
    category: "Modding Platform",
    stars: 2100,
    common_mixin_targets: [
      "net.fabricmc.fabric.api.event",
      "net.fabricmc.fabric.api.networking",
      "net.fabricmc.fabric.api.client.rendering",
      "net.fabricmc.fabric.impl.resource.loader"
    ],
    notes: "Official Fabric modding API"
  },
  {
    id: 3,
    name: "SpongePowered Mixin",
    repo: "SpongePowered/Mixin",
    github_url: "https://github.com/SpongePowered/Mixin",
    description: "The Mixin bytecode weaving framework itself. Some mods mixin into Mixin for advanced customization.",
    mixin_references: 890,
    category: "Framework",
    stars: 1400,
    common_mixin_targets: [
      "org.spongepowered.asm.mixin.transformer",
      "org.spongepowered.asm.mixin.injection"
    ],
    notes: "The framework that makes mixins possible"
  },
  {
    id: 4,
    name: "MinecraftForge",
    repo: "MinecraftForge/MinecraftForge",
    github_url: "https://github.com/MinecraftForge/MinecraftForge",
    description: "The Forge modding platform. Many Forge mods use mixins to extend Forge's functionality.",
    mixin_references: 1650,
    category: "Modding Platform",
    stars: 6900,
    common_mixin_targets: [
      "net.minecraftforge.common.MinecraftForge",
      "net.minecraftforge.event",
      "net.minecraftforge.client",
      "net.minecraftforge.fml"
    ],
    notes: "Oldest and most popular modding platform"
  },
  {
    id: 5,
    name: "Fabric Loader",
    repo: "FabricMC/fabric-loader",
    github_url: "https://github.com/FabricMC/fabric-loader",
    description: "The Fabric mod loader. Some mods inject into the loader for early initialization.",
    mixin_references: 720,
    category: "Modding Platform",
    stars: 650,
    common_mixin_targets: [
      "net.fabricmc.loader.impl",
      "net.fabricmc.loader.api"
    ],
    notes: "Handles mod loading and initialization"
  },
  {
    id: 6,
    name: "Sodium",
    repo: "CaffeineMC/sodium-fabric",
    github_url: "https://github.com/CaffeineMC/sodium-fabric",
    description: "Modern rendering engine for Minecraft. Many performance and shader mods target Sodium.",
    mixin_references: 1420,
    category: "Performance Mod",
    stars: 4800,
    common_mixin_targets: [
      "me.jellysquid.mods.sodium.client.render",
      "me.jellysquid.mods.sodium.client.gl",
      "me.jellysquid.mods.sodium.client.model"
    ],
    notes: "Most popular rendering optimization mod"
  },
  {
    id: 7,
    name: "Lithium",
    repo: "CaffeineMC/lithium-fabric",
    github_url: "https://github.com/CaffeineMC/lithium-fabric",
    description: "Game logic optimization mod. Extended by mods that need to modify server-side behavior.",
    mixin_references: 580,
    category: "Performance Mod",
    stars: 2700,
    common_mixin_targets: [
      "me.jellysquid.mods.lithium.common",
      "me.jellysquid.mods.lithium.mixin"
    ],
    notes: "Server-side optimization mod"
  },
  {
    id: 8,
    name: "Iris Shaders",
    repo: "IrisShaders/Iris",
    github_url: "https://github.com/IrisShaders/Iris",
    description: "Shader mod for Fabric. Shader packs and visual mods often target Iris.",
    mixin_references: 890,
    category: "Graphics Mod",
    stars: 3200,
    common_mixin_targets: [
      "net.coderbot.iris.pipeline",
      "net.coderbot.iris.shaderpack",
      "net.coderbot.iris.gl"
    ],
    notes: "OptiFine shader support for Fabric"
  },
  {
    id: 9,
    name: "Create Mod",
    repo: "Creators-of-Create/Create",
    github_url: "https://github.com/Creators-of-Create/Create",
    description: "Popular automation mod. Many addon mods use mixins to extend Create's features.",
    mixin_references: 1180,
    category: "Content Mod",
    stars: 2600,
    common_mixin_targets: [
      "com.simibubi.create.content",
      "com.simibubi.create.foundation",
      "com.simibubi.create.api"
    ],
    notes: "One of the most popular Minecraft mods"
  },
  {
    id: 10,
    name: "Architectury API",
    repo: "architectury/architectury-api",
    github_url: "https://github.com/architectury/architectury-api",
    description: "Cross-platform modding API for Fabric and Forge. Used by mods targeting multiple platforms.",
    mixin_references: 650,
    category: "Modding Library",
    stars: 420,
    common_mixin_targets: [
      "dev.architectury.event",
      "dev.architectury.registry",
      "dev.architectury.networking"
    ],
    notes: "Enables cross-platform mod development"
  },
  {
    id: 11,
    name: "Cloth Config",
    repo: "shedaniel/cloth-config",
    github_url: "https://github.com/shedaniel/cloth-config",
    description: "Configuration library for Minecraft mods. Extended by mods needing custom config screens.",
    mixin_references: 380,
    category: "Modding Library",
    stars: 280,
    common_mixin_targets: [
      "me.shedaniel.clothconfig2.api",
      "me.shedaniel.clothconfig2.gui"
    ],
    notes: "Popular configuration library"
  },
  {
    id: 12,
    name: "Roughly Enough Items (REI)",
    repo: "shedaniel/RoughlyEnoughItems",
    github_url: "https://github.com/shedaniel/RoughlyEnoughItems",
    description: "Item and recipe viewing mod. Recipe mods often mixin to add custom recipe categories.",
    mixin_references: 520,
    category: "Utility Mod",
    stars: 550,
    common_mixin_targets: [
      "me.shedaniel.rei.api",
      "me.shedaniel.rei.impl",
      "me.shedaniel.rei.plugin"
    ],
    notes: "Popular alternative to JEI"
  },
  {
    id: 13,
    name: "ViaVersion",
    repo: "ViaVersion/ViaVersion",
    github_url: "https://github.com/ViaVersion/ViaVersion",
    description: "Protocol translation library. Server mods often extend ViaVersion for custom protocols.",
    mixin_references: 340,
    category: "Networking",
    stars: 1200,
    common_mixin_targets: [
      "com.viaversion.viaversion.api",
      "com.viaversion.viaversion.protocols"
    ],
    notes: "Allows connecting with different MC versions"
  },
  {
    id: 14,
    name: "Mod Menu",
    repo: "TerraformersMC/ModMenu",
    github_url: "https://github.com/TerraformersMC/ModMenu",
    description: "Adds a mod list to Minecraft. Often targeted by mods adding custom mod entries.",
    mixin_references: 290,
    category: "Utility Mod",
    stars: 480,
    common_mixin_targets: [
      "com.terraformersmc.modmenu.api",
      "com.terraformersmc.modmenu.gui"
    ],
    notes: "Essential Fabric utility mod"
  },
  {
    id: 15,
    name: "Quilt Standard Libraries",
    repo: "QuiltMC/quilt-standard-libraries",
    github_url: "https://github.com/QuiltMC/quilt-standard-libraries",
    description: "Standard libraries for Quilt modding platform. Targeted by Quilt mods.",
    mixin_references: 210,
    category: "Modding Platform",
    stars: 180,
    common_mixin_targets: [
      "org.quiltmc.qsl.base",
      "org.quiltmc.qsl.lifecycle"
    ],
    notes: "Quilt's equivalent to Fabric API"
  },
  {
    id: 16,
    name: "Applied Energistics 2",
    repo: "AppliedEnergistics/Applied-Energistics-2",
    github_url: "https://github.com/AppliedEnergistics/Applied-Energistics-2",
    description: "Storage and automation mod. Many addons use mixins to extend AE2 functionality.",
    mixin_references: 480,
    category: "Content Mod",
    stars: 1350,
    common_mixin_targets: [
      "appeng.api",
      "appeng.core",
      "appeng.me.storage"
    ],
    notes: "Popular tech mod"
  },
  {
    id: 17,
    name: "JourneyMap",
    repo: "TeamJM/journeymap-legacy",
    github_url: "https://github.com/TeamJM/journeymap-legacy",
    description: "Minimap and world mapping mod. Extended by mods adding custom map features.",
    mixin_references: 260,
    category: "Utility Mod",
    stars: 320,
    common_mixin_targets: [
      "journeymap.client.api",
      "journeymap.client.render"
    ],
    notes: "Most popular minimap mod"
  },
  {
    id: 18,
    name: "Mekanism",
    repo: "mekanism/Mekanism",
    github_url: "https://github.com/mekanism/Mekanism",
    description: "Tech mod with advanced machinery. Addons use mixins to add compatibility.",
    mixin_references: 390,
    category: "Content Mod",
    stars: 1100,
    common_mixin_targets: [
      "mekanism.api",
      "mekanism.common.tile",
      "mekanism.common.content"
    ],
    notes: "Popular tech mod"
  },
  {
    id: 19,
    name: "Curios API",
    repo: "TheIllusiveC4/Curios",
    github_url: "https://github.com/TheIllusiveC4/Curios",
    description: "Accessories/trinkets API. Many mods use mixins to add custom curio slots.",
    mixin_references: 340,
    category: "Modding Library",
    stars: 210,
    common_mixin_targets: [
      "top.theillusivec4.curios.api",
      "top.theillusivec4.curios.common"
    ],
    notes: "Standard accessories API"
  },
  {
    id: 20,
    name: "Trinkets",
    repo: "emilyploszaj/trinkets",
    github_url: "https://github.com/emilyploszaj/trinkets",
    description: "Fabric accessories mod similar to Curios. Extended by accessory mods.",
    mixin_references: 280,
    category: "Modding Library",
    stars: 180,
    common_mixin_targets: [
      "dev.emi.trinkets.api",
      "dev.emi.trinkets.data"
    ],
    notes: "Fabric-native accessories API"
  },
  {
    id: 21,
    name: "Geckolib",
    repo: "bernie-g/geckolib",
    github_url: "https://github.com/bernie-g/geckolib",
    description: "Animation library for Minecraft mods. Extended for custom animation features.",
    mixin_references: 310,
    category: "Modding Library",
    stars: 650,
    common_mixin_targets: [
      "software.bernie.geckolib.core",
      "software.bernie.geckolib.model"
    ],
    notes: "Popular animation framework"
  },
  {
    id: 22,
    name: "Essential",
    repo: "EssentialGG/Essential",
    github_url: "https://github.com/EssentialGG/Essential",
    description: "Social platform mod for Minecraft. Some mods extend Essential's features.",
    mixin_references: 180,
    category: "Utility Mod",
    stars: 95,
    common_mixin_targets: [
      "gg.essential.api",
      "gg.essential.universal"
    ],
    notes: "Popular multiplayer enhancement mod"
  },
  {
    id: 23,
    name: "Botania",
    repo: "VazkiiMods/Botania",
    github_url: "https://github.com/VazkiiMods/Botania",
    description: "Magic-tech mod. Addons use mixins to add flowers and mana mechanics.",
    mixin_references: 350,
    category: "Content Mod",
    stars: 1250,
    common_mixin_targets: [
      "vazkii.botania.api",
      "vazkii.botania.common.block",
      "vazkii.botania.common.item"
    ],
    notes: "Popular magic mod"
  },
  {
    id: 24,
    name: "Patchouli",
    repo: "VazkiiMods/Patchouli",
    github_url: "https://github.com/VazkiiMods/Patchouli",
    description: "Documentation/guidebook library. Mods extend for custom book features.",
    mixin_references: 220,
    category: "Modding Library",
    stars: 380,
    common_mixin_targets: [
      "vazkii.patchouli.api",
      "vazkii.patchouli.client"
    ],
    notes: "Standard in-game documentation library"
  },
  {
    id: 25,
    name: "Farmer's Delight",
    repo: "vectorwing/FarmersDelight",
    github_url: "https://github.com/vectorwing/FarmersDelight",
    description: "Farming and cooking mod. Many food addons mixin for compatibility.",
    mixin_references: 420,
    category: "Content Mod",
    stars: 580,
    common_mixin_targets: [
      "vectorwing.farmersdelight.common",
      "vectorwing.farmersdelight.data"
    ],
    notes: "Popular farming expansion mod"
  },
  {
    id: 26,
    name: "Xaero's Minimap",
    repo: "xaero-plus/XaerosPlus",
    github_url: "https://github.com/xaero-plus/XaerosPlus",
    description: "Alternative minimap mod. Extended for custom waypoint features.",
    mixin_references: 190,
    category: "Utility Mod",
    stars: 150,
    common_mixin_targets: [
      "xaero.common.minimap",
      "xaero.hud"
    ],
    notes: "Popular Xaero's enhancement mod"
  },
  {
    id: 27,
    name: "Complementary Shaders (Euphoria Patches)",
    repo: "ComplementaryDevelopment/ComplementaryReimagined",
    github_url: "https://github.com/ComplementaryDevelopment/ComplementaryReimagined",
    description: "Popular shader pack. Some visual mods patch shader functionality.",
    mixin_references: 85,
    category: "Graphics Mod",
    stars: 280,
    common_mixin_targets: [],
    notes: "Popular shader pack"
  },
  {
    id: 28,
    name: "Entity Model Features",
    repo: "Traben-0/Entity_Model_Features",
    github_url: "https://github.com/Traben-0/Entity_Model_Features",
    description: "Custom entity model support mod. Extended by texture pack utilities.",
    mixin_references: 140,
    category: "Graphics Mod",
    stars: 210,
    common_mixin_targets: [
      "traben.entity_model_features"
    ],
    notes: "OptiFine CEM alternative"
  },
  {
    id: 29,
    name: "Continuity",
    repo: "PepperCode1/Continuity",
    github_url: "https://github.com/PepperCode1/Continuity",
    description: "Connected textures mod. Extended for custom CTM features.",
    mixin_references: 120,
    category: "Graphics Mod",
    stars: 450,
    common_mixin_targets: [
      "me.pepperbell.continuity"
    ],
    notes: "OptiFine CTM alternative"
  },
  {
    id: 30,
    name: "Indium",
    repo: "comp500/Indium",
    github_url: "https://github.com/comp500/Indium",
    description: "FRAPI compatibility layer for Sodium. Graphics mods often target Indium.",
    mixin_references: 230,
    category: "Compatibility Mod",
    stars: 380,
    common_mixin_targets: [
      "link.infra.indium"
    ],
    notes: "Enables FRAPI with Sodium"
  }
];

// Categories for filtering
const categories = [
  "All",
  "Base Game",
  "Modding Platform",
  "Framework",
  "Performance Mod",
  "Graphics Mod",
  "Content Mod",
  "Modding Library",
  "Utility Mod",
  "Networking",
  "Compatibility Mod"
];

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mixinRepoData, categories };
}
