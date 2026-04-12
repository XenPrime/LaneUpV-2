// ── ARCHETYPES ─────────────────────────────────────────────────────────────
// Matchup data for all 172 champions via archetype templates + specific overrides.
// Data Dragon 16.7.1 used for champion tags.

export type Archetype =
  | 'Bruiser'
  | 'Skirmisher'
  | 'Assassin'
  | 'BattleMage'
  | 'Mage'
  | 'Enchanter'
  | 'EngageSupport'
  | 'Marksman'
  | 'Tank'

export interface MatchupTemplate {
  threatLevel: 'Low' | 'Medium' | 'High'
  tradingTip: string
  watchOut: string
  winCondition: string
  phaseTips: { early: string; mid: string; late: string }
}

export interface ChampionMatchup extends MatchupTemplate {
  championName: string
  archetype: Archetype
}

// ── ARCHETYPE TEMPLATES ────────────────────────────────────────────────────
// Base tips for every champion by their archetype. All 172 champions inherit
// from one of these nine templates. Specific overrides refine popular picks.

export const ARCHETYPE_TEMPLATES: Record<Archetype, MatchupTemplate> = {
  Bruiser: {
    threatLevel: 'High',
    tradingTip:
      'Short trades always favor them. Poke from range, back off immediately, and never let them stack their passive or proc their kit. Avoid all-ins until they are low on health.',
    watchOut:
      'Gap closers and passive stacking. Bruisers become nearly unkillable once they get ahead. Respect their level 6 power spike.',
    winCondition:
      'Use your range advantage to chip them down. Kite backwards, use terrain to separate them from you, and look for a fight when their gap closer or ult is on cooldown.',
    phaseTips: {
      early:
        'Farm safely and poke when you have range. Do not let them walk up for free extended trades. Respect level 2 and level 6 all-ins.',
      mid:
        'Avoid narrow corridors where they can lock you down. Play in open spaces where you can kite. Do not solo fight them without a lead.',
      late:
        'They become extremely tanky with items. Never 1v1 unless you have a large gold lead. Focus them last in teamfights and let your team peel.',
    },
  },
  Skirmisher: {
    threatLevel: 'High',
    tradingTip:
      'Skirmishers have extended trade mechanics that scale up over a fight. Keep trades short, burst them quickly, and disengage before their damage ramps. They win long fights.',
    watchOut:
      'Mobility and extended trade mechanics. Most skirmishers have a dash or a way to stick on you. Their damage increases over the course of a fight.',
    winCondition:
      'Punish them early before they get their core items. Respect their 1v1 at levels 5 and 6. Hard CC counters their mobility so group with teammates who have CC.',
    phaseTips: {
      early:
        'Play carefully levels 1 through 3. They are often weaker before their full kit is online. Poke if you have range but do not overextend.',
      mid:
        'Avoid 1v1 situations without hard CC or a major gold lead. They scale well and 1v1 most champions in this phase.',
      late:
        'They become very strong 1v1. Play around your team instead of trying to duel. Their strength is split or skirmish, so group and take objectives.',
    },
  },
  Assassin: {
    threatLevel: 'High',
    tradingTip:
      'Do not trade when their burst combo is available. Play at maximum range and wait for them to use their abilities on a wave. Trade only when their key ability is on cooldown.',
    watchOut:
      'One-shot burst combos and roaming. Assassins kill you instantly when ahead. Track their whereabouts and ping your team when they disappear from lane.',
    winCondition:
      'Build early health or magic resistance. Punish their cooldowns after they use their burst on a wave. Ping their roams immediately so your team does not die.',
    phaseTips: {
      early:
        'Play at max range and note when their key ability is used on wave. That is your window to trade. Track their mana.',
      mid:
        'Ward their most common roam paths. Ping the moment they leave lane. Losing a tower is better than your teammates dying to a fed assassin.',
      late:
        'Assassins deal less relative damage when your team has shields and heals. Play grouped and let supports peel. Do not get caught alone.',
    },
  },
  BattleMage: {
    threatLevel: 'Medium',
    tradingTip:
      'Keep trades short and avoid standing inside their damage zones. They win fights where they can channel sustained AoE. Burst them quickly and leave.',
    watchOut:
      'Sustained AoE damage and zone control. Standing still in their abilities is how you lose. They punish players who do not move.',
    winCondition:
      'Stay mobile and dodge their key abilities. Burst them before they can ramp their damage. They are usually weaker in short trades before their damage stacks up.',
    phaseTips: {
      early:
        'Dodge their poke and do not stand in their ground-targeted abilities. They reward passive farming so pressure them with poke.',
      mid:
        'Keep moving at all times. Their power comes from sustained damage on targets who stand still. Burst and disengage.',
      late:
        'Very dangerous in teamfights because of AoE. Do not group tightly. Disengage when they use their ultimate.',
    },
  },
  Mage: {
    threatLevel: 'Medium',
    tradingTip:
      'Sidestep their skill shots, then trade. Their damage is entirely tied to landing abilities. When their key spell misses, immediately punish.',
    watchOut:
      'Long-range poke and CC combos. Most mages have a reliable CC spell that enables their full damage. Do not get hit by it.',
    winCondition:
      'Get on top of them. Mages are very squishy in close range. Close the gap when their CC ability is on cooldown and burst them down.',
    phaseTips: {
      early:
        'Sidestep their skill shots and all-in when their CC spell is on cooldown. They push wave slowly so you have time to roam.',
      mid:
        'After you dodge their poke, look for roam opportunities. Their wave clear can be slow. Punish their cooldowns.',
      late:
        'Stand spread in teamfights to avoid their AoE. They are a priority target. Engage when their spells are down.',
    },
  },
  Enchanter: {
    threatLevel: 'Low',
    tradingTip:
      'Enchanters are weak in direct trades. Burst them before they can heal or shield. Avoid letting them peel for their carry.',
    watchOut:
      'Crowd control disguised as utility. Many enchanters have a knock-up, slow, or polymorph. Their ability to shield their carry makes the enemy duo unkillable.',
    winCondition:
      'Build anti-heal items. Target their carry and kill the enchanter when they try to peel. All-in early when enchanters are at their weakest.',
    phaseTips: {
      early:
        'Bully them in lane. They have low base damage and thin armor. Aggressive early play wins the lane before they build items.',
      mid:
        'Target their carry in skirmishes. The enchanter will try to save their carry with shields and heals. Burn their cooldowns first.',
      late:
        'Their shields and heals make their carry nearly unkillable. Anti-heal is essential. Assassinate the enchanter first when you can.',
    },
  },
  EngageSupport: {
    threatLevel: 'High',
    tradingTip:
      'Stay behind minions and never walk forward near the river without vision. They deal massive damage with their CC chain. One good engage and the lane is over.',
    watchOut:
      'Hooks, grabs, and CC chains. Missing a CC ability is their biggest weakness. Bait out their engage tool then punish immediately.',
    winCondition:
      'Stay out of hook or grab range at all times. When they miss their key engage ability, that is the window to all-in. Use bushes to break vision.',
    phaseTips: {
      early:
        'Stand behind minions every single wave. Never walk near the river brush without vision. One early hook can snowball the entire lane.',
      mid:
        'Ward their most common roam paths. They can create picks in other lanes easily. Track them on the minimap.',
      late:
        'Their CC chain can end a teamfight instantly. Stay mobile and position away from the engage angle. Let your team spread out before fights.',
    },
  },
  Marksman: {
    threatLevel: 'Medium',
    tradingTip:
      'Marksmen are weak before two or three items. Short trades when their abilities are on cooldown. Close the gap and they deal very little damage in melee range.',
    watchOut:
      'Kiting and sustained damage at range. Once they have attack speed and crit items they deal enormous DPS. They win fights where they can kite freely.',
    winCondition:
      'Close the gap and stay on top of them. They have almost no damage in melee range. Engage when they cannot kite. Punish them before two items.',
    phaseTips: {
      early:
        'Marksmen are weak early. Be aggressive and force trades before they have their core items. They die easily to all-ins.',
      mid:
        'Do not let them farm freely. Pressure them or help your team make plays before they reach two items.',
      late:
        'They become very dangerous late game. Engage on them before they can position. Do not let them kite your team.',
    },
  },
  Tank: {
    threatLevel: 'Low',
    tradingTip:
      'Tanks deal very little damage. Do not waste time trading with them. Focus their carries and let the tank run into you without reacting.',
    watchOut:
      'Engage ultimates and CC chains. While tanks deal minimal damage their CC sets up instant kills for their team. Never ignore their engage potential.',
    winCondition:
      'Build armor penetration or magic penetration to melt them eventually. Focus their carries in fights. Punish tanks who overextend without their team.',
    phaseTips: {
      early:
        'Poke them if you have range but do not overcommit. They have strong base resistances. Do not fall behind by fighting a tank.',
      mid:
        'They deal almost no damage. Rotate and kill their carries instead. Do not 1v1 a tank unless you have penetration items.',
      late:
        'Their engage is fight-ending. Do not clump. Have escape tools ready and disengage from their ultimate.',
    },
  },
}

