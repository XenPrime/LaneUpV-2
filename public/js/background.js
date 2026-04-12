let desktopWindowId = null
let inGameWindowId = null
let lcuCredentials = null
let featureRetryTimeout = null

overwolf.extensions.onAppLaunchTriggered.addListener((event) => {
  const source = getLaunchSource(event)

  if (source === 'gamelaunchevent') {
    registerGameEvents()
    openInGameWindow()
    return
  }

  openDesktopWindow()
})

window.addEventListener('load', () => {
  registerHotkeys()
  checkIfGameAlreadyRunning()
})

overwolf.games.onGameLaunched.addListener((info) => {
  if (info.gameId !== LEAGUE_GAME_ID) {
    return
  }

  registerGameEvents()
  openInGameWindow()
})

overwolf.games.onGameInfoUpdated.addListener((info) => {
  if (!info || !info.gameInfo || info.gameInfo.id !== LEAGUE_GAME_ID) {
    return
  }

  if (!info.gameInfo.isRunning) {
    unregisterGameEvents()
    closeInGameWindow()
  }
})

function checkIfGameAlreadyRunning() {
  overwolf.games.getRunningGameInfo((info) => {
    if (info && info.id === LEAGUE_GAME_ID && info.isRunning) {
      registerGameEvents()
      openInGameWindow()
    }
  })
}

function openDesktopWindow() {
  overwolf.windows.obtainDeclaredWindow(WINDOWS.DESKTOP, (result) => {
    if (!result.success) {
      return
    }

    desktopWindowId = result.window.id
    overwolf.windows.restore(desktopWindowId, () => {
      overwolf.windows.bringToFront(desktopWindowId, () => {})
    })
  })
}

function openInGameWindow() {
  overwolf.windows.obtainDeclaredWindow(WINDOWS.IN_GAME, (result) => {
    if (!result.success) {
      return
    }

    inGameWindowId = result.window.id
    overwolf.windows.restore(inGameWindowId, () => {})
  })
}

function closeInGameWindow() {
  if (!inGameWindowId) {
    return
  }

  overwolf.windows.close(inGameWindowId, () => {})
  inGameWindowId = null
}

function registerHotkeys() {
  overwolf.settings.hotkeys.onPressed.addListener((event) => {
    switch (event.name) {
      case HOTKEYS.TOGGLE_APP:
        toggleWindow(WINDOWS.DESKTOP, desktopWindowId)
        break
      case HOTKEYS.TOGGLE_OVERLAY:
        toggleWindow(WINDOWS.IN_GAME, inGameWindowId)
        break
      default:
        break
    }
  })
}

function toggleWindow(windowName, currentWindowId) {
  if (!currentWindowId) {
    if (windowName === WINDOWS.DESKTOP) {
      openDesktopWindow()
    } else if (windowName === WINDOWS.IN_GAME) {
      openInGameWindow()
    }
    return
  }

  overwolf.windows.getWindowState(currentWindowId, (result) => {
    if (
      result.window_state_ex === 'minimized' ||
      result.window_state_ex === 'closed'
    ) {
      overwolf.windows.restore(currentWindowId, () => {})
      return
    }

    overwolf.windows.minimize(currentWindowId, () => {})
  })
}

function registerGameEvents() {
  overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, (result) => {
    if (result.status === 'success') {
      overwolf.games.events.onNewEvents.removeListener(onNewGameEvent)
      overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdate)
      overwolf.games.events.onNewEvents.addListener(onNewGameEvent)
      overwolf.games.events.onInfoUpdates2.addListener(onInfoUpdate)
      return
    }

    clearTimeout(featureRetryTimeout)
    featureRetryTimeout = setTimeout(registerGameEvents, 3000)
  })
}

function unregisterGameEvents() {
  clearTimeout(featureRetryTimeout)
  overwolf.games.events.onNewEvents.removeListener(onNewGameEvent)
  overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdate)
}

function getLaunchSource(event) {
  if (!event || typeof event.origin !== 'string') {
    return null
  }

  try {
    const url = new URL(event.origin)
    return url.searchParams.get('source')
  } catch (_error) {
    return null
  }
}

function onNewGameEvent(data) {
  if (!data || !data.events) {
    return
  }

  data.events.forEach((event) => {
    if (event.name === 'matchStart') {
      sendToWindow(inGameWindowId, 'MATCH_START', {})
      return
    }

    if (event.name === 'matchEnd') {
      sendToWindow(inGameWindowId, 'MATCH_END', {})
      return
    }

    if (event.name === 'death') {
      sendToWindow(inGameWindowId, 'PLAYER_DIED', {})
    }
  })
}

function onInfoUpdate(data) {
  if (!data) {
    return
  }

  if (data.feature === 'champion_select') {
    sendToWindow(inGameWindowId, 'CHAMP_SELECT_UPDATE', { info: data.info })
  }

  if (data.feature === 'match_info') {
    sendToWindow(inGameWindowId, 'MATCH_INFO_UPDATE', { info: data.info })
  }
}

function sendToWindow(windowId, id, content) {
  if (!windowId) {
    return
  }

  overwolf.windows.sendMessage(windowId, id, content, () => {})
}

function readLcuLockfile(lolInstallPath, callback) {
  const normalizedPath = lolInstallPath.replace(/\\/g, '/') + '/lockfile'

  overwolf.io.readFileContents(
    normalizedPath,
    overwolf.io.enums.eEncoding.UTF8,
    (result) => {
      if (!result.success || !result.content) {
        callback(null)
        return
      }

      const parts = result.content.trim().split(':')

      if (parts.length < 5) {
        callback(null)
        return
      }

      lcuCredentials = {
        port: parts[2],
        password: parts[3],
        protocol: parts[4],
      }

      callback(lcuCredentials)
    },
  )
}

function getLCUCredentials() {
  return lcuCredentials
}
