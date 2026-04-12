// ── RUNES DATA ──────────────────────────────────────────────────────────────
// Full coverage of all 5 rune paths, every keystone, and every secondary rune.
// Descriptions are written for new players — plain English, no assumed knowledge.

export interface RuneInfo {
  name: string
  description: string   // what it does in plain English
  whenToTake: string    // beginner guidance: "take this when..."
  whoUsesIt: string     // typical roles or champion types
}

export interface RuneRow {
  slot: number          // row 1, 2, or 3 (below keystones)
  runes: RuneInfo[]
}

export interface RunePath {
  id: string
  name: string
  color: string         // CSS hex for accent colour
  tagline: string       // one-line identity
  summary: string       // 2-3 sentence beginner explanation of the path
  bestFor: string[]     // short list of champion types this suits
  keystones: RuneInfo[]
  rows: RuneRow[]
}

export const RUNE_PATHS: RunePath[] = [
  // ── PRECISION ──────────────────────────────────────────────────────────────
  {
    id: 'precision',
    name: 'Precision',
    color: '#c8aa6e',
    tagline: 'Hit harder, fight longer',
    summary:
      'Precision is the attack-focused path. It rewards you for dealing damage over time by making your basic attacks and sustained fights stronger. Most AD carries and melee fighters who like to stay in long fights choose Precision as their primary path.',
    bestFor: ['AD Carries', 'Fighters / Bruisers', 'Melee carries', 'Sustained damage dealers'],
    keystones: [
      {
        name: 'Press the Attack',
        description:
          'Hit an enemy champion 3 times in a row and they become vulnerable — all damage they take is increased for a few seconds. This stacks very quickly in a short trade.',
        whenToTake:
          'When you want to win short, aggressive trades early game. Great if you can get in, land 3 hits fast, then back off.',
        whoUsesIt: 'Lucian, Kalista, Quinn, Renekton — champs who burst a trade quickly.',
      },
      {
        name: 'Lethal Tempo',
        description:
          'Start attacking and you rapidly gain bonus attack speed, eventually even exceeding the normal attack speed cap. The longer the fight goes, the more damage you do.',
        whenToTake:
          'When you want to melt tanks and win extended fights that go 5+ seconds. Best later in the game once you have attack speed items.',
        whoUsesIt: "Vayne, Kog'Maw, Jinx, Yone, Tryndamere — champs who scale with long fights.",
      },
      {
        name: 'Fleet Footwork',
        description:
          'Every few attacks you get a burst of movement speed and heal yourself. It keeps you mobile and helps you survive poke-heavy lanes.',
        whenToTake:
          "When you're in a tough lane and need to survive early. Sacrifices some damage for safety and sustain.",
        whoUsesIt: 'Ezreal, Ashe, Senna, Miss Fortune — pokey or passive early-game carries.',
      },
      {
        name: 'Conqueror',
        description:
          'Build stacks by fighting. At max stacks your attacks heal you for a portion of the damage dealt. The longer a fight goes on, the more powerful you become.',
        whenToTake:
          "When you're going into long drawn-out team fights or 1v1 duels. Perfect if your champion loves to sit in a fight for 10+ seconds.",
        whoUsesIt: 'Darius, Fiora, Garen, Jinx, Sett, Urgot — champions built for sustained combat.',
      },
    ],
    rows: [
      {
        slot: 1,
        runes: [
          {
            name: 'Overheal',
            description: 'Any healing you receive beyond full health becomes a temporary shield.',
            whenToTake: 'When you have lifesteal items or healing abilities and want to convert excess healing into protection.',
            whoUsesIt: 'AD carries with lifesteal, Aatrox, Yuumi-paired carries.',
          },
          {
            name: 'Triumph',
            description: 'Getting a kill or assist restores 5% of your missing health and gives you bonus gold.',
            whenToTake: "Almost always the default choice. The health refill after kills helps you survive fights and keep going.",
            whoUsesIt: 'Most champions — very safe and consistent pick.',
          },
          {
            name: 'Presence of Mind',
            description: 'Takedowns restore 15% of your maximum mana. Also slowly increases your max mana over time.',
            whenToTake: 'When you run out of mana often and your champion is mana-dependent.',
            whoUsesIt: 'Lucian, Varus, Ezreal, mana-hungry mid laners.',
          },
        ],
      },
      {
        slot: 2,
        runes: [
          {
            name: 'Legend: Alacrity',
            description: 'Permanently gain attack speed as you earn Legend stacks from takedowns and objectives.',
            whenToTake: 'When your champion benefits from attack speed — most auto-attack heavy champs.',
            whoUsesIt: 'Most AD carries and fighters.',
          },
          {
            name: 'Legend: Haste',
            description: 'Gain ability haste (reduces cooldowns) permanently as you earn stacks.',
            whenToTake: 'When your abilities are your main source of damage, not basic attacks.',
            whoUsesIt: 'Fiora, Riven, ability-based fighters and some supports.',
          },
          {
            name: 'Legend: Bloodline',
            description: "Permanently gain lifesteal as you earn stacks. At max stacks you also gain max health.",
            whenToTake: "When you need sustain in lane and you're going into a long game without other healing.",
            whoUsesIt: 'Carries who want to self-sustain, especially in solo queue.',
          },
        ],
      },
      {
        slot: 3,
        runes: [
          {
            name: 'Coup de Grace',
            description: 'Deal 8% more damage to enemies who are below 40% health.',
            whenToTake: 'Default choice for most carries — makes finishing kills easier.',
            whoUsesIt: 'Most AD carries, assassins taking Precision secondary.',
          },
          {
            name: 'Cut Down',
            description: "Deal more damage to enemies who have more max health than you (up to 15% bonus).",
            whenToTake: "When the enemy team is stacking health — tanks, Mundo, Cho'Gath, etc.",
            whoUsesIt: 'Carries in tank-heavy metas, Quinn, Vayne.',
          },
          {
            name: 'Last Stand',
            description: 'Deal up to 11% more damage when you yourself are low health.',
            whenToTake: "When you're a champion who fights at low health and wins (e.g. you have healing or shielding abilities).",
            whoUsesIt: 'Aatrox, Samira, Xayah — champs who brawl at low HP.',
          },
        ],
      },
    ],
  },

  // ── DOMINATION ────────────────────────────────────────────────────────────
  {
    id: 'domination',
    name: 'Domination',
    color: '#c62f2f',
    tagline: 'Burst them before they react',
    summary:
      'Domination is the burst damage path. It helps you deal sudden, explosive damage to isolated targets. Assassins and junglers love this path because it lets them delete squishies in one combo and then disappear.',
    bestFor: ['Assassins', 'Junglers', 'Roaming mid laners', 'Champions who snowball early'],
    keystones: [
      {
        name: 'Electrocute',
        description:
          'Hit an enemy with 3 separate attacks or abilities and trigger a burst of bonus damage. Has a cooldown before it can proc again.',
        whenToTake:
          "When you can reliably land 3 hits in quick succession — perfect for most assassins who combo quickly.",
        whoUsesIt: "Zed, Talon, Katarina, Ahri, LeBlanc, Kha'Zix.",
      },
      {
        name: 'Predator',
        description:
          'Your boots gain an active ability: activate to channel briefly and then sprint at high speed toward an enemy. Your next attack deals bonus damage.',
        whenToTake:
          "When you need to cover huge distances to gank lanes from across the map. You become a roaming threat.",
        whoUsesIt: 'Hecarim, Warwick, Skarner, roam-heavy junglers and supports.',
      },
      {
        name: 'Dark Harvest',
        description:
          "Hitting a low-health enemy champion deals bonus damage and charges up your harvest. Collected souls permanently boost future damage. Gets stronger as the game goes on.",
        whenToTake:
          "When you're playing a scaling champion and expect the game to go long. Weak early, very strong late.",
        whoUsesIt: 'Karthus, Veigar, Shaco, late-game scaling carries.',
      },
      {
        name: 'Hail of Blades',
        description:
          "On entering combat, gain a huge burst of attack speed for your next 3 attacks. You can briefly exceed the attack speed cap.",
        whenToTake:
          "When you need to stack on-hit effects very fast, or you're a support/champion who needs one quick burst window.",
        whoUsesIt: "Kai'Sa, Kog'Maw, Twitch, Miss Fortune, Pyke.",
      },
    ],
    rows: [
      {
        slot: 1,
        runes: [
          {
            name: 'Cheap Shot',
            description: 'Deal bonus true damage to enemies who are movement-impaired (slowed, stunned, etc.).',
            whenToTake: 'When your kit has CC or you play with champions who have CC.',
            whoUsesIt: 'Most Domination primary champions who have slows or stuns.',
          },
          {
            name: 'Taste of Blood',
            description: 'Heal a small amount when you damage an enemy champion (every 20 seconds).',
            whenToTake: 'When you need lane sustain and take poke damage often.',
            whoUsesIt: 'Melee assassins who take poke in lane, some supports.',
          },
          {
            name: 'Sudden Impact',
            description: 'After using a dash, jump, or stealth, gain bonus lethality and magic penetration briefly.',
            whenToTake: 'When your champion has a gap-closer ability (dash, blink, or stealth) and you want more punch on your opener.',
            whoUsesIt: 'Zed, Talon, Ekko, Shaco, Kayn — mobile assassins.',
          },
        ],
      },
      {
        slot: 2,
        runes: [
          {
            name: 'Zombie Ward',
            description: 'Killing an enemy ward spawns a friendly ward in its place. Also grants bonus AP or AD.',
            whenToTake: "When you're sweeping wards frequently — good for junglers and roaming mid laners.",
            whoUsesIt: 'Junglers, roaming supports, vision-control players.',
          },
          {
            name: 'Ghost Poro',
            description: 'After a ward expires naturally, a Ghost Poro is placed there, giving you vision. Grants AP or AD.',
            whenToTake: 'When you want passive vision without actively destroying wards.',
            whoUsesIt: 'Less common — situational pick for scaling mages.',
          },
          {
            name: 'Eyeball Collection',
            description: "Earn stacks from champion and ward takedowns. At max stacks gain permanent bonus damage.",
            whenToTake: "Simple and effective choice when you're not focused on vision. Just play aggressively and it builds itself.",
            whoUsesIt: 'Most Domination primary users who want simple value.',
          },
        ],
      },
      {
        slot: 3,
        runes: [
          {
            name: 'Treasure Hunter',
            description: 'Earn bonus gold from bounties on unique champions you help kill.',
            whenToTake: 'When you want to snowball your lead into items faster.',
            whoUsesIt: 'Assassins and junglers who get early kills.',
          },
          {
            name: 'Ingenious Hunter',
            description: 'Reduces the cooldown of item actives per unique takedown.',
            whenToTake: 'When your build relies on active items (Galeforce, Stridebreaker, Everfrost, etc.).',
            whoUsesIt: 'Carries with many active items.',
          },
          {
            name: 'Relentless Hunter',
            description: 'Gain out-of-combat movement speed per unique champion takedown.',
            whenToTake: 'When you want to roam across the map quickly between kills.',
            whoUsesIt: 'Roaming champions, junglers, roam-heavy supports.',
          },
          {
            name: 'Ultimate Hunter',
            description: 'Permanently reduce the cooldown of your ultimate ability per unique champion takedown.',
            whenToTake: 'When your ultimate is the centre of your kit and you need it up as often as possible.',
            whoUsesIt: 'Karthus, Katarina, Lux, champions whose ult defines their power.',
          },
        ],
      },
    ],
  },

  // ── SORCERY ────────────────────────────────────────────────────────────────
  {
    id: 'sorcery',
    name: 'Sorcery',
    color: '#9faaff',
    tagline: 'Poke, control, and scale',
    summary:
      'Sorcery is the ability-power path. It rewards you for landing spells, controlling space with poke, and scaling into mid/late game. Mages and ability-focused champions use this path to amplify their spell damage and utility.',
    bestFor: ['Mages', 'Poke champions', 'Ability-heavy mid laners', 'Some supports'],
    keystones: [
      {
        name: 'Summon Aery',
        description:
          'Attacking or using an ability on an ally sends Aery to shield them. Using an ability on an enemy sends Aery to poke them. Aery returns to you automatically.',
        whenToTake:
          "When you poke constantly in lane or you're a support who shields/buffs allies often. Great for low-cooldown champions.",
        whoUsesIt: 'Lux, Karma, Sona, Orianna, Nami, Soraka — poke and enchanter champions.',
      },
      {
        name: 'Arcane Comet',
        description:
          'After you hit an ability, a comet falls from the sky onto that target for bonus damage. Slow or root enemies and the comet almost never misses.',
        whenToTake:
          "When you have crowd control to guarantee the comet lands, or your abilities deal sustained poke that keeps triggering it.",
        whoUsesIt: 'Lux, Xerath, Morgana, Brand, Zyra — AoE or CC-heavy mages.',
      },
      {
        name: 'Phase Rush',
        description:
          'Hit an enemy with 3 attacks or abilities quickly and gain a large burst of movement speed (and slow immunity for a moment).',
        whenToTake:
          "When you need to chase enemies down or escape after your combo. Also useful to kite — deal damage and then run away to avoid being hit back.",
        whoUsesIt: 'Cassiopeia, Singed, Ryze, Karthus — champions who want mobility during or after combos.',
      },
    ],
    rows: [
      {
        slot: 1,
        runes: [
          {
            name: 'Nullifying Orb',
            description: 'When you drop below 30% health from magic damage, gain a magic damage shield.',
            whenToTake: "When the enemy team has heavy AP damage and you're likely to take burst magic damage.",
            whoUsesIt: 'Mid laners into AP matchups.',
          },
          {
            name: 'Manaflow Band',
            description: "Hitting an enemy champion with an ability permanently increases your max mana (up to 250). Then restores 1% mana/sec when full.",
            whenToTake: "Almost always the default row 1 pick for mana-dependent mages. Free mana is always useful.",
            whoUsesIt: 'Most Sorcery primary mages and mana-hungry champions.',
          },
          {
            name: 'Nimbus Cloak',
            description: 'After using a Summoner Spell (Flash, Ignite, etc.) gain a burst of movement speed.',
            whenToTake: 'When you Flash aggressively to combo or escape, and want speed after doing so.',
            whoUsesIt: 'Niche — Twisted Fate, Katarina, champions who combo with Summoner Spells.',
          },
        ],
      },
      {
        slot: 2,
        runes: [
          {
            name: 'Transcendence',
            description: 'Gain ability haste at level 5 and 8. After level 11, killing a champion refunds a portion of your non-ultimate cooldowns.',
            whenToTake: 'When you want your abilities up more often. Near-universal pick for ability-spamming champions.',
            whoUsesIt: 'Most Sorcery primary champions.',
          },
          {
            name: 'Celerity',
            description: 'Bonus movement speed from any source is amplified. You also convert a portion of movement speed into AP or AD.',
            whenToTake: 'When your champion has movement speed boosts built into their kit or items.',
            whoUsesIt: 'Singed, Hecarim, Phase Rush champions, Twisted Fate with Boots CDR.',
          },
          {
            name: 'Absolute Focus',
            description: 'While above 70% health, gain bonus AP or AD.',
            whenToTake: "When you poke safely from a distance and rarely take damage — the bonus is permanent if you stay healthy.",
            whoUsesIt: 'Xerath, Lux, Ziggs — long-range mages who stay out of danger.',
          },
        ],
      },
      {
        slot: 3,
        runes: [
          {
            name: 'Scorch',
            description: 'Your first ability hit on an enemy every 10 seconds burns them for bonus magic damage.',
            whenToTake: 'When you poke in lane and want extra damage to finish off early trades. Better early game than Gathering Storm.',
            whoUsesIt: 'Lane bullies — Lux, Syndra, Brand in early-focused builds.',
          },
          {
            name: 'Waterwalking',
            description: 'Gain movement speed and AP or AD while in the river.',
            whenToTake: 'When you roam through the river frequently to affect other lanes.',
            whoUsesIt: 'Twisted Fate, Taliyah, roaming mid laners and junglers.',
          },
          {
            name: 'Gathering Storm',
            description: 'Every 10 minutes gain an increasing amount of AP or AD. Becomes very strong in long games.',
            whenToTake: 'When you expect the game to go 30+ minutes and you scale well into late game.',
            whoUsesIt: 'Veigar, Cassiopeia, Karthus — late-game scaling mages.',
          },
        ],
      },
    ],
  },

  // ── RESOLVE ────────────────────────────────────────────────────────────────
  {
    id: 'resolve',
    name: 'Resolve',
    color: '#64b77a',
    tagline: 'Absorb everything, never die',
    summary:
      'Resolve is the defensive path focused on surviving, sustaining, and protecting your team. Tanks and utility supports love this path because it lets them stay in fights longer, soak damage for their team, and engage without getting immediately destroyed.',
    bestFor: ['Tanks', 'Engage supports', 'Top lane juggernauts', 'Defensive bruisers'],
    keystones: [
      {
        name: 'Grasp of the Undying',
        description:
          'Every 4 seconds your next basic attack against a champion deals bonus magic damage, heals you, and permanently increases your max health by 5.',
        whenToTake:
          'When you want to win short trades in lane and gradually become harder to kill as the game goes on. Max health builds up over the whole game.',
        whoUsesIt: 'Darius, Garen, Ornn, Malphite, Poppy — lane bullies and tanks who trade often.',
      },
      {
        name: 'Aftershock',
        description:
          'After you immobilise an enemy champion (stun, root, pull, etc.) you briefly gain massive bonus resistances, then explode for AoE damage.',
        whenToTake:
          'When your kit has hard crowd control. You become nearly unkillable for a moment right after you land CC, then blast enemies nearby.',
        whoUsesIt: 'Nautilus, Leona, Malphite, Blitzcrank, Amumu — engage tanks.',
      },
      {
        name: 'Guardian',
        description:
          'Standing near an ally will automatically shield both of you if either takes sudden burst damage (after a small delay).',
        whenToTake:
          "When you play an enchanter or passive support who stays glued to one carry. The automatic shield helps your ADC survive burst.",
        whoUsesIt: 'Lulu, Soraka, Karma, Janna, Taric — defensive enchanters and peel supports.',
      },
    ],
    rows: [
      {
        slot: 1,
        runes: [
          {
            name: 'Demolish',
            description: 'Charge up while near a turret and release a powerful single blow that deals bonus damage to the tower.',
            whenToTake: 'When you split push or want to punish enemies by taking towers after winning a fight.',
            whoUsesIt: 'Top lane tanks, Tryndamere, split-push champions.',
          },
          {
            name: 'Font of Life',
            description: "Slowing or immobilising an enemy champion marks them. Your allies who attack marked champions are healed.",
            whenToTake: "When you're a CC-heavy support and want to passively heal your carry every time you peel for them.",
            whoUsesIt: 'Engage supports, Lulu, Braum, Nautilus support.',
          },
          {
            name: 'Shield Bash',
            description: 'While shielded, your next basic attack deals bonus damage and you gain bonus resistances.',
            whenToTake: 'When your champion has a built-in shield (Janna, Orianna, Nautilus, etc.) and you auto-attack often.',
            whoUsesIt: 'Nautilus, Orianna, Janna, Riven — champions with shields who trade often.',
          },
        ],
      },
      {
        slot: 2,
        runes: [
          {
            name: 'Conditioning',
            description: 'After 12 minutes in the game, gain bonus armor and magic resistance, and all resistances become 5% stronger.',
            whenToTake: 'When you want to be a late-game tank. Worthless early, very strong once it kicks in.',
            whoUsesIt: 'Full tank builds — Malphite, Ornn, Amumu, Rammus.',
          },
          {
            name: 'Second Wind',
            description: 'After taking damage from an enemy champion, regenerate a portion of missing health over 10 seconds.',
            whenToTake: 'When you face heavy poke in lane and need to regen health between trades.',
            whoUsesIt: 'Darius, Garen, tanks in poke-heavy matchups.',
          },
          {
            name: 'Bone Plating',
            description: 'After taking damage from an enemy champion, the next 3 abilities or attacks against you deal reduced damage (cooldown every 45 seconds).',
            whenToTake: 'When the enemy has a burst combo (assassin or mage) and you want to soften the first rotation of their combo.',
            whoUsesIt: 'Tanks into burst lanes, bruisers against assassins.',
          },
        ],
      },
      {
        slot: 3,
        runes: [
          {
            name: 'Overgrowth',
            description: 'Nearby minions and monsters that die permanently increase your max health by a small amount.',
            whenToTake: 'When you want to scale into a massive health pool. Gets stronger the longer the game goes.',
            whoUsesIt: "Late-game tanks — Cho'Gath, Nasus, Ornn.",
          },
          {
            name: 'Revitalize',
            description: 'Increase the power of all shields and heals you give or receive. The bonus increases further when targets are low health.',
            whenToTake: "When you're a healer or shielder support, or your own kit heals you.",
            whoUsesIt: 'Soraka, Nami, Lulu, Yuumi, Aatrox (self-heal), Mundo.',
          },
          {
            name: 'Unflinching',
            description: "Gain tenacity and slow resistance for each second you're in combat. Also gain a small amount based on missing health.",
            whenToTake: 'When the enemy has a lot of slows and CC and you need to keep moving through it.',
            whoUsesIt: 'Tanks and bruisers against CC-heavy comps. Udyr, Hecarim, Dr. Mundo.',
          },
        ],
      },
    ],
  },

  // ── INSPIRATION ────────────────────────────────────────────────────────────
  {
    id: 'inspiration',
    name: 'Inspiration',
    color: '#50cdc0',
    tagline: 'Break the rules, play differently',
    summary:
      "Inspiration is the wildcard path. Its runes bend or break normal game rules — free boots, extra biscuits, modified items. It rewards creative and off-meta play. New players usually take it as a secondary path for the utility runes rather than a primary.",
    bestFor: ['Off-meta builds', 'Poke mages', 'Champions who want early game sustain', 'Experienced players trying creative setups'],
    keystones: [
      {
        name: 'Glacial Augment',
        description:
          'Your basic attacks slow enemies and create slowing zones (Ice Lanes) where your slow lands. Active items also create slowing fields. Great for peel and kiting.',
        whenToTake:
          "When you want to control space and make it very hard for enemies to reach your carries. Strong on champions who can keep attacking at a safe distance.",
        whoUsesIt: "Kog'Maw, Ashe, Twisted Fate, Senna — kiting or poke-heavy champions.",
      },
      {
        name: 'First Strike',
        description:
          'If you damage an enemy before they damage you, enter First Strike and deal 10% bonus damage for 3 seconds. While active, all damage dealt grants bonus gold.',
        whenToTake:
          "When you poke enemies safely before they can fight back, and want bonus gold for doing so. Very strong on long-range champions.",
        whoUsesIt: 'Ezreal, Gangplank, Jayce, Kennen — poke-centric champions who have safe openers.',
      },
      {
        name: 'Unsealed Spellbook',
        description:
          'Swap out your Summoner Spells (like Flash or Ignite) for different ones during the game. This lets you adapt — use Ignite early, swap to Teleport for later.',
        whenToTake:
          'When you want flexibility. Advanced rune — requires knowledge of which Summoner Spells help at each game stage.',
        whoUsesIt: 'Twisted Fate, Pantheon, experienced players comfortable adapting their Summoner Spells.',
      },
    ],
    rows: [
      {
        slot: 1,
        runes: [
          {
            name: 'Hextech Flashtraption',
            description: 'Replace Flash with Hexflash — a channel that blinks you through walls and terrain.',
            whenToTake: 'When you want to Flash through walls for surprise angles on enemies. Cooldown is longer, but wall-jumping opens creative plays.',
            whoUsesIt: 'Blitzcrank, Hecarim, Malphite — champions whose engages benefit from surprise angles.',
          },
          {
            name: 'Magical Footwear',
            description: 'At 12 minutes (or earlier with takedowns) you receive free Slightly Magical Boots — no gold cost. But you cannot buy regular boots.',
            whenToTake: 'When you want to save 300 gold on boots and prefer to spend it on core items instead. Delays your boots by several minutes though.',
            whoUsesIt: 'Most champions as a secondary — very common pick for the free gold value.',
          },
          {
            name: 'Cash Back',
            description: 'Refunds 20% of the cost when you buy a Legendary item.',
            whenToTake: 'When your build includes expensive Legendary items and you want a discount to hit your power spikes faster.',
            whoUsesIt: 'Champions with high-cost Legendary items like Locket, Sunfire, Riftmaker.',
          },
        ],
      },
      {
        slot: 2,
        runes: [
          {
            name: 'Triple Tonic',
            description: 'Gain 3 free elixirs over the course of the game, each at a different game stage.',
            whenToTake: 'When you want consistent power boosts throughout the game without the gold cost.',
            whoUsesIt: 'A variety of champions as a secondary row pick.',
          },
          {
            name: 'Time Warp Tonic',
            description: "Consuming a potion immediately grants some of its effect. Movement speed is also boosted while under a potion effect.",
            whenToTake: "When you're taking Biscuit Delivery and want to get the health/mana instantly rather than waiting for the tick-over.",
            whoUsesIt: 'Often paired with Biscuit Delivery on lane sustain builds.',
          },
          {
            name: 'Biscuit Delivery',
            description: 'Receive free Biscuits at 2, 4, and 6 minutes. Each biscuit restores health and mana, and permanently increases your max mana.',
            whenToTake: 'When you take a lot of poke in lane and need extra sustain to survive early. Very popular secondary choice.',
            whoUsesIt: 'Extremely common secondary rune — mages, ADCs, anyone in a tough lane.',
          },
        ],
      },
      {
        slot: 3,
        runes: [
          {
            name: 'Cosmic Insight',
            description: 'Gain ability haste on Summoner Spells and item actives (reduces their cooldowns).',
            whenToTake: 'When you rely on Flash or other Summoner Spells often, or your build has many active items.',
            whoUsesIt: 'Supports, Summoner Spell-reliant champions.',
          },
          {
            name: 'Approach Velocity',
            description: "Gain movement speed toward allied champions who are CC'd or toward enemies you personally CC.",
            whenToTake: 'When you want to quickly close on a target you just slowed or stunned, or rush to peel for an ally who got caught.',
            whoUsesIt: 'Engage supports, slow-heavy ADCs like Ashe.',
          },
          {
            name: 'Jack Of All Trades',
            description: 'Each different stat bonus you get from items grants a stack. Enough stacks give you a significant bonus to all stats.',
            whenToTake: 'When your item build naturally uses many different stat types (AD, AP, crit, armor, etc.). Builds itself passively.',
            whoUsesIt: 'Niche — versatile item builders, some bruisers and supports.',
          },
        ],
      },
    ],
  },
]

// ── Helper to get a path by id ─────────────────────────────────────────────
export function getRunePath(id: string): RunePath | undefined {
  return RUNE_PATHS.find((p) => p.id === id)
}

// ── Flat list of all keystones across all paths ────────────────────────────
export function getAllKeystones(): Array<RuneInfo & { pathName: string; pathColor: string }> {
  return RUNE_PATHS.flatMap((path) =>
    path.keystones.map((ks) => ({
      ...ks,
      pathName: path.name,
      pathColor: path.color,
    })),
  )
}