// ── CHAMPION-SPECIFIC OVERRIDES ───────────────────────────────────────────
// Refine or replace archetype template tips for the most common picks.

export const CHAMPION_OVERRIDES: Partial<Record<string, Partial<ChampionMatchup>>> = {
  // TOP LANERS
  Darius: {
    threatLevel: 'High',
    watchOut:
      'His passive Hemorrhage stacks bleed. Five stacks means he executes you. Never let him land five autos or abilities in one trade.',
    winCondition:
      'Ranged champions beat him early. Melee into Darius is very hard. Poke from range and disengage before five stacks. Dodge his Q outer ring.',
    phaseTips: {
      early:
        'Never let him land his full Q. Stand at max range. His level 6 with Noxian Guillotine is a guaranteed kill if you are at 50% health.',
      mid:
        'He becomes the king of 1v1 with two items. Avoid fighting him alone. Group and do not let him split push freely.',
      late:
        'If he gets fed he deletes your carries instantly. Peel him away from your team and never let him stack on your backline.',
    },
  },
  Garen: {
    threatLevel: 'Medium',
    watchOut:
      'His Silence prevents you from using abilities for 1.5 seconds and he uses that window to spin into you. His level 6 execute kills you at low health.',
    winCondition:
      'Poke him in the window after his Silence is used on cooldown. He has no gap closer besides one short dash so kite backwards. Thornmail counters his healing.',
    phaseTips: {
      early:
        'Poke him between his E cooldowns. Never fight him inside a bush where he gets his passive faster. Walk out of his Silence range.',
      mid:
        'He will split push. Either match him or take another objective. Do not let him siege alone.',
      late:
        'His ult executes squishy targets. Keep your carries healthy and above 50%. Garen is not a major teamfight threat but his ult punishes low health targets.',
    },
  },
  Nasus: {
    threatLevel: 'Medium',
    watchOut:
      'Every 3-stack he gets makes his Q stronger for the rest of the game. Denying his farm early is the only way to reduce his late-game threat.',
    winCondition:
      'Bully him early and deny stacks. He is very weak before 200 stacks. His late-game is almost unwinnable so end or take objectives before 30 minutes.',
    phaseTips: {
      early:
        'Zone him off his minions and punish him every time he walks up to last-hit. He is one of the weakest champions at level 1 through 5.',
      mid:
        'He spikes at level 11 and two items. Avoid 1v1s now. Call for your team to take objectives before he gets too many stacks.',
      late:
        'A stacked Nasus is nearly unkillable. Group and win teamfights. Never try to 1v1 him. Kite him with your team.',
    },
  },
  Renekton: {
    threatLevel: 'High',
    watchOut:
      'His level 1 to 3 is one of the strongest in the game. His fury-empowered W stuns and resets his Q. One full combo at level 2 takes half your health bar.',
    winCondition:
      'Survive his early lane bully and scale. He falls off after 30 minutes. Engage on him when his Slice-and-Dice dash is on cooldown.',
    phaseTips: {
      early:
        'Play defensively levels 1 to 4. He wins almost every early trade. Farm under tower and wait for him to use his dash before punishing.',
      mid:
        'He is at his strongest here with two items. Do not 1v1. Rotate and fight with your team.',
      late:
        'He falls off hard. Your champion likely outscales him. Take over the game by late if you survived the early lane.',
    },
  },
  Sett: {
    threatLevel: 'High',
    watchOut:
      'His W Haymaker absorbs your damage as a shield and returns it. Never dump your full burst into him when his W bar is glowing. Back off when he windup his fists.',
    winCondition:
      'Disengage when his W is charged. His ult Showstopper grabs you and slams your teammates so never stand behind your team near him.',
    phaseTips: {
      early:
        'Short trades only. He wins extended brawls. Poke and back off before he can get five autos on you.',
      mid:
        'Watch his W grit bar. Never burst him when he has a large shield ready.',
      late:
        'His ult flips teamfights. Stand spread from teammates so he cannot body-slam you into your own team.',
    },
  },
  Volibear: {
    threatLevel: 'High',
    watchOut:
      'His passive lets him heal to 30% health when he drops very low. Do not stop attacking him when he triggers the passive or he heals for a massive amount.',
    winCondition:
      'Burst him through his passive heal instantly. He is weakest in ranged matchups before his armor items. His ult disables towers briefly.',
    phaseTips: {
      early:
        'Ranged champions beat him early. Respect his E flip and Q dash combo. Never let him land a full combo from long range.',
      mid:
        'He spikes hard at level 9. His damage becomes massive. Respect his all-in.',
      late:
        'Very durable teamfighter. He should be peeled not focused. Kite him and let your carries deal the damage.',
    },
  },
  Malphite: {
    threatLevel: 'Medium',
    watchOut:
      'His ult Unstoppable Force is one of the most game-changing AoE crowd controls in the game. Never group tightly with your team when he is alive.',
    winCondition:
      'Poke him down before he can ult. Magic damage counters him early before he builds armor. His laning is very passive so harass freely.',
    phaseTips: {
      early:
        'Poke him down. He farms passively and has no real kill threat early. Push him under tower and roam.',
      mid:
        'Respect his ult. Never stand with your teammates in a straight line. He only needs to land his ult to win a teamfight.',
      late:
        'His job is to ult your carries. Stand spread and have Flash available to dodge his ult. Engage first to force his ult on one target.',
    },
  },
  'Dr. Mundo': {
    threatLevel: 'Medium',
    watchOut:
      'His ultimate Sadism heals him for up to 50% of his max HP over 12 seconds. Grievous Wounds cuts his healing so build anti-heal before fighting him.',
    winCondition:
      'Build anti-heal (Mortal Reminder, Thornmail). Poke him down and fight him when his ultimate is not available. He is weak to burst before anti-heal items.',
    phaseTips: {
      early:
        'Dodge his Infected Bonesaw cleaver. His W punishes standing close to him. Ranged champions bully him hard in lane.',
      mid:
        'He becomes very tanky. Build anti-heal. His damage with Flaming Chompers and W is higher than it looks.',
      late:
        'Near unkillable with full tank items and ult. Ignore him and kill his team. He deals very little damage late.',
    },
  },
  Illaoi: {
    threatLevel: 'High',
    watchOut:
      'Her tentacles deal massive damage when she pulls your spirit with E. Never stand near a tentacle cluster when she has her E available.',
    winCondition:
      'Fight her in the open away from tentacles. She is weakest when her E and W are on cooldown. Poke from range and never stand near walls with tentacles.',
    phaseTips: {
      early:
        'Destroy tentacles near you. Never let her land her E Spirit Grasp. She is very weak when you force her to fight without tentacles nearby.',
      mid:
        'She becomes a split push monster. Either match her or make plays elsewhere. Her 1v1 in her tentacle zone is unwinnable.',
      late:
        'Her ult summons more tentacles in teamfights. Fight her away from walls. She is much weaker in open areas.',
    },
  },
  Mordekaiser: {
    threatLevel: 'High',
    watchOut:
      'His ult Realm of Death isolates you in a 1v1 dimension. If you are behind do not stay near him at level 6. His ult steals your stats temporarily.',
    winCondition:
      'Poke him from range before he can close the gap. Cleanse or Quicksilver Sash cancels his ult. Build grievous wounds against his healing.',
    phaseTips: {
      early:
        'Poke him with abilities. He is melee and has short range early. Punish him when his E is on cooldown.',
      mid:
        'Respect his ult. If he ults you in the dragon realm try to kill him or run to the edge to exit faster.',
      late:
        'His ult on your carry wins teamfights instantly. Zone him away with CC. Build grievous wounds.',
    },
  },
  // SKIRMISHERS
  Aatrox: {
    threatLevel: 'High',
    watchOut:
      'His Q World Ender deals massive damage in the sweet spot. Stand at the side or edge of his Q circles not in the center. His ult passive heals him back from near death.',
    winCondition:
      'Stand at the tip of his Q circles not the center. Build grievous wounds early. His healing is what makes him unkillable so cut it.',
    phaseTips: {
      early:
        'Dodge the center of his Q. He wins most extended trades early. Short trades only. Do not get hit by his E chain.',
      mid:
        'He spikes hard with two items and his ultimate. Do not 1v1 him. Group up.',
      late:
        'His revive passive on his ult makes him nearly unkillable. Build grievous wounds. He is a frontline that does carry damage.',
    },
  },
  Fiora: {
    threatLevel: 'High',
    watchOut:
      'Her passive reveals Vitals on your body in four locations. Hitting a Vital heals her. Never let her hit four Vitals as it gives her a huge heal and damage burst.',
    winCondition:
      'Parry or block her riposte with an ability. Move constantly to prevent Vital hits. Disengage before she can proc four Vitals. She is weaker at level 1.',
    phaseTips: {
      early:
        'Move constantly to prevent her Vital from facing you. She is beatable at level 1 to 2 but becomes very strong at level 3 with her full kit.',
      mid:
        'One of the best 1v1 duelists in the game. Never fight her alone with her full kit available.',
      late:
        'Her ult on your entire team is a massive AoE heal if she completes it. Interrupt her ult or disengage from it.',
    },
  },
  Irelia: {
    threatLevel: 'High',
    watchOut:
      'Her W stuns if you are above 40% health. She resets her Q with minion kills. Do not fight her near a full wave as she can dash infinitely and stun you.',
    winCondition:
      'Clear minions so she cannot reset Q dashes. Fight her after she has used her E mark. Stagger her before she builds stacks.',
    phaseTips: {
      early:
        'She is weakest before five stacks on her passive. Poke her without letting her stack up. Clear waves to deny her Q resets.',
      mid:
        'Full stacks Irelia is nearly unstoppable 1v1. Group up and use CC to peel her.',
      late:
        'Her ult AoE knockup sets up team engages. Respect her flank. She dives your backline very effectively.',
    },
  },
  Camille: {
    threatLevel: 'High',
    watchOut:
      'Her E Hookshot sticks her to a wall and then dashes at you. Her ult Hextech Ultimatum traps you in a zone with only her. Do not fight her in her ult.',
    winCondition:
      'Use Flash or mobility to escape her ult zone. Stay away from walls so she cannot wall-dash to you. Fight her before level 6.',
    phaseTips: {
      early:
        'She is weakest before level 3 and her full E. Short trades and back off before her True Grit shield activates.',
      mid:
        'Her ult traps you solo. Keep Flash ready and use it to escape the hexagon. Never stand near a wall.',
      late:
        'Excellent split pusher and flanker. Ward both sides of the map and never get caught alone by her.',
    },
  },
  Jax: {
    threatLevel: 'High',
    watchOut:
      'His E Counter Strike dodges all basic attacks and stuns when he activates it. Never auto-attack him during his E. His level 7 tower dive is very strong.',
    winCondition:
      'Poke him with abilities during his E. Use abilities not basic attacks when his E is active. Beat him early before he gets Trinity Force.',
    phaseTips: {
      early:
        'He is weaker before Trinity Force. Punish him early levels but respect his E stun. Do not auto him while his E lamp is glowing.',
      mid:
        'After Trinity Force he 1v1s almost anyone. Respect his burst. Group up.',
      late:
        'He becomes one of the strongest 1v1 champions in the game. He will split push and 1v2. Send two people to deal with him.',
    },
  },
  Tryndamere: {
    threatLevel: 'High',
    watchOut:
      'His ult Undying Rage makes him literally unkillable for 5 seconds. Never commit to killing him when his ult is available. Disengage and wait it out.',
    winCondition:
      'Hard CC counters his ult since he still takes damage and can be CC-d. Bait his ult then disengage. Ranged champions bully him in lane.',
    phaseTips: {
      early:
        'Poke him from range. He needs fury stacks to deal maximum damage. Ranged champions win the early lane easily.',
      mid:
        'He split pushes with teleport and becomes very fast with items. Match his split or group.',
      late:
        'His ult makes him unstoppable briefly. Have CC to lock him down during his ult. Do not waste bursts on him during Undying Rage.',
    },
  },
  Riven: {
    threatLevel: 'High',
    watchOut:
      'Her combo does enormous burst damage when she hits her third Q. She dashes three times with Q and can chain CC into her ult for a quick kill.',
    winCondition:
      'Poke her from range. She is weak when her Q and E are on cooldown. Build armor early. She falls off a bit late compared to other fighters.',
    phaseTips: {
      early:
        'She is very weak before level 3. Punish her before she has her full kit. Level 2 trades favor her so be careful.',
      mid:
        'Peak power with two items. Extremely hard to fight 1v1. Group up and fight together.',
      late:
        'Still strong but less dominant. Peel her off your carries. She snowballs very hard from early leads.',
    },
  },
  Yone: {
    threatLevel: 'High',
    watchOut:
      'His E Soul Unbound sends his soul forward dealing damage. When he returns he deals bonus damage. His ult Last Breath suspends your whole team.',
    winCondition:
      'Poke him after his E soul dash before he returns. He deals more damage after returning. Punish him when his ult is down.',
    phaseTips: {
      early:
        'Weak before level 3. Poke him between his Q dashes. He needs two items to deal massive damage.',
      mid:
        'Very strong skirmisher. His sustained damage and mobility make him hard to catch. Respect his all-in.',
      late:
        'His ult in a teamfight is devastating. He suspends your entire team. Have CC ready to cancel his channel or burst him before he casts it.',
    },
  },
  Yasuo: {
    threatLevel: 'High',
    watchOut:
      'His Windwall blocks all projectiles. Do not aim skillshots at his Windwall. His ult Last Breath requires a knock-up to activate.',
    winCondition:
      'Punish him between Q tornadoes. He needs to stack his Q three times for the tornado so dodge the first two. Never bunch up near his lane partners.',
    phaseTips: {
      early:
        'Very hard early into long-range poke. Poke him between Q stacks. His shield from his passive resets quickly so poke twice to break it.',
      mid:
        'Two Crit items make him deal massive damage. Respect his mobility.',
      late:
        'His ult with any knock-up sets up massive combos. Do not stand near knock-up champions. Burst him before he can use his ult.',
    },
  },
  // MID LANERS
  Zed: {
    threatLevel: 'High',
    watchOut:
      'His ult Mark of the Death is a delayed burst that lands after he completes his full WQE combo. The damage arrives late so you think you survived until you suddenly die.',
    winCondition:
      'Buy Zhonya\'s Hourglass. Use it the moment he ults you and his burst will miss entirely. Play away from his shadow when he Wes.',
    phaseTips: {
      early:
        'He is weaker before level 6. Poke him with abilities. His early game requires mana and shadow positioning to deal damage.',
      mid:
        'Extreme kill pressure after level 6. Have Zhonya\'s active ready at all times. Watch for his shadow on the side of you.',
      late:
        'Snowball-dependent. If he is not ahead he falls off. Buy armor and do not let him roam.',
    },
  },
  Talon: {
    threatLevel: 'High',
    watchOut:
      'One of the best roamers in the game. He roams faster than almost any champion with his wall-jumping passive. He will roam constantly after level 6.',
    winCondition:
      'Shove the wave before he can roam. Ping when he disappears. Punish his roams by pushing his tower. Buy armor early.',
    phaseTips: {
      early:
        'He is weaker before level 6. Poke him. Push the wave so he loses tower plates when he roams.',
      mid:
        'Extremely dangerous roamer. Ward the side bushes and ping his position every time he leaves lane.',
      late:
        'Falls off in extended teamfights. He deals burst but has no sustained damage. Group up and do not let him pick off isolated targets.',
    },
  },
  Katarina: {
    threatLevel: 'High',
    watchOut:
      'Her ult Death Lotus deals massive damage to multiple targets. Hard CC cancels her ult entirely. Do not group tightly near her.',
    winCondition:
      'Hard CC cancels her ult. Keep stuns and knockups for when she ults. She resets with daggers so pick up her dagger positions to deny resets.',
    phaseTips: {
      early:
        'Poke her from range. She is weak before two items and without daggers. Do not let her reset freely in all-ins.',
      mid:
        'Her roam is very fast. She will try to get kills in other lanes. Ward and ping when she disappears.',
      late:
        'Extremely dangerous in teamfights. CC cancels her ult. Keep your knockup or stun for when she ults.',
    },
  },
  Akali: {
    threatLevel: 'High',
    watchOut:
      'Her smoke bomb makes her invisible and she gains untargetability inside it. You cannot target her with most spells inside the smoke.',
    winCondition:
      'Poke her before level 6. Her shroud requires management so zone her away from her smoke. Grievous wounds counters her passive heal.',
    phaseTips: {
      early:
        'Bully her before level 3. She is weak early and her shroud requires energy. Poke aggressively.',
      mid:
        'Her two-form burst after level 6 with full items is enormous. Respect her all-in.',
      late:
        'Very mobile. Hard to catch and impossible to hit inside her shroud. Build tenacity and anti-heal.',
    },
  },
  LeBlanc: {
    threatLevel: 'High',
    watchOut:
      'Her burst is instant at level 6 with her mimic. She can kill a squishy target in under one second with a full combo. Her W clone makes it hard to know which one to hit.',
    winCondition:
      'Build early health. She cannot kill you if you are above 70% health reliably. Punish her after she uses her W-return.',
    phaseTips: {
      early:
        'Very high poke with her Q chain. Stay at full health or she has kill pressure. Build health early.',
      mid:
        'Extreme burst after level 6. Do not stay at 50% health near her. Have flash ready.',
      late:
        'Scales with burst items. A fed LeBlanc one-shots backline. Group and do not let her flank alone.',
    },
  },
  Ahri: {
    threatLevel: 'High',
    watchOut:
      'Her E Charm is a narrow-angle CC that enables her full combo. If she hits her Charm she will deal near-lethal damage. Sidestep it at all costs.',
    winCondition:
      'Sidestep her Charm. She cannot reliably kill you without it. Her ult has three dashes so respect her mobility during teamfights.',
    phaseTips: {
      early:
        'She pokes with her Q orb. Stand to the side of your minions not directly behind them. Dodge her Charm.',
      mid:
        'Her roam is strong. Ward the side lanes. She will snowball off roams.',
      late:
        'Very mobile with three ult dashes. Hard to lock down. CC her before she uses her ult.',
    },
  },
  Vex: {
    threatLevel: 'Medium',
    watchOut:
      'Her passive fears when she uses her abilities on dashing champions. She specifically counters high-mobility carries. Her ult resets on kills.',
    winCondition:
      'Do not dash into her when her Doom mark is available. She fears you when you dash. Poke from range without using mobility.',
    phaseTips: {
      early:
        'She pushes wave hard and has safe poke. Respect her level 6 kill potential.',
      mid:
        'Her ult resets on kills making her dangerous in mid-game skirmishes. Stay grouped so she cannot pick people off.',
      late:
        'Very safe teamfight mage. Play around her fear passive. Do not dash unless you have to.',
    },
  },
  Orianna: {
    threatLevel: 'Medium',
    watchOut:
      'Her ult Command Shockwave pulls all enemies to her ball and knocks them up. Do not group near her ball. Track where the ball is at all times.',
    winCondition:
      'Stand away from her ball in teamfights. When you do not know where the ball is stand spread. Engage on her when her ball is far away.',
    phaseTips: {
      early:
        'Steady poke with her Q. She is safe with her W shield. Poke her down and respect her autoattack damage.',
      mid:
        'Her ult with a partner engage is devastating. Track her ball position.',
      late:
        'Enormous teamfight ultimate. Spread out constantly. Engage on her when her ball is on the wrong side.',
    },
  },
  Viktor: {
    threatLevel: 'Medium',
    watchOut:
      'His Death Ray laser does massive damage on the targeted line. His Gravity Field slows and stuns if you stand in it. Do not stand in the circle.',
    winCondition:
      'Poke him before he can fully upgrade his hex core. He is weaker before his first back. Dodge his laser and do not stand in his W circle.',
    phaseTips: {
      early:
        'He pushes wave fast after his first recall. Poke before he upgrades. Dodge his E laser.',
      mid:
        'Two-item Viktor melts health bars. Stay mobile and dodge his abilities.',
      late:
        'Massive teamfight AoE. Do not group tightly. His laser combined with a knockup can one-shot squishies.',
    },
  },
  Syndra: {
    threatLevel: 'High',
    watchOut:
      'Her ult Unleashed Power throws all her spheres at once for massive instant damage. At full spheres it one-shots squishy targets. Keep your health above 50%.',
    winCondition:
      'Play at the sides where her spheres are not positioned. Poke her down. She is immobile so all-in when her E is on cooldown.',
    phaseTips: {
      early:
        'She pushes waves hard. Poke her between ability uses. She is somewhat immobile so gapclose when her E stun is used.',
      mid:
        'Peak pressure with fully stacked ult. Keep your health high. Respect her all-in.',
      late:
        'If she has 40 or more spheres her ult kills most squishy targets instantly. Stay healthy and grouped.',
    },
  },
  Lux: {
    threatLevel: 'Medium',
    watchOut:
      'Her E bomb has a timer and she detonates it with her other spells for burst. Her R has the shortest cooldown of any sniper ultimate.',
    winCondition:
      'Dodge her Q binding. She cannot kill you without landing CC. Engage on her and she melts in melee range.',
    phaseTips: {
      early:
        'She pokes from extreme range. Dodge her Q. If she misses Q punish immediately.',
      mid:
        'Her ult has a very short cooldown. It can punish from across the map. Do not stand still after roaming.',
      late:
        'Very squishy but very long range. One-shot potential on squishy targets. Build magic resist.',
    },
  },
  'Twisted Fate': {
    threatLevel: 'Medium',
    watchOut:
      'His ult Destiny reveals all enemies on the map and lets him teleport globally. He will roam to every lane after level 6. Tell your team to play safe.',
    winCondition:
      'Push his tower when he roams. Shove the wave hard so he loses plates. His CC gold card is his only CC so dodge it.',
    phaseTips: {
      early:
        'Poke him and zone him from minions. He is weak early but strong at roaming. Abuse his laning weakness.',
      mid:
        'His global ult starts controlling the game. Ping when his ult is up and tell your team.',
      late:
        'Good teamfighter with CC. His stun gold card is his most important ability. Respect it in fights.',
    },
  },
  // ADC
  Jinx: {
    threatLevel: 'Medium',
    watchOut:
      'She is immobile with almost no escape tools. She has a snare trap E and a slow chompers. Her Rampage passive gives her a massive attack speed reset on kills.',
    winCondition:
      'Dive on her with a tank or engage support. She has no real mobility. One hard CC on her means she is dead. She is strong while ahead but weak to engage.',
    phaseTips: {
      early:
        'She is weak early. Aggressive supports and engage champions can bully her hard. She has no reliable escape.',
      mid:
        'Two items Jinx is very dangerous. Do not let her kite freely. Engage on her before she can rocket switch.',
      late:
        'One of the strongest late-game carries. A fed Jinx with her passive up feels unkillable. Hard engage is essential.',
    },
  },
  Caitlyn: {
    threatLevel: 'Medium',
    watchOut:
      'Her auto-attack range is the longest in the game. She sets up traps under enemies hit by CC. Her headshot passive deals bonus damage every few attacks.',
    winCondition:
      'Engage on her with a hook or dash. She is immobile. In close range she deals very little damage. Her traps set up her net escape so stay away from her traps.',
    phaseTips: {
      early:
        'She bully lanes with her range. Stay behind minions and dodge her Q. She pushes waves fast.',
      mid:
        'Her net R combined with a CC from support is a long-range execute. Respect the combo.',
      late:
        'Very strong at poking from a safe range. Has a net escape. Engage on her early in teamfights.',
    },
  },
  Jhin: {
    threatLevel: 'Medium',
    watchOut:
      'His fourth shot always crits and deals bonus damage. His ult Curtain Call has very long range and roots targets hit by his W beforehand.',
    winCondition:
      'Engage between his fourth shot and his reload. He is immobile but his W root combined with his ult can kill from extreme range.',
    phaseTips: {
      early:
        'He has strong lane poke with his Q bouncing on low-health targets. Disengage when he has his W available.',
      mid:
        'His four-shot burst combined with a root sets up long-range kills. Dodge his W flower.',
      late:
        'High damage from a safe distance. Engage on him when his W is on cooldown. He has no escape outside his movement speed from crits.',
    },
  },
  Ezreal: {
    threatLevel: 'Medium',
    watchOut:
      'His E Arcane Shift is a dash with a cooldown. He has extremely safe poke with his Q and ult. He is one of the safest marksmen to play.',
    winCondition:
      'Engage between his E cooldowns. After he uses his dash he is immobile for several seconds. All-in him with a hook or CC during that window.',
    phaseTips: {
      early:
        'He pokes safely with Q. His damage is low before two items. Engage when his E is down.',
      mid:
        'Very mobile and safe. Hard to catch. Wait for his E to be used then engage.',
      late:
        'His ult pokes from across the map. He builds Triforce for high burst. Strong but punishable when his dash is on cooldown.',
    },
  },
  "Kai'Sa": {
    threatLevel: 'High',
    watchOut:
      'Her ult Killer Instinct dashes to any ally-CC\'d enemy from long range. She evolves her Q and E for massive damage. Her plasma passive with five stacks deals huge burst.',
    winCondition:
      'Do not fight her when she is behind a wall of abilities. Her ult punishes isolated CC. Group so her ult does not pick off single targets.',
    phaseTips: {
      early:
        'She is very safe with her passive shield from W stacks. Poke before she can evolve. She spikes hard at two items.',
      mid:
        'Her evolved Q deals massive damage in short range. Respect her all-in with a peel support.',
      late:
        'One of the strongest late-game carries. Her ult dive is nearly uncatchable. Group tight and have CC ready when she ults.',
    },
  },
  Draven: {
    threatLevel: 'High',
    watchOut:
      'He deals the highest damage of any ADC in the early laning phase. His spinning axes deal double damage and he banks gold on kills. He snowballs enormously.',
    winCondition:
      'Force him to drop axes and lose gold. His axes land in predictable locations. Move to where the axe will land to cut off his catch.',
    phaseTips: {
      early:
        'He wins almost every early trade with axes. Play safe and deny his axes. Do not fight him with both axes active.',
      mid:
        'If he is ahead he is very hard to deal with. Respect his damage with tank items.',
      late:
        'High damage at all stages. He does not scale as well as other ADCs but his damage is always relevant. Engage hard and burst him.',
    },
  },
  Samira: {
    threatLevel: 'High',
    watchOut:
      'Her ult Inferno Trigger requires Style rank S which she builds by chaining different abilities and attacks. Her W windwall blocks projectiles like Yasuo.',
    winCondition:
      'Do not group when she reaches S rank. Her ult deals massive AoE damage. Disengage when her S rank gauge is full.',
    phaseTips: {
      early:
        'She is weaker without a strong engage support. Avoid letting her dash over your projectiles.',
      mid:
        'Her dash combined with CC sets up her full style combo. Do not stand in melee range without hard CC.',
      late:
        'In teamfights she becomes unkillable while spinning. CC her before she reaches S rank or disengage.',
    },
  },
  Ashe: {
    threatLevel: 'Medium',
    watchOut:
      'Her ult Enchanted Crystal Arrow is a global long-range stun that stuns longer the farther it travels. Her Hawkshot provides vision in fog of war.',
    winCondition:
      'Engage on her before her team can follow up on her ult. She is immobile. A hook or dash on her means she is dead.',
    phaseTips: {
      early:
        'She pokes with Frost Arrow and pushes waves. Her slowing auto attacks prevent you from escaping ganks. Use the jungle to gank her.',
      mid:
        'Her ult can initiate fights across the map. Ward the ult angle and avoid standing in her ult path.',
      late:
        'Strong in teamfights with her slow and AoE W. Engage on her early before she can kite freely.',
    },
  },
  Xayah: {
    threatLevel: 'Medium',
    watchOut:
      'Her feathers root enemies who walk over them with her E recall. Her ult makes her briefly untargetable. She is very strong with a Rakan partner.',
    winCondition:
      'Stay away from her feathers on the ground. When she E recalls all feathers and roots you. Engage when her ult is on cooldown.',
    phaseTips: {
      early:
        'She is weaker without Rakan. Aggressive early laning before her feather stacks deal massive damage.',
      mid:
        'Her double crit build spikes hard. Engage on her before she can place feathers for a root setup.',
      late:
        'Her root and ult untargetability make her very hard to burst. Time your CC after her ult finishes.',
    },
  },
  // SUPPORTS
  Thresh: {
    threatLevel: 'High',
    watchOut:
      'His Q Death Sentence hooks you and his W lantern saves allies. He has unlimited scaling armor meaning he never becomes weak. His box ult Flay creates a damaging wall.',
    winCondition:
      'Stand behind minions every single wave. His hook has a very obvious wind-up animation. When he misses his hook all-in immediately.',
    phaseTips: {
      early:
        'Never walk forward without minion cover. His hook range is deceptive. Stay positioned behind your ADC.',
      mid:
        'His roam and engage make him dangerous everywhere. Ward his common roam paths. He saves allies with his lantern.',
      late:
        'Enormous CC chain in teamfights. His flay and hook combo CC chains multiple targets. Stay spread and mobile.',
    },
  },
  Blitzcrank: {
    threatLevel: 'High',
    watchOut:
      'His Rocket Grab pulls you directly to him and his team. A landed hook from fog of war or a brush is almost always a death. He has a silence AoE on his ult.',
    winCondition:
      'Stay behind minions at all times. When he misses his grab the cooldown is very long. All-in him immediately after he misses.',
    phaseTips: {
      early:
        'Stand behind every single minion. His hook misses over minions. One early hook snowballs the lane.',
      mid:
        'Ward deep into river. He punishes unaware targets in the open. Do not face-check brushes.',
      late:
        'His hook on your carry in a teamfight is game-ending. Peel your ADC away from his grab range.',
    },
  },
  Nautilus: {
    threatLevel: 'High',
    watchOut:
      'His Q Dredge Line hooks to terrain or champions. His passive roots every enemy he attacks the first time. His ult knocks up a target and all enemies nearby.',
    winCondition:
      'Stand away from walls so he cannot hook terrain to gap close. After he uses his Q root all-in him. He is weak when his hook is on cooldown.',
    phaseTips: {
      early:
        'His slow and root make his jungle gank combination almost unkillable for your ADC. Ward early.',
      mid:
        'His ult sets up easy teamfight combos. He is very tanky. Focus his ADC not him.',
      late:
        'One of the best engage supports. His CC chain is enormous. Stay spread and mobile in teamfights.',
    },
  },
  Leona: {
    threatLevel: 'High',
    watchOut:
      'Her entire kit is engage and CC. E-Q-R gives her a ranged slow, a stun, and an AoE knockdown all in sequence. One good Leona combo kills most ADCs.',
    winCondition:
      'Poke her from range before she can engage. When she engages disengage before she activates all her CC. She is weak when her abilities are on cooldown.',
    phaseTips: {
      early:
        'She is the most aggressive lane support. Do not fight her without your own engage or CC.',
      mid:
        'Her roam is powerful because of her CC. Ward river and don\'t get caught alone.',
      late:
        'Her ult AoE damage combined with her chain CC wins teamfights. Hard engage is the answer to Leona engage.',
    },
  },
  Lulu: {
    threatLevel: 'Medium',
    watchOut:
      'Her W Whimsy polymorphs and silences you briefly. Her ult Wildgrowth knocks up enemies around her target and makes her ally massive with bonus health.',
    winCondition:
      'Target Lulu first before her carry. Her W polymorph cannot be activated on the same target consecutively. Build anti-heal.',
    phaseTips: {
      early:
        'She pokes safely with her Q and E. Her polymorph prevents you from using abilities for 1.5 seconds. Fight her when her W is on cooldown.',
      mid:
        'Her ability to save her carry with her ult and W is enormous. Do not target the same person she keeps saving.',
      late:
        'She makes one carry nearly unkillable. Target her to remove her peeling. Build grievous wounds.',
    },
  },
  Janna: {
    threatLevel: 'Low',
    watchOut:
      'Her ult Monsoon pushes everyone away from her in a large AoE while healing her team. She disrupts engage with knockbacks and slows.',
    winCondition:
      'Engage from multiple directions so her ult cannot push everyone away. Burst her and she melts instantly.',
    phaseTips: {
      early:
        'She pokes with her Q tornado. Her shield is reactive. Punish her when her Q is on cooldown.',
      mid:
        'Her disengage is her strongest tool. Catch her isolated and burst her.',
      late:
        'Her ult disrupts teamfight engages completely. Dive from two angles to split her ult value.',
    },
  },
  Soraka: {
    threatLevel: 'Low',
    watchOut:
      'Her ult Wish heals her entire team globally. Even if you burst one target she can heal them from full range. She keeps her team alive forever.',
    winCondition:
      'Build Grievous Wounds early (Executioner\'s Calling). Her healing is nullified with 40% grievous wounds. Burst her first as she is very squishy.',
    phaseTips: {
      early:
        'She heals her ADC from your damage. Build anti-heal early. Punish her when she uses Q star to heal.',
      mid:
        'Her global ult can save any teammate. Focus her first or build grievous wounds to cut her healing.',
      late:
        'With anti-heal her impact is reduced. Without it her team is nearly unkillable. Grievous wounds is mandatory.',
    },
  },
  Morgana: {
    threatLevel: 'Medium',
    watchOut:
      'Her Q Dark Binding is a 3-second root and one of the longest CC abilities in the game. Her E Black Shield blocks magic CC entirely. Her ult Tormented Shadow chains and stuns.',
    winCondition:
      'Dodge her Q root. Without it she deals very little damage. Her E gives magic immunity to one target so focus who she does not shield.',
    phaseTips: {
      early:
        'Stay in motion to avoid her Q. Her W pool does sustained magic damage. Do not stand in her pool.',
      mid:
        'Her shield denies your CC engage on her carry. Use physical CC instead of magic CC on her shielded target.',
      late:
        'Her ult chain stun is devastating in grouped teamfights. Stay spread and break her chain quickly.',
    },
  },
  Nami: {
    threatLevel: 'Medium',
    watchOut:
      'Her Q Aqua Prison is an AoE stun in a small circle. Her E empowers her ally\'s next three autos with slows. Her ult Tidal Wave knocks up across a large range.',
    winCondition:
      'Dodge her Q bubble. She needs to land Q to enable her full combo. Engage when her Q is on cooldown.',
    phaseTips: {
      early:
        'She provides sustain and poke. Dodge her Q to deny her healing. She is weak if her Q misses.',
      mid:
        'Her ult slow and knockup set up long range engages. Dodge the tidal wave or stand to the side.',
      late:
        'Great sustained healer and buffer. Build anti-heal. Engage quickly before she can cycle her heals.',
    },
  },
  Pyke: {
    threatLevel: 'High',
    watchOut:
      'His ult Death From Below executes targets below a health threshold and resets on kills. He heals back damage taken to his health bar. He is invisible in his W shroud.',
    winCondition:
      'He cannot increase his maximum health with HP items. Build health to stay above his execute threshold. Ward river to spot his roams.',
    phaseTips: {
      early:
        'He is a roaming assassin support. He will look for hooks in river and roam early. Play safe near the edge of his hook range.',
      mid:
        'Extremely dangerous roamer with execute ult. Keep your team healthy. Do not group below half health near him.',
      late:
        'His execute in teamfights resets for free kills. Keep your carries healthy. CC him before he can get into execute range.',
    },
  },
}

// ── CHAMPION → ARCHETYPE MAP ───────────────────────────────────────────────
// All 172 champions from Data Dragon 16.7.1

export const CHAMPION_ARCHETYPE_MAP: Record<string, Archetype> = {
  Aatrox: 'Skirmisher',
  Ahri: 'Assassin',
  Akali: 'Assassin',
  Akshan: 'Marksman',
  Alistar: 'EngageSupport',
  Ambessa: 'Skirmisher',
  Amumu: 'EngageSupport',
  Anivia: 'Mage',
  Annie: 'Enchanter',
  Aphelios: 'Marksman',
  Ashe: 'Marksman',
  Aurora: 'Assassin',
  'Aurelion Sol': 'Mage',
  Azir: 'Marksman',
  Bard: 'Enchanter',
  "Bel'Veth": 'Skirmisher',
  Blitzcrank: 'EngageSupport',
  Brand: 'Enchanter',
  Braum: 'EngageSupport',
  Briar: 'Skirmisher',
  Caitlyn: 'Marksman',
  Camille: 'Skirmisher',
  Cassiopeia: 'Mage',
  "Cho'Gath": 'BattleMage',
  Corki: 'Marksman',
  Darius: 'Bruiser',
  Diana: 'Skirmisher',
  'Dr. Mundo': 'Bruiser',
  Draven: 'Marksman',
  Ekko: 'Skirmisher',
  Elise: 'Assassin',
  Evelynn: 'Assassin',
  Ezreal: 'Marksman',
  Fiddlesticks: 'Enchanter',
  Fiora: 'Skirmisher',
  Fizz: 'Assassin',
  Galio: 'BattleMage',
  Gangplank: 'Skirmisher',
  Garen: 'Bruiser',
  Gnar: 'Bruiser',
  Gragas: 'BattleMage',
  Graves: 'Marksman',
  Gwen: 'Skirmisher',
  Hecarim: 'Bruiser',
  Heimerdinger: 'Enchanter',
  Hwei: 'Enchanter',
  Illaoi: 'Bruiser',
  Irelia: 'Skirmisher',
  Ivern: 'Enchanter',
  Janna: 'Enchanter',
  'Jarvan IV': 'Bruiser',
  Jax: 'Bruiser',
  Jayce: 'Skirmisher',
  Jhin: 'Marksman',
  Jinx: 'Marksman',
  "Kai'Sa": 'Marksman',
  Kalista: 'Marksman',
  Karma: 'Enchanter',
  Karthus: 'Mage',
  Kassadin: 'Skirmisher',
  Katarina: 'Assassin',
  Kayle: 'Skirmisher',
  Kayn: 'Skirmisher',
  Kennen: 'Mage',
  "Kha'Zix": 'Skirmisher',
  Kindred: 'Marksman',
  Kled: 'Bruiser',
  "Kog'Maw": 'Marksman',
  LeBlanc: 'Assassin',
  'Lee Sin': 'Skirmisher',
  Leona: 'EngageSupport',
  Lillia: 'BattleMage',
  Lissandra: 'Mage',
  Lucian: 'Marksman',
  Lulu: 'Enchanter',
  Lux: 'Enchanter',
  Malphite: 'BattleMage',
  Malzahar: 'Mage',
  Maokai: 'EngageSupport',
  'Master Yi': 'Skirmisher',
  Milio: 'Enchanter',
  'Miss Fortune': 'Marksman',
  Mordekaiser: 'Bruiser',
  Morgana: 'Enchanter',
  Naafiri: 'Assassin',
  Nami: 'Enchanter',
  Nasus: 'Bruiser',
  Nautilus: 'EngageSupport',
  Neeko: 'Enchanter',
  Nidalee: 'Assassin',
  Nilah: 'Skirmisher',
  Nocturne: 'Skirmisher',
  'Nunu & Willump': 'EngageSupport',
  Olaf: 'Bruiser',
  Orianna: 'Mage',
  Ornn: 'Tank',
  Pantheon: 'Skirmisher',
  Poppy: 'Bruiser',
  Pyke: 'EngageSupport',
  Qiyana: 'Assassin',
  Quinn: 'Marksman',
  Rakan: 'EngageSupport',
  Rammus: 'Tank',
  Rell: 'EngageSupport',
  'Renata Glasc': 'Enchanter',
  Renekton: 'Bruiser',
  Rengar: 'Skirmisher',
  Riven: 'Skirmisher',
  Rumble: 'BattleMage',
  Ryze: 'Mage',
  Samira: 'Marksman',
  Sejuani: 'Tank',
  Senna: 'Marksman',
  Seraphine: 'Enchanter',
  Sett: 'Bruiser',
  Shaco: 'Assassin',
  Shen: 'Tank',
  Shyvana: 'Bruiser',
  Singed: 'Bruiser',
  Sion: 'Bruiser',
  Sivir: 'Marksman',
  Smolder: 'Marksman',
  Sona: 'Enchanter',
  Soraka: 'Enchanter',
  Swain: 'BattleMage',
  Sylas: 'Skirmisher',
  Syndra: 'Mage',
  'Tahm Kench': 'Bruiser',
  Taliyah: 'Mage',
  Talon: 'Assassin',
  Taric: 'EngageSupport',
  Teemo: 'Marksman',
  Thresh: 'EngageSupport',
  Tristana: 'Marksman',
  Trundle: 'Bruiser',
  Tryndamere: 'Skirmisher',
  'Twisted Fate': 'Mage',
  Twitch: 'Marksman',
  Udyr: 'Bruiser',
  Urgot: 'Bruiser',
  Varus: 'Marksman',
  Vayne: 'Marksman',
  Veigar: 'Mage',
  "Vel'Koz": 'Enchanter',
  Vex: 'Mage',
  Vi: 'Bruiser',
  Viego: 'Skirmisher',
  Viktor: 'Mage',
  Vladimir: 'BattleMage',
  Volibear: 'Bruiser',
  Warwick: 'Bruiser',
  Wukong: 'Bruiser',
  Xayah: 'Marksman',
  Xerath: 'Mage',
  'Xin Zhao': 'Skirmisher',
  Yasuo: 'Skirmisher',
  Yone: 'Skirmisher',
  Yorick: 'Bruiser',
  Yuumi: 'Enchanter',
  Zac: 'EngageSupport',
  Zed: 'Assassin',
  Zeri: 'Marksman',
  Ziggs: 'Enchanter',
  Zilean: 'Enchanter',
  Zoe: 'Mage',
  Zyra: 'Enchanter',
  "K'Sante": 'Tank',
  "Rek'Sai": 'Skirmisher',
  Skarner: 'Tank',
  Mel: 'Mage',
  Yunara: 'Enchanter',
  Zaahen: 'EngageSupport',
}

// ── LOOKUP FUNCTION ────────────────────────────────────────────────────────
// Returns full matchup data for any champion name. Merges archetype template
// with champion-specific override if one exists.

export function getMatchupData(enemyChampion: string): ChampionMatchup {
  const archetype = CHAMPION_ARCHETYPE_MAP[enemyChampion] ?? 'Bruiser'
  const template = ARCHETYPE_TEMPLATES[archetype]
  const override = CHAMPION_OVERRIDES[enemyChampion] ?? {}

  return {
    championName: enemyChampion,
    archetype,
    threatLevel: override.threatLevel ?? template.threatLevel,
    tradingTip: override.tradingTip ?? template.tradingTip,
    watchOut: override.watchOut ?? template.watchOut,
    winCondition: override.winCondition ?? template.winCondition,
    phaseTips: {
      early: override.phaseTips?.early ?? template.phaseTips.early,
      mid: override.phaseTips?.mid ?? template.phaseTips.mid,
      late: override.phaseTips?.late ?? template.phaseTips.late,
    },
  }
}
