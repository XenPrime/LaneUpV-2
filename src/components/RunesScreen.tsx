import { useState } from 'react'
import { RUNE_PATHS } from '../data/runes'
import type { RunePath, RuneInfo } from '../data/runes'

// ── Sub-components ────────────────────────────────────────────────────────

interface RuneCardProps {
  rune: RuneInfo
  accent: string
  isKeystone?: boolean
}

function RuneCard({ rune, accent, isKeystone = false }: RuneCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`rune-card ${isKeystone ? 'rune-card--keystone' : ''} ${expanded ? 'rune-card--expanded' : ''}`}
      style={{ borderLeftColor: accent }}
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      <div className="rune-card-header">
        <div className="rune-card-name-row">
          {isKeystone && (
            <span className="rune-keystone-badge" style={{ backgroundColor: accent }}>
              Keystone
            </span>
          )}
          <span className="rune-card-name">{rune.name}</span>
        </div>
        <span className="rune-expand-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      <p className="rune-card-description">{rune.description}</p>

      {expanded && (
        <div className="rune-card-details">
          <div className="rune-detail-block">
            <span className="rune-detail-label">When to take it</span>
            <p className="rune-detail-text">{rune.whenToTake}</p>
          </div>
          <div className="rune-detail-block">
            <span className="rune-detail-label">Who uses it</span>
            <p className="rune-detail-text">{rune.whoUsesIt}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface PathTabProps {
  path: RunePath
  isActive: boolean
  onClick: () => void
}

function PathTab({ path, isActive, onClick }: PathTabProps) {
  return (
    <button
      type="button"
      className={`rune-path-tab ${isActive ? 'rune-path-tab--active' : ''}`}
      style={isActive ? { borderBottomColor: path.color, color: path.color } : {}}
      onClick={onClick}
    >
      <span className="rune-path-tab-dot" style={{ backgroundColor: path.color }} />
      {path.name}
    </button>
  )
}

interface PathDetailProps {
  path: RunePath
}

function PathDetail({ path }: PathDetailProps) {
  return (
    <div className="rune-path-detail">
      {/* Path header */}
      <div className="rune-path-header" style={{ borderLeftColor: path.color }}>
        <div>
          <h2 className="rune-path-name" style={{ color: path.color }}>
            {path.name}
          </h2>
          <p className="rune-path-tagline">{path.tagline}</p>
        </div>
      </div>

      <p className="rune-path-summary">{path.summary}</p>

      <div className="rune-path-best-for">
        <span className="rune-detail-label">Best for</span>
        <div className="rune-best-for-chips">
          {path.bestFor.map((label) => (
            <span key={label} className="rune-chip" style={{ borderColor: path.color, color: path.color }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Keystones */}
      <section className="rune-section">
        <h3 className="rune-section-title">
          <span className="rune-section-dot" style={{ backgroundColor: path.color }} />
          Keystones
        </h3>
        <p className="rune-section-hint">
          Your keystone is the most powerful rune — it defines your playstyle. Tap any card to see when to use it.
        </p>
        <div className="rune-card-list">
          {path.keystones.map((ks) => (
            <RuneCard key={ks.name} rune={ks} accent={path.color} isKeystone />
          ))}
        </div>
      </section>

      {/* Secondary rows */}
      {path.rows.map((row) => (
        <section key={row.slot} className="rune-section">
          <h3 className="rune-section-title">
            <span className="rune-section-dot" style={{ backgroundColor: path.color }} />
            Row {row.slot}
            <span className="rune-row-hint">— pick one</span>
          </h3>
          <div className="rune-card-list">
            {row.runes.map((rune) => (
              <RuneCard key={rune.name} rune={rune} accent={path.color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ── All-keystones overview ────────────────────────────────────────────────

function KeystoneOverview() {
  return (
    <div className="rune-path-detail">
      <div className="rune-path-header" style={{ borderLeftColor: '#c8aa6e' }}>
        <div>
          <h2 className="rune-path-name">All Keystones</h2>
          <p className="rune-path-tagline">Every keystone at a glance — tap to expand</p>
        </div>
      </div>
      <p className="rune-path-summary">
        Your keystone is the single most important rune choice. It shapes how your champion plays the whole game. Browse every keystone here to find one that matches how you like to fight.
      </p>
      {RUNE_PATHS.map((path) => (
        <section key={path.id} className="rune-section">
          <h3 className="rune-section-title">
            <span className="rune-section-dot" style={{ backgroundColor: path.color }} />
            <span style={{ color: path.color }}>{path.name}</span>
          </h3>
          <div className="rune-card-list">
            {path.keystones.map((ks) => (
              <RuneCard key={ks.name} rune={ks} accent={path.color} isKeystone />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────

export function RunesScreen() {
  const [activePathId, setActivePathId] = useState<string>('overview')

  return (
    <div className="screen-shell">
      <style>{`
        /* ── Rune screen styles ─────────────────────────────────────────── */
        .rune-path-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--border);
          overflow-x: auto;
          margin-bottom: 24px;
          flex-shrink: 0;
        }
        .rune-path-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.15s, border-color 0.15s;
          margin-bottom: -2px;
        }
        .rune-path-tab:hover { color: var(--text-primary); }
        .rune-path-tab--active { color: var(--accent); }
        .rune-path-tab-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .rune-path-detail { display: flex; flex-direction: column; gap: 28px; }

        .rune-path-header {
          border-left: 4px solid;
          padding-left: 14px;
        }
        .rune-path-name { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
        .rune-path-tagline { font-size: 13px; color: var(--text-secondary); margin: 0; font-style: italic; }
        .rune-path-summary { font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin: 0; }

        .rune-path-best-for { display: flex; flex-direction: column; gap: 8px; }
        .rune-best-for-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .rune-chip {
          font-size: 12px; font-weight: 600;
          border: 1px solid;
          border-radius: 20px;
          padding: 3px 10px;
          background: transparent;
        }

        .rune-section { display: flex; flex-direction: column; gap: 12px; }
        .rune-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }
        .rune-section-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .rune-row-hint { font-size: 12px; color: var(--text-secondary); font-weight: 400; }
        .rune-section-hint { font-size: 13px; color: var(--text-secondary); margin: 0; }

        .rune-card-list { display: flex; flex-direction: column; gap: 8px; }

        .rune-card {
          border-left: 3px solid;
          background: var(--surface);
          border-radius: 6px;
          padding: 12px 14px;
          cursor: pointer;
          transition: background 0.15s;
          outline: none;
        }
        .rune-card:hover, .rune-card:focus { filter: brightness(1.05); }
        .rune-card--keystone { padding: 14px 16px; }

        .rune-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }
        .rune-card-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .rune-keystone-badge {
          font-size: 10px; font-weight: 700;
          color: #000;
          border-radius: 4px;
          padding: 2px 7px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .rune-card-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .rune-expand-icon { font-size: 10px; color: var(--text-secondary); flex-shrink: 0; }

        .rune-card-description {
          font-size: 13px; color: var(--text-secondary);
          line-height: 1.55; margin: 0;
        }

        .rune-card-details {
          margin-top: 12px;
          display: flex; flex-direction: column; gap: 10px;
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
        .rune-detail-block { display: flex; flex-direction: column; gap: 4px; }
        .rune-detail-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--text-secondary);
        }
        .rune-detail-text { font-size: 13px; color: var(--text-primary); margin: 0; line-height: 1.5; }
      `}</style>

      <div className="screen-header">
        <h1 className="screen-title">Rune Guide</h1>
        <p className="screen-subtitle">
          Learn every rune path, keystone, and secondary row — written for new players. Tap any card to see when and why to use it.
        </p>
      </div>

      {/* Path tabs */}
      <div className="rune-path-tabs">
        <button
          type="button"
          className={`rune-path-tab ${activePathId === 'overview' ? 'rune-path-tab--active' : ''}`}
          style={activePathId === 'overview' ? { borderBottomColor: '#c8aa6e', color: '#c8aa6e' } : {}}
          onClick={() => setActivePathId('overview')}
        >
          ★ All Keystones
        </button>
        {RUNE_PATHS.map((path) => (
          <PathTab
            key={path.id}
            path={path}
            isActive={activePathId === path.id}
            onClick={() => setActivePathId(path.id)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="screen-content">
        {activePathId === 'overview'
          ? <KeystoneOverview />
          : <PathDetail path={RUNE_PATHS.find((p) => p.id === activePathId)!} />
        }
      </div>
    </div>
  )
}
