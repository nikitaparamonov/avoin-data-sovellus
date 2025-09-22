import { useEffect, useState } from 'react'
import MatchCard from './MatchCard'
import MatchModal from './MatchModal'
import './App.css'

const leagues = [
	{ name: 'Valioliiga (Englanti)', code: 'eng.1' },
	{ name: 'La Liga (Espanja)', code: 'esp.1' },
	{ name: 'Serie A (Italia)', code: 'ita.1' },
	{ name: 'Bundesliiga (Saksa)', code: 'ger.1' },
	{ name: 'Ligue 1 (Ranska)', code: 'fra.1' },
	{ name: 'MLS (USA)', code: 'usa.1' },
	{ name: 'UEFA Mestarien liiga', code: 'uefa.champions' },
]

const Scoreboard = () => {
	const [selectedLeague, setSelectedLeague] = useState('eng.1')
	const [matches, setMatches] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [selectedMatch, setSelectedMatch] = useState(null)
    const [showPastMatches, setShowPastMatches] = useState(false)

	const fetchMatches = async (leagueCode) => {
		setLoading(true)
		setError('')
		try {
			const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/scoreboard`)
			const data = await response.json()
			setMatches(data.events || [])
		} catch (err) {
			setError('Virhe haettaessa ottelutietoja.')
			setMatches([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchMatches(selectedLeague)
	}, [selectedLeague])

	const now = new Date()
	const oneWeekAgo = new Date(now)
	oneWeekAgo.setDate(now.getDate() - 7)

	const filteredMatches = matches.filter((match) => {
		const matchDate = new Date(match.date)
		if (showPastMatches) {
			return matchDate < now && matchDate >= oneWeekAgo
		} else {
			return matchDate >= now
		}
	})

	return (
		<div>
			<h2>
				<label htmlFor="league">Valitse liiga: </label>
			</h2>
			<div className="select-toggle-menu">
				<div className="custom-select">
					<select id="league" value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}>
						{leagues.map((l) => (
							<option key={l.code} value={l.code}>
								{l.name}
							</option>
						))}
					</select>
				</div>
				<div className="toggle-switch">
					<input
						type="checkbox"
						id="matchToggle"
						checked={showPastMatches}
						onChange={() => setShowPastMatches(!showPastMatches)}
					/>
					<label htmlFor="matchToggle" className="switch-label"></label>
				</div>
			</div>

			{loading && <p>Ladataan otteluita...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!loading && filteredMatches.length === 0 && <p>Ei otteluita saatavilla.</p>}

			<div className="matches-list">
				{filteredMatches.map((match) => (
					<div key={match.id} onClick={() => setSelectedMatch(match)}>
						<MatchCard match={match} />
					</div>
				))}
			</div>

			{selectedMatch && <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
		</div>
	)
}

export default Scoreboard
