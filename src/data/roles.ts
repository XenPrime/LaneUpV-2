import type { RoleContent, RoleId } from '../types'

export const roleOrder: RoleId[] = [
  'utility',
  'top',
  'jungle',
  'middle',
  'bottom',
]

export const roles: Record<RoleId, RoleContent> = {
  utility: {
    id: 'utility',
    name: 'Support',
    title: 'The teammate who protects carries and controls vision.',
    difficulty: 'Easy',
    summary:
      "Protect your carry, control vision across the map, and use crowd control to set up fights for your team. You don't need to farm minions — your job is to make your teammates better.",
    simpleSummary:
      "Support is the easiest role to start with because you don't have to farm. Protect your ADC, ward often, and help your team move safely through the map.",
    responsibilityCards: [
      {
        title: 'Keep your ADC alive',
        description:
          'In the early game your primary job is making sure your bot laner can farm safely. Use your abilities to shield, heal, or remove enemies from them. Do not just watch - react.',
      },
      {
        title: 'Vision is your superpower',
        description:
          'Buy a Control Ward every time you back to base with no exceptions. Ward the river bushes before 1:30 so your team can see enemy movement before the first fights start.',
      },
      {
        title: 'Roam in the mid game',
        description:
          'Once laning phase slows down around 14 minutes, stop sitting in bot lane. Move with your team toward Dragon and Baron objectives. Your heals and crowd control help everyone.',
      },
    ],
    simpleResponsibilityCards: [
      {
        title: 'Keep your ADC alive',
        description:
          'Use your abilities to protect your bot laner - shield them, heal them, or knock enemies away.',
      },
      {
        title: 'Buy a Control Ward every back',
        description:
          'Every single time you go to base, buy one. Ward the river bushes before 1:30.',
      },
      {
        title: 'Roam with your team after 14 min',
        description:
          'Stop sitting bot and move toward Dragon with your heals and crowd control.',
      },
    ],
    responsibilities: [
      'Keep your ADC alive. In the early game your primary job is making sure your bot laner can farm safely. Use your abilities to shield, heal, or remove enemies from them. Do not just watch — react.',
      'Vision is your superpower. Buy a Control Ward every time you back to base with no exceptions. Ward the river bushes before 1:30 so your team can see enemy movement before the first fights start.',
      'Roam in the mid game. Once laning phase slows down around 14 minutes, stop sitting in bot lane. Move with your team toward Dragon and Baron objectives. Your heals and crowd control help everyone.',
    ],
    simpleResponsibilities: [
      'Keep your ADC alive. Use your abilities to protect your bot laner — shield them, heal them, or knock enemies away.',
      'Buy a Control Ward every back. Every single time you go to base, buy one. Ward the river bushes before 1:30.',
      'Roam with your team after 14 min. Stop sitting bot and move toward Dragon with your heals and crowd control.',
    ],
    phases: {
      early:
        "Stay close to your ADC. Poke when you're ahead, ward both river bushes, and do not chase kills into danger.",
      mid: 'Roam toward Dragon. Place deep wards in the enemy jungle. Group up for fights and peel for your carries.',
      late:
        'Never leave your carries alone. Baron and Elder Dragon usually decide the game. Stay grouped and protect your team.',
    },
    simplePhases: {
      early: 'Stay near your ADC. Ward river bushes. Do not chase kills and overextend.',
      mid: 'Roam to Dragon. Group with your team and protect your carries in fights.',
      late: 'Never leave your carries alone. Stay grouped for Baron and Elder Dragon.',
    },
    goodFights: [
      'Your ADC is healthy and in position to follow up.',
      'Your crowd control or key protection spell is ready.',
      'The enemy jungler is visible somewhere else on the map.',
      'Your team already has vision around the objective or fight area.',
    ],
    avoidFights: [
      'Your ADC is low health or far out of position.',
      'Your key ability is on cooldown.',
      'The enemy jungler is missing and could be nearby.',
      'You have no vision where the fight is about to happen.',
    ],
    synergyTitle: 'ADC synergy',
    synergyPoints: [
      "Hyper-carry ADCs like Jinx, KogMaw, or Vayne need you to play safe early and protect them until they scale.",
      "Lane bully ADCs like Draven, Caitlyn, or Miss Fortune want you to be proactive so they can snowball before enemies scale.",
      'Engage-oriented ADCs like Lucian, Kalista, or Corki need quick follow-up when they commit forward.',
    ],
    nextGameChecklist: [
      {
        title: 'First base buy',
        detail: 'Leave lane with a Control Ward every single time if possible.',
      },
      {
        title: 'Lane priority',
        detail: 'Stand where you can protect your ADC before you try to poke.',
      },
      {
        title: 'Post-lane movement',
        detail: 'Shadow your strongest carry once towers begin to fall.',
      },
    ],
    matchupReminders: [
      {
        situation: 'Facing hard engage',
        response: 'Hold your peel spell and keep the wave closer to your tower.',
      },
      {
        situation: 'Playing with a scaling ADC',
        response: 'Trade less often and spend more time making vision safe.',
      },
      {
        situation: 'Your team is ahead',
        response: 'Use wards to lock out entrances before starting the objective.',
      },
    ],
    practiceHabits: [
      'Track enemy engage cooldowns before stepping forward.',
      'Use pings before every roam instead of silently leaving lane.',
      'Review if your vision was placed before fights, not after they started.',
    ],
    championRecommendations: {
      easy: [
        {
          champion: 'Lulu',
          reason:
            'Strong utility on every button and very forgiving if you make small positioning mistakes.',
        },
        {
          champion: 'Soraka',
          reason:
            'Heal-focused, safe, and great for learning positioning and map awareness with a global ultimate.',
        },
        {
          champion: 'Janna',
          reason:
            'Simple disengage tools and excellent protection for your ADC make her very beginner-friendly.',
        },
        {
          champion: 'Sona',
          reason:
            'Multiple team buffs in one kit and easy-to-understand contribution in every fight.',
        },
        {
          champion: 'Seraphine',
          reason:
            'AoE shields, healing, and clear teamfight value with a forgiving play pattern.',
        },
      ],
      hard: [
        {
          champion: 'Thresh',
          reason:
            'Hook accuracy and lantern timing take a long time to develop under pressure.',
        },
        {
          champion: 'Bard',
          reason:
            'Roaming decisions and ultimate timing can easily help the enemy team by mistake.',
        },
        {
          champion: 'Pyke',
          reason:
            'Execution timing and roam judgment are punishing when misplayed.',
        },
        {
          champion: 'Zyra',
          reason:
            'Plant placement and combo spacing require stronger spatial awareness than most beginners have yet.',
        },
        {
          champion: 'Blitzcrank',
          reason:
            'Hook accuracy through minion waves is demanding and very punishing when missed.',
        },
      ],
    },
    simpleChampionRecommendations: [
      {
        champion: 'Lulu',
        reason: 'Forgiving and great at protecting teammates.',
      },
      {
        champion: 'Soraka',
        reason: 'Safe, heal-focused, and easy to understand.',
      },
      {
        champion: 'Janna',
        reason: 'Simple disengage and strong ADC protection.',
      },
    ],
    footerNote:
      'Support guide complete. This role remains the best first recommendation for brand-new players.',
  },
  top: {
    id: 'top',
    name: 'Top',
    title: 'The isolated solo lane that becomes a front line or split-push threat.',
    difficulty: 'Low-Medium',
    summary:
      "The isolated 1v1 lane. Top laners duel for lane dominance, use Teleport to impact the rest of the map, and transition into either a split-push threat or a teamfight frontliner depending on their champion.",
    simpleSummary:
      'Top lane is the isolated 1v1 lane. Farm safely, use Teleport for important moments, and become either a frontliner or side-lane threat later.',
    responsibilityCards: [
      {
        title: 'Win your 1v1 and control the wave',
        description:
          "Top lane is a long, isolated duel. Your first goal is to farm safely and trade when you have the advantage - when your ability is up, when you have more minions, or when the enemy is low. If you are ahead, slow push the wave to build a big crash. If you are behind, freeze it near your tower to force the enemy to overextend for CS.",
      },
      {
        title: 'Use Teleport to impact the whole map',
        description:
          'Most top laners run Teleport instead of Ignite. This lets you join Dragon fights, save your tower from being pushed, and get back to lane after buying items. Save it for meaningful moments - Dragon spawning, a team fight starting bot, or your tower being pushed. Do not burn it just to get back to lane a few seconds faster.',
      },
      {
        title: 'Decide: split push or group',
        description:
          'After laning phase, every top laner faces the same question. If your champion is a 1v1 duelist, split push a side lane to create pressure. If your champion is a teamfight frontliner, group with your team, walk in front of your carries, and absorb damage.',
      },
    ],
    simpleResponsibilityCards: [
      {
        title: 'Farm safely, trade when ahead',
        description:
          'Last hit minions and only fight when your ability is up and you have more health.',
      },
      {
        title: 'Save Teleport for big moments',
        description:
          'Use TP to join Dragon fights or save your tower. Do not waste it just to get back to lane.',
      },
      {
        title: 'Duelists split push, tanks group up',
        description:
          'If your champion fights 1v1 well, push a side lane. If they are tanky, walk with your team.',
      },
    ],
    responsibilities: [
      "Win your 1v1 and control the wave. Top lane is a long, isolated duel. Your first goal is to farm safely and trade when you have the advantage — when your ability is up, when you have more minions, or when the enemy is low. If you're ahead, slow push the wave to build a big crash. If you're behind, freeze it near your tower to force the enemy to overextend for CS.",
      "Use Teleport to impact the whole map. Most top laners run Teleport instead of Ignite. This lets you join Dragon fights, save your tower from being pushed, and get back to lane after buying items. Save it for meaningful moments — Dragon spawning, a team fight starting bot, or your tower being pushed. Do not burn it just to get back to lane a few seconds faster.",
      'Decide: split push or group. After laning phase, every top laner faces the same question. If your champion is a 1v1 duelist, split push a side lane to create pressure. If your champion is a teamfight frontliner, group with your team, walk in front of your carries, and absorb damage.',
    ],
    simpleResponsibilities: [
      'Farm safely, trade when ahead. Last hit minions and only fight when your ability is up and you have more health.',
      'Save Teleport for big moments. Use TP to join Dragon fights or save your tower. Do not waste it just to get back to lane.',
      'Duelists split push, tanks group up. If your champion fights 1v1 well, push a side lane. If they are tanky, walk with your team.',
    ],
    phases: {
      early:
        "Ward the river bush closest to you before 1:30 to spot the enemy jungler coming. Focus on last hitting and take short trades — one ability, then back off. Do not push too far forward without vision. Top lane ganks are brutal because the lane is so long and there is nowhere to run.",
      mid: 'Start making Teleport decisions. If Dragon is spawning and your team needs your presence, TP in and fight. If your team can handle it, push a side lane to apply pressure. When your own tower falls, rotate toward mid. Never stay in a lane with no tower.',
      late:
        "If your champion fights well in groups, walk with your team to Baron and teamfights — stand in front of your carries and soak damage. If you're a split-push duelist, pressure a side lane to force the enemy to make a choice: stop you and lose Baron, or ignore you and lose a tower or inhibitor.",
    },
    simplePhases: {
      early: 'Ward the river, farm minions, take short trades only. Do not push too far up without vision.',
      mid: 'Use Teleport to help your team at Dragon. If they are fine, push a side lane instead.',
      late: 'Either walk with your team and absorb damage, or keep pushing side lanes to force the enemy to react.',
    },
    goodFights: [
      'Your Teleport is up and your team is fighting near an objective.',
      "You're ahead in health and your main trade tool just came back up.",
      "You're split pushing and only one enemy is rotating to stop you.",
      'Baron or Dragon is spawning and your team already has vision control.',
    ],
    avoidFights: [
      "Your Teleport is down and you're far away from the next big fight.",
      "Multiple enemies are collapsing while you're isolated in a side lane.",
      "You're low health, overextended, and have no ward covering your retreat.",
      "The enemy has their full combo available and you can't match the damage.",
    ],
    synergyTitle: 'Jungle synergy',
    synergyPoints: [
      "If your jungler is coming top, push first so the enemy has less room to run, then use your CC the moment they arrive.",
      "Ping before teleporting into a fight so your team knows help is coming and doesn't disengage too early.",
      'If you die to a gank, freeze the wave near your tower on the next reset to force the enemy top laner to overextend.',
    ],
    nextGameChecklist: [
      {
        title: 'Wave plan',
        detail: 'Name whether the next wave should freeze, slow push, or crash.',
      },
      {
        title: 'Teleport discipline',
        detail: 'Save TP for a real cross-map gain or tower save.',
      },
      {
        title: 'Side-lane plan',
        detail: 'Decide early if you are grouping or split pushing after lane.',
      },
    ],
    matchupReminders: [
      {
        situation: 'Against lane bullies',
        response: 'Keep the wave closer to your tower and trade only on cooldown edges.',
      },
      {
        situation: 'Against tanks',
        response: 'Crash waves cleanly and look for plate pressure before they outscale utility.',
      },
      {
        situation: 'When behind',
        response: 'Play to wave state and Teleport value, not hero trades.',
      },
    ],
    practiceHabits: [
      'Check the minimap before every extended trade.',
      'Track which deaths came from overextending with no river ward.',
      'Review one Teleport each game and decide if it created value.',
    ],
    championRecommendations: {
      easy: [
        {
          champion: 'Garen',
          reason:
            'No mana, forgiving trades, and a very simple Q into E into R play pattern.',
        },
        {
          champion: 'Malphite',
          reason:
            'Tanky, easy to itemize, and his ultimate creates obvious teamfight value.',
        },
        {
          champion: 'Nasus',
          reason:
            'Very clear goal each game: stack Q and scale into a durable side-lane threat.',
        },
        {
          champion: 'Maokai',
          reason:
            'Extremely tanky with reliable crowd control and forgiving item choices.',
        },
        {
          champion: "Cho'Gath",
          reason:
            'Durable, simple to understand, and naturally scales with ultimate stacks.',
        },
      ],
      hard: [
        {
          champion: 'Riven',
          reason:
            'Animation cancels and combo precision create a very high skill floor.',
        },
        {
          champion: 'Fiora',
          reason:
            'Riposte timing and vital positioning are punishing if your fundamentals are not solid.',
        },
        {
          champion: 'Gangplank',
          reason:
            'Barrel timing and global-ultimate decision making are hard for new players.',
        },
        {
          champion: 'Camille',
          reason:
            'Wall-hops and engage timing are unforgiving when you misjudge them.',
        },
        {
          champion: 'Irelia',
          reason:
            'Stack management and dash sequencing make her deceptively complex.',
        },
      ],
    },
    simpleChampionRecommendations: [
      {
        champion: 'Garen',
        reason: 'Simple and forgiving for learning top lane basics.',
      },
      {
        champion: 'Malphite',
        reason: 'Tanky and easy to understand in teamfights.',
      },
      {
        champion: 'Nasus',
        reason: 'Clear scaling goal and straightforward plan.',
      },
    ],
    footerNote:
      'Top guide complete. Focus on 1v1 basics first, then layer in Teleport timing and split-push decisions.',
  },
  jungle: {
    id: 'jungle',
    name: 'Jungle',
    title: 'The map-wide role that farms camps, ganks lanes, and secures objectives.',
    difficulty: 'Very Hard',
    summary:
      "The jungler roams the entire map, farming jungle camps for gold and XP while looking for opportunities to gank lanes and secure major objectives like Dragon and Baron. You have no lane — your whole game is about being in the right place at the right time.",
    simpleSummary:
      'Jungle is about clear pathing, good ganks, and securing objectives with Smite.',
    responsibilityCards: [
      {
        title: 'Clear your camps and build a path',
        description:
          'Jungle camps are your primary income. A solid beginner path is Red Buff, Krugs, Raptors, Wolves, Blue Buff, then Gromp. Do not skip camps between ganks - every camp you miss is gold you are falling behind on.',
      },
      {
        title: 'Gank only when conditions are good',
        description:
          'Before committing, ask yourself three things: is the enemy pushed toward your tower, does your laner have crowd control to help, and do you know where the enemy jungler is? If not, keep farming.',
      },
      {
        title: 'Secure major objectives with Smite',
        description:
          'Dragon, Rift Herald, and Baron are the most important objectives in the game. Save Smite for the killing blow and set up vision around 30 seconds before you start taking them.',
      },
    ],
    simpleResponsibilityCards: [
      {
        title: 'Clear camps to level up and earn gold',
        description:
          'Start at Red Buff, then Krugs, Raptors, Wolves, Blue, and Gromp. Do not skip camps.',
      },
      {
        title: 'Only gank when the setup is there',
        description:
          'Enemy must be pushed forward and your laner needs a stun or slow. If not, keep farming.',
      },
      {
        title: 'Use Smite to secure objectives',
        description:
          'Save Smite for the killing blow on Dragon, Herald, and Baron so the enemy cannot steal.',
      },
    ],
    responsibilities: [
      "Clear your camps and build a path. Jungle camps are your primary income. A solid beginner path is Red Buff, Krugs, Raptors, Wolves, Blue Buff, then Gromp. Do not skip camps between ganks — every camp you miss is gold you're falling behind on.",
      'Gank only when conditions are good. Ask yourself: is the enemy pushed toward your tower, does your laner have CC to help, and do you know where the enemy jungler is? If not, keep farming.',
      'Secure major objectives with Smite. Dragon, Rift Herald, and Baron are your biggest responsibilities. Save Smite for the killing blow and set up vision before starting them.',
    ],
    simpleResponsibilities: [
      'Clear camps to level up and earn gold. Start at Red Buff, then Krugs, Raptors, Wolves, Blue, and Gromp.',
      'Only gank when the setup is there. Enemy must be pushed forward and your laner needs CC.',
      'Use Smite to secure objectives. Save it for Dragon, Herald, and Baron so the enemy cannot steal.',
    ],
    phases: {
      early:
        'Clear your first full path and hit level 3 around 3:15. Then look for your first gank. At 4:30, start moving toward Dragon pit and prepare for the first Dragon at 5:00.',
      mid: 'Stack Dragon buffs, keep clearing camps between ganks, and spend 30 seconds placing Control Wards and sweeping before every Dragon fight.',
      late:
        'Baron Nashor becomes the main objective. Before starting Baron, shove mid first, sweep the pit for wards, control both entrances, and save Smite for the killing blow.',
    },
    simplePhases: {
      early: 'Full clear your camps by 3:15, look for a gank, then contest Dragon at 5:00.',
      mid: 'Keep stacking Dragon buffs. Set up vision 30 seconds before every Dragon fight.',
      late: 'Push mid wave, then start Baron. Save Smite for the kill.',
    },
    goodFights: [
      'The enemy is pushed forward and your laner has CC ready.',
      'You know the enemy jungler is on the other side of the map.',
      'You are near an objective and still have Smite for the secure.',
      'Your laners are healthy enough to commit if you start the play.',
    ],
    avoidFights: [
      'The enemy has vision on your path and already sees the gank coming.',
      'Smite is on cooldown near an important objective.',
      'Your laners are too low to follow up even if you engage.',
      "You don't know where the enemy jungler is and could be walking into a collapse.",
    ],
    synergyTitle: 'Lane synergy',
    synergyPoints: [
      'Bot lanes with hard CC are easier to gank and easier to convert into dragons.',
      'Ping dragon setup 30 seconds early so lanes know to push and move first.',
      'If you see the enemy jungler show on one side, punish by stealing camps or starting the opposite-side objective.',
    ],
    nextGameChecklist: [
      {
        title: 'Path before minions spawn',
        detail: 'Know your first clear before the game begins.',
      },
      {
        title: 'Gank filter',
        detail: 'Only commit if wave state and lane follow-up both make sense.',
      },
      {
        title: 'Objective setup',
        detail: 'Sweep and ward before dragon instead of arriving late to contest.',
      },
    ],
    matchupReminders: [
      {
        situation: 'Enemy early ganker',
        response: 'Cross-map farm safely and trade objectives instead of matching bad fights.',
      },
      {
        situation: 'Losing lanes',
        response: 'Stabilize vision and farm; do not donate tempo to impossible saves.',
      },
      {
        situation: 'Winning lanes',
        response: 'Turn lead into neutral objectives instead of random tower dives.',
      },
    ],
    practiceHabits: [
      'Ping which side you are pathing toward before first clear ends.',
      'Review every missed camp respawn.',
      'Count how many objectives you approached without Smite available.',
    ],
    championRecommendations: {
      easy: [
        {
          champion: 'Warwick',
          reason:
            'Very forgiving, hard to kill, and straightforward to gank with.',
        },
        {
          champion: 'Amumu',
          reason:
            'Easy clears, reliable crowd control, and a fight-winning ultimate.',
        },
        {
          champion: 'Vi',
          reason:
            'Simple engage pattern and a point-and-click ultimate that is easy to understand.',
        },
        {
          champion: 'Rammus',
          reason:
            'Durable, simple itemization, and very clear anti-carry purpose.',
        },
        {
          champion: 'Nunu',
          reason:
            'Strong objective control and forgiving sustain while learning pathing.',
        },
      ],
      hard: [
        {
          champion: 'Lee Sin',
          reason:
            'High-mechanical ceiling with ward-jumps and kick combos.',
        },
        {
          champion: "Kha'Zix",
          reason:
            'Isolation logic and evolution choices add complexity before core jungle skills are stable.',
        },
        {
          champion: 'Nidalee',
          reason:
            'Form switching and spear accuracy are very demanding.',
        },
        {
          champion: 'Kindred',
          reason:
            'Mark tracking while maintaining clean pathing is difficult for beginners.',
        },
        {
          champion: 'Rengar',
          reason:
            'Ferocity management and burst calculations punish hesitation.',
        },
      ],
    },
    simpleChampionRecommendations: [
      {
        champion: 'Warwick',
        reason: 'Very forgiving and easy to gank with.',
      },
      {
        champion: 'Amumu',
        reason: 'Simple clear and obvious teamfight value.',
      },
      {
        champion: 'Vi',
        reason: 'Easy engage and easy-to-understand ultimate.',
      },
    ],
    footerNote:
      'Jungle guide complete. Clean pathing and objective setup matter more than trying to be everywhere at once.',
  },
  middle: {
    id: 'middle',
    name: 'Mid',
    title: 'The center lane that controls tempo, roams, and objective setup.',
    difficulty: 'Medium',
    summary:
      "The center of the map. Mid laners farm their lane, then rotate to influence Dragon, top, and bot at key moments. You're the pivot point of the team — the player who can swing any fight on the map if you're in the right place at the right time.",
    simpleSummary:
      'Mid lane is about wave control, smart roams, and moving first to important fights.',
    responsibilityCards: [
      {
        title: 'Shove your wave before you do anything else',
        description:
          'The key mid lane skill is pushing minions into the enemy tower before you leave. If you roam without shoving, the enemy mid just follows you and you lose both tempo and farm.',
      },
      {
        title: 'Roam to where the map needs you',
        description:
          'After shoving, check the map for Dragon setup, bot dives, or top plays. Mid can influence everything, but only if you move at the right time.',
      },
      {
        title: 'Ward both river bushes before 2:30',
        description:
          'Mid is one of the easiest lanes in the game to gank, and those early wards protect you while also telling your team where the enemy jungler is going.',
      },
    ],
    simpleResponsibilityCards: [
      {
        title: 'Shove your wave before leaving lane',
        description:
          'Push minions into the enemy tower first so they have to stay and clear it.',
      },
      {
        title: 'Roam when your wave is shoved',
        description:
          'Check the minimap and move only when there is a real play to join.',
      },
      {
        title: 'Ward river bushes before 2:30',
        description: 'Both sides of the river. This stops most early ganks.',
      },
    ],
    responsibilities: [
      "Shove your wave before you do anything else. The key mid lane skill is pushing minions into the enemy tower before you leave. If you roam without shoving, the enemy mid just follows you and you lose both tempo and farm.",
      'Roam to where the map needs you. After shoving, check the map for Dragon setup, bot dives, or top plays. Mid can influence everything, but only if you move at the right time.',
      'Ward both river bushes before 2:30. Mid is one of the easiest lanes in the game to gank, and those early wards protect you while also telling your team where the enemy jungler is going.',
    ],
    simpleResponsibilities: [
      'Shove your wave before leaving lane. Push minions into the enemy tower first so they have to stay and clear it.',
      'Roam when your wave is shoved. Check the minimap and move only when there is a real play to join.',
      'Ward river bushes before 2:30. Both sides of the river. This stops most early ganks.',
    ],
    phases: {
      early:
        "Ward both river bushes before 2:30 and farm safely. Take short trades, then back off. If you're winning, shove the wave and take tower plates for extra gold.",
      mid: 'Shove the mid wave before every Dragon or Rift Herald fight, then rotate immediately. Place deep wards near river entrances and get back to mid quickly after each play.',
      late:
        'Always shove mid before your team starts Baron. In fights, use your abilities on whoever is threatening your ADC or carries. Wave first, then objective.',
    },
    simplePhases: {
      early: 'Ward at 2:30, farm safely, and shove when ahead to take tower gold.',
      mid: 'Shove wave before every Dragon fight, then rotate. Get back to mid fast after.',
      late: 'Always shove mid before Baron starts. Wave first, objective second.',
    },
    goodFights: [
      'Your wave is shoved into the enemy tower and they must answer it.',
      "You're even or ahead in lane and can move first.",
      'The enemy jungler is visible elsewhere on the map.',
      'Your team already has vision where the fight is happening.',
    ],
    avoidFights: [
      "You're behind in CS and leaving lane would make the gap worse.",
      'Your wave is crashing into your own tower.',
      "You don't know where the enemy jungler is and could get caught mid-roam.",
      'Your key spell or ultimate is still on cooldown.',
    ],
    synergyTitle: 'Map synergy',
    synergyPoints: [
      'Roams work best when your side lane already knows you are coming, so ping before you move.',
      'Mid sets the tempo for dragon. If you move first, your whole team gets safer access to river.',
      'Aggressive junglers want you to match their pace early, while scaling junglers usually want you to stabilize lane and buy time.',
    ],
    nextGameChecklist: [
      {
        title: 'Wave control',
        detail: 'Crash the wave before every roam or river contest.',
      },
      {
        title: 'Vision timing',
        detail: 'Get both early river wards down before the first dangerous jungle window.',
      },
      {
        title: 'Tempo reset',
        detail: 'Base after shove timings so you return before losing mid control.',
      },
    ],
    matchupReminders: [
      {
        situation: 'Versus assassins',
        response: 'Keep the wave manageable and hold key cooldowns for their entry.',
      },
      {
        situation: 'Versus control mages',
        response: 'Use shove timings to move first rather than forcing solo kills.',
      },
      {
        situation: 'When your jungle wants river',
        response: 'Prioritize wave and move with them as a pair.',
      },
    ],
    practiceHabits: [
      'Review every roam that cost more than one wave.',
      'Choose a warded side and play toward it.',
      'Ping your lane opponent missing before leaving your own lane.',
    ],
    championRecommendations: {
      easy: [
        {
          champion: 'Annie',
          reason:
            'Simple stun management, obvious burst windows, and very easy to understand.',
        },
        {
          champion: 'Lux',
          reason:
            'Safe range, clear combo pattern, and great for learning spell accuracy.',
        },
        {
          champion: 'Veigar',
          reason:
            'Simple scaling plan through Q farming and easy-to-see power growth.',
        },
        {
          champion: 'Malzahar',
          reason:
            'Easy waveclear and a straightforward ultimate that always has value.',
        },
        {
          champion: 'Vex',
          reason:
            'Punishes dashes naturally and has clear, reliable burst windows.',
        },
      ],
      hard: [
        {
          champion: 'Zed',
          reason:
            'Shadow management and combo timing need lots of repetition.',
        },
        {
          champion: 'Azir',
          reason:
            'Soldier positioning gives him one of the highest learning curves in the role.',
        },
        {
          champion: 'Yasuo',
          reason:
            'Wind Wall timing, flow management, and combo execution all raise the floor.',
        },
        {
          champion: 'LeBlanc',
          reason:
            'Clone, dash, and combo decision-making require fast, confident reads.',
        },
        {
          champion: 'Akali',
          reason:
            'Shroud usage and burst timing are punishing when fundamentals are shaky.',
        },
      ],
    },
    simpleChampionRecommendations: [
      {
        champion: 'Annie',
        reason: 'Very simple and easy to understand.',
      },
      {
        champion: 'Lux',
        reason: 'Safe range and clear combo pattern.',
      },
      {
        champion: 'Malzahar',
        reason: 'Easy waveclear and obvious value.',
      },
    ],
    footerNote:
      'Mid guide complete. The biggest beginner upgrade here is learning to shove before roaming instead of moving first and losing wave value.',
  },
  bottom: {
    id: 'bottom',
    name: 'ADC',
    title: 'The ranged carry who scales hardest with gold and positioning.',
    difficulty: 'Hard',
    summary:
      "The ranged carry. You're fragile early, but the most powerful damage dealer in the game once you have items. Your entire early game is one job: farm gold, stay alive, and scale into a late-game win condition.",
    simpleSummary:
      'ADC is about farming, staying alive, and scaling into late-game damage.',
    responsibilityCards: [
      {
        title: 'CS farming is your number one priority',
        description:
          'Minions are gold, and gold buys the items that make ADC powerful. Missing CS hurts this role more than almost any other.',
      },
      {
        title: 'Stay in the backline always',
        description:
          'You deal huge damage but die very fast. Attack whatever is closest safely and keep moving backward if enemies step in.',
      },
      {
        title: "You're weak early and that is normal",
        description:
          'At one item you can start trading, at two items you are a real threat, and at three items you can carry games. Stay patient.',
      },
    ],
    simpleResponsibilityCards: [
      {
        title: 'Farm every minion you can',
        description:
          'Aim for strong CS and do not trade kills for random risks.',
      },
      {
        title: 'Stay behind your team in fights',
        description:
          'Attack the closest safe target and keep backing up when needed.',
      },
      {
        title: "You're weak until two items",
        description: 'Do not force early fights before your spikes.',
      },
    ],
    responsibilities: [
      'CS farming is your number one priority. Minions are gold, and gold buys the items that make ADC powerful. Missing CS hurts this role more than almost any other.',
      'Stay in the backline always. You deal huge damage but die very fast. Attack whatever is closest safely and keep moving backward if enemies step in.',
      "You're weak early and that is normal. At one item you can start trading, at two items you are a real threat, and at three items you can carry games. Stay patient.",
    ],
    simpleResponsibilities: [
      'Farm every minion you can. Aim for strong CS and do not trade kills for random risks.',
      'Stay behind your team in fights. Attack the closest safe target and keep backing up when needed.',
      "You're weak until two items. Do not force early fights before your spikes.",
    ],
    phases: {
      early:
        "Farm everything you can and avoid dying. Let your support lead on trades. Push the wave 30–45 seconds before Dragon spawns so the enemy bot lane must choose between CS and the objective.",
      mid: "At two items you're a legitimate threat. Group near Dragon with your team, position behind your frontline, and keep farming between objectives.",
      late:
        'Never walk anywhere alone. In teamfights, attack the nearest target you can safely reach and keep kiting backward. After a won fight, hit the nearest tower or rotate to Baron.',
    },
    simplePhases: {
      early: 'Farm, let your support lead trades, and push wave before Dragon spawns.',
      mid: 'Group with your team at Dragon. Stay behind your frontline in every fight.',
      late: 'Never walk alone. Attack the nearest safe target and keep moving backward.',
    },
    goodFights: [
      'You have two or more completed items.',
      "Your support's crowd control is ready to start the trade or peel for you.",
      'The enemy frontline is low or clumped right in front of you.',
      'You have room behind you to kite if someone dives in.',
    ],
    avoidFights: [
      "You're still under two items and weaker than the enemy spike.",
      'An assassin is alive and missing from the map.',
      'Your support is dead, recalled, or too far away to protect you.',
      "You're already in close range with no safe way to back out.",
    ],
    synergyTitle: 'Support synergy',
    synergyPoints: [
      'With engage supports, wait for their CC to land before committing your damage.',
      'With enchanters, you can stand your ground more often because shields and heals extend your trade window.',
      'With poke supports, match their harassment rhythm so the enemy is already low when the next objective fight begins.',
    ],
    nextGameChecklist: [
      {
        title: 'CS target',
        detail: 'Treat early farm as the main job, even when skirmishes look tempting.',
      },
      {
        title: 'Fight shape',
        detail: 'Hit the closest safe target and keep retreat space behind you.',
      },
      {
        title: 'Objective wave',
        detail: 'Push bot first before walking to dragon windows.',
      },
    ],
    matchupReminders: [
      {
        situation: 'Into all-in lanes',
        response: 'Respect level 2 and keep the wave on your side more often.',
      },
      {
        situation: 'With poke support',
        response: 'Trade when their health is already chipped, not before.',
      },
      {
        situation: 'Against assassins later',
        response: 'Stand near peel and refuse solo side-wave greed.',
      },
    ],
    practiceHabits: [
      'Track CS at 10 minutes every match.',
      'Name the nearest safe target before each teamfight starts.',
      'Review if each death came from bad spacing, greed, or no vision.',
    ],
    championRecommendations: {
      easy: [
        {
          champion: 'Ashe',
          reason:
            'Very forgiving, no complex mobility, and her ultimate creates obvious utility.',
        },
        {
          champion: 'Miss Fortune',
          reason:
            'Simple lane pattern and a powerful teamfight ultimate with easy value.',
        },
        {
          champion: 'Sivir',
          reason:
            'Great waveclear and a reactive spell shield that teaches good timing.',
        },
        {
          champion: 'Jinx',
          reason:
            'Clear reset fantasy and simple, satisfying teamfight patterns.',
        },
        {
          champion: 'Jhin',
          reason:
            'The 4-shot rhythm teaches deliberate attack timing and trap setup.',
        },
      ],
      hard: [
        {
          champion: 'Draven',
          reason:
            'Catching axes constantly changes your movement and punishes mistakes heavily.',
        },
        {
          champion: 'Kalista',
          reason:
            'Unique movement and support coordination make her much harder than she looks.',
        },
        {
          champion: 'Vayne',
          reason:
            'Short range and precise condemn angles are very unforgiving early.',
        },
        {
          champion: 'Aphelios',
          reason:
            'The five-weapon system adds a lot of complexity before basics are stable.',
        },
        {
          champion: 'Lucian',
          reason:
            'Dash usage and passive sequencing demand sharp spacing and game sense.',
        },
      ],
    },
    simpleChampionRecommendations: [
      {
        champion: 'Ashe',
        reason: 'Very forgiving and easy to learn with.',
      },
      {
        champion: 'Miss Fortune',
        reason: 'Simple lane pattern and strong teamfight value.',
      },
      {
        champion: 'Sivir',
        reason: 'Good waveclear and a useful spell shield.',
      },
    ],
    footerNote:
      'ADC guide complete. The biggest beginner win here is surviving lane while keeping CS high enough to hit item spikes on time.',
  },
}
