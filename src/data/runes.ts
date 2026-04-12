export interface Rune {
  name: string
  explanation: string
}

export interface RunePath {
  id: string
  name: string
  description: string
  keystones: Rune[]
  row1: Rune[]
  row2: Rune[]
  row3: Rune[]
}

export const runePaths: RunePath[] = [
  {
    id: 'precision',
    name: 'Precision',
    description: 'Reward constant damage output and sustained combat.',
    keystones: [
      {
        name: 'Lethal Tempo',
        explanation: 'Attack speed increases as you attack the same target, rewarding champions who focus on auto-attacks.',
      },
      {
        name: 'Fleet Footwork',
        explanation: 'Every few seconds gain movement speed and heal yourself on your next attack.',
      },
      {
        name: 'Press the Attack',
        explanation: 'Attack an enemy 3 times to deal extra damage and reduce their defenses.',
      },
      {
        name: 'Conqueror',
        explanation: 'Gain stacking attack damage and spell power during extended fights, converting some damage into healing.',
      },
    ],
    row1: [
      {
        name: 'Overheal',
        explanation: 'Healing shields you from damage, creating a protective buffer when you heal.',
      },
      {
        name: 'Triumph',
        explanation: 'Get health back after eliminating enemies, helping you survive skirmishes.',
      },
      {
        name: 'Presence of Mind',
        explanation: 'Restore mana/energy when eliminating enemies and gain more from abilities.',
      },
    ],
    row2: [
      {
        name: 'Legend: Alacrity',
        explanation: 'Gain attack speed as you get more takedowns, making you faster the more you kill.',
      },
      {
        name: 'Legend: Tenacity',
        explanation: 'Gain crowd control resistance, letting you escape stuns and slows more easily.',
      },
      {
        name: 'Legend: Bloodline',
        explanation: 'Gain lifesteal as you get takedowns, letting you heal by dealing damage.',
      },
    ],
    row3: [
      {
        name: 'Coup de Grace',
        explanation: 'Deal extra damage to low-health enemies, finishing them off more easily.',
      },
      {
        name: 'Cut Down',
        explanation: 'Deal bonus damage to enemies with more health than you, helping you fight tankier foes.',
      },
      {
        name: 'Last Stand',
        explanation: 'Deal more damage the lower your health, rewarding risky plays.',
      },
    ],
  },
  {
    id: 'domination',
    name: 'Domination',
    description: 'Hunting down and crushing enemies with sudden bursts of damage.',
    keystones: [
      {
        name: 'Electrocute',
        explanation: 'Land 3 separate hits on an enemy to trigger an explosion of damage.',
      },
      {
        name: 'Predator',
        explanation: 'Activate to gain movement speed and enhanced next attack damage to hunting enemies.',
      },
      {
        name: 'Dark Harvest',
        explanation: 'Deal extra damage and collect souls from kills, growing stronger over time.',
      },
      {
        name: 'Hail of Blades',
        explanation: 'Your next auto-attack hits 3 times very quickly, great for bursting enemies.',
      },
    ],
    row1: [
      {
        name: 'Cheap Shot',
        explanation: 'Damage enemies affected by crowd control, rewarding you for immobilizing them.',
      },
      {
        name: 'Taste of Blood',
        explanation: 'Heal yourself when you damage enemy champions, letting you sustain in fights.',
      },
      {
        name: 'Sudden Impact',
        explanation: 'Gain penetration for armor/magic when you dash or become invisible, then damage.',
      },
    ],
    row2: [
      {
        name: 'Zombie Ward',
        explanation: 'Place a vision ward when you destroy enemy wards, spreading map control.',
      },
      {
        name: 'Ghost Poro',
        explanation: 'Spawn a ghostly ward that gives vision, helping you track enemies.',
      },
      {
        name: 'Eyeball Collection',
        explanation: 'Collect eyes from enemy takedowns to gain ability power over time.',
      },
    ],
    row3: [
      {
        name: 'Treasure Hunter',
        explanation: 'Gain bonus gold from kills, letting you get items faster.',
      },
      {
        name: 'Ingenious Hunter',
        explanation: 'Reduce the cooldown of your active items, using them more often.',
      },
      {
        name: 'Relentless Hunter',
        explanation: 'Gain movement speed from kills, letting you roam and chase easier.',
      },
      {
        name: 'Ultimate Hunter',
        explanation: 'Reduce your ultimate cooldown, using your strongest ability more frequently.',
      },
    ],
  },
  {
    id: 'sorcery',
    name: 'Sorcery',
    description: 'Empower your spells and enhance your magical abilities.',
    keystones: [
      {
        name: 'Arcane Comet',
        explanation: 'Enemies hit by your spells are struck by a comet, dealing extra damage from above.',
      },
      {
        name: 'Phase Rush',
        explanation: 'Hit an enemy with spells to gain movement speed and slow resistance.',
      },
      {
        name: 'Summon Aery',
        explanation: 'A protective spirit follows you and shields allies while damaging enemies you hit.',
      },
    ],
    row1: [
      {
        name: 'Nullifying Orb',
        explanation: 'Automatically shield yourself against large magic damage hits.',
      },
      {
        name: 'Manaflow Band',
        explanation: 'Gain mana and restore mana when you hit enemies with spells.',
      },
      {
        name: 'Nimbus Cloak',
        explanation: 'Gain movement speed when you use Summoner Spells, helping escape or chase.',
      },
    ],
    row2: [
      {
        name: 'Transcendence',
        explanation: 'Gain extra ability power and reduce ability cooldowns when you level up.',
      },
      {
        name: 'Celerity',
        explanation: 'Gain movement speed, and that speed boosts your damage.',
      },
      {
        name: 'Absolute Focus',
        explanation: 'Deal extra damage when at high health, rewarding safe positioning.',
      },
    ],
    row3: [
      {
        name: 'Scorch',
        explanation: 'Deal extra damage over time when you hit enemies with spells.',
      },
      {
        name: 'Waterwalking',
        explanation: 'Gain movement speed in river areas, better for roaming and teamfights.',
      },
      {
        name: 'Gathering Storm',
        explanation: 'Gain scaling ability power over time, making you stronger late game.',
      },
    ],
  },
  {
    id: 'resolve',
    name: 'Resolve',
    description: 'Become a durable survivor who grows stronger as battles rage on.',
    keystones: [
      {
        name: 'Grasp of the Undying',
        explanation: 'Periodically heal yourself and damage enemies when you auto-attack them while healthy.',
      },
      {
        name: 'Aftershock',
        explanation: 'Get hit by crowd control to gain temporary resistances and deal area damage.',
      },
      {
        name: 'Guardian',
        explanation: 'Shield nearby allies when you take damage, protecting your team.',
      },
    ],
    row1: [
      {
        name: 'Demolish',
        explanation: 'Your auto-attacks break down tower defenses faster.',
      },
      {
        name: 'Font of Life',
        explanation: 'Enemies you slow or immobilize heal nearby allies, supporting your team.',
      },
      {
        name: 'Shield Bash',
        explanation: 'Shields you gain let you trade damage and reduce enemy cooldowns.',
      },
    ],
    row2: [
      {
        name: 'Conditioning',
        explanation: 'Gain bonus armor and magic resist after 10 minutes of the game.',
      },
      {
        name: 'Second Wind',
        explanation: 'Heal yourself when you take damage, helping you sustain in lane.',
      },
      {
        name: 'Bone Plating',
        explanation: 'Reduce incoming damage from enemy abilities after you take damage.',
      },
    ],
    row3: [
      {
        name: 'Overgrowth',
        explanation: 'Gain max health from minion kills and enemy takedowns.',
      },
      {
        name: 'Revitalize',
        explanation: 'Boost all healing you receive, making shields and heals stronger.',
      },
      {
        name: 'Unflinching',
        explanation: 'Gain tenacity and reduce crowd control duration on you.',
      },
    ],
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    description: 'Creative tools and clever tricks to outsmart your enemies.',
    keystones: [
      {
        name: 'Glacial Augment',
        explanation: 'Your auto-attacks slow enemies, creating a slowing field for your team.',
      },
      {
        name: 'First Strike',
        explanation: 'Deal bonus damage when you hit enemies first and gain extra gold.',
      },
      {
        name: 'Unsealed Spellbook',
        explanation: 'Swap Summoner Spells on cooldown, adapting to what you need each moment.',
      },
    ],
    row1: [
      {
        name: 'Hextech Flashtraption',
        explanation: 'Teleport to a location or swap with allies using your Flash cooldown.',
      },
      {
        name: 'Magical Footwear',
        explanation: 'Get free boots that upgrade automatically, saving gold for other items.',
      },
      {
        name: 'Cash Back',
        explanation: 'Get refunds on item purchases, freeing up gold for more items.',
      },
    ],
    row2: [
      {
        name: 'Triple Tonic',
        explanation: 'You gain extra benefits from potions and elixirs you drink.',
      },
      {
        name: 'Time Warp Tonic',
        explanation: 'Potions also give movement speed, helping you move and position better.',
      },
      {
        name: 'Biscuit Delivery',
        explanation: 'Periodically get healing biscuits, staying healthier in lane.',
      },
    ],
    row3: [
      {
        name: 'Cosmic Insight',
        explanation: 'Reduce cooldowns on your Summoner Spells and item active effects.',
      },
      {
        name: 'Approach Velocity',
        explanation: 'Gain movement speed toward slowed or immobilized enemies.',
      },
      {
        name: 'Jack of All Trades',
        explanation: 'Gain small bonuses to damage, healing, and shielding you deal and receive.',
      },
    ],
  },
]
