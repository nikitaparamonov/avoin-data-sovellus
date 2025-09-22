import { useState } from 'react'
import './MatchModal.css'

const MatchModal = ({ match, onClose }) => {
	const [eventsOpen, setEventsOpen] = useState(false)

	const comp = match.competitions?.[0]
	const home = comp?.competitors?.find((c) => c.homeAway === 'home')
	const away = comp?.competitors?.find((c) => c.homeAway === 'away')
	const status = comp?.status?.type?.description || 'Tuntematon tila'
	const date = new Date(match.date).toLocaleString('fi-FI')
	const events = comp?.details || []

	const statsKeys = ['possessionPct', 'totalShots', 'shotsOnTarget', 'wonCorners', 'foulsCommitted', 'goalAssists']

	const statLabels = {
		possessionPct: 'Pallonhallinta',
		totalShots: 'Laukaukset',
		shotsOnTarget: 'Maalia kohti',
		wonCorners: 'Kulmapotkut',
		foulsCommitted: 'Rikkeet',
		goalAssists: 'Syötöt',
	}

	const getStat = (team, key) => team?.statistics?.find((s) => s.name === key)?.displayValue || '–'

	const renderStatRow = (key) => {
		const homeVal = parseFloat(getStat(home, key).replace('%', '')) || 0
		const awayVal = parseFloat(getStat(away, key).replace('%', '')) || 0
		const total = homeVal + awayVal || 1
		const homePct = (homeVal / total) * 100
		const awayPct = (awayVal / total) * 100

		return (
			<div className="stat-row" key={key}>
				<div className="stat-title">{statLabels[key]}</div>
				<div className="stat-bar">
					<div className="bar home" style={{ width: `${homePct}%` }} />
					<div className="bar away" style={{ width: `${awayPct}%` }} />
				</div>
				<div className="stat-values">
					<span>{getStat(home, key)}</span>
					<span>{getStat(away, key)}</span>
				</div>
			</div>
		)
	}

	const getEventIcon = (type) => {
		if (!type) return null
		const text = type.text.toLowerCase()

		if ((text.includes('goal')) || (text.includes('scored'))) {
			return '⚽'
		}
		if (text.includes('yellow')) {
			return '🟨'
		}
		if (text.includes('red')) {
			return '🟥'
		}
		if (text.includes('substitution')) {
			return '🔁'
		}
		return '📌'
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content new-theme" onClick={(e) => e.stopPropagation()}>
				<button className="close-btn" onClick={onClose}>
					×
				</button>

				<h2>{match.name}</h2>
				<p className="meta">
					<strong>Ajankohta:</strong> {date}
				</p>
				<p className="meta">
					<strong>Stadion:</strong> {comp?.venue?.fullName || match.venue?.displayName}
				</p>
				<p className="meta">
					<strong>Tila:</strong> {status}
				</p>

				<div className="teams-score">
					<div className="team">
						<img src={home?.team?.logo} alt="home" />
						<span>{home?.team?.displayName}</span>
					</div>
					<div className="score">
						{home?.score} – {away?.score}
					</div>
					<div className="team">
						<img src={away?.team?.logo} alt="away" />
						<span>{away?.team?.displayName}</span>
					</div>
				</div>

				<section className="statistics-section">
					<h3>Tilastot</h3>
					<div className="stat-table">{statsKeys.map(renderStatRow)}</div>
				</section>

				<section className="events-section">
					<h3 onClick={() => setEventsOpen(!eventsOpen)} className="collapsible-header">
						Tapahtumat {eventsOpen ? '▲' : '▼'}
					</h3>
					{eventsOpen && (
						<ul className="event-list">
							{events.map((ev, idx) => {
								const player = ev.athletesInvolved?.[0]
								const team =
									ev.team?.id === home?.team?.id ? home.team.displayName : away.team.displayName
								return (
									<li key={idx} className="event-item">
                                        <span className="event-icon">{getEventIcon(ev.type)}</span>
										<span className="event-time">{ev.clock?.displayValue}</span>
										<span className="event-team">{team}</span>
										{player && <span className="event-player">– {player.displayName}</span>}
										<span className="event-type"> ({ev.type?.text})</span>
									</li>
								)
							})}
						</ul>
					)}
				</section>
			</div>
		</div>
	)
}

export default MatchModal