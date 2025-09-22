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

	return (
		<div>
			<h2>Ottelut</h2>

			<label htmlFor="league">Valitse liiga: </label>
			<select id="league" value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}>
				{leagues.map((l) => (
					<option key={l.code} value={l.code}>
						{l.name}
					</option>
				))}
			</select>

			{loading && <p>Ladataan otteluita...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{!loading && matches.length === 0 && <p>Ei otteluita saatavilla.</p>}

			<div>
				{matches.map((match) => (
					<MatchCard
						key={match.id}
						match={match}
						onClick={(m) => setSelectedMatch(m)}
					/>
				))}
			</div>

			{selectedMatch && <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
		</div>
	)
}

export default Scoreboard
