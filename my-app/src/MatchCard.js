import './MatchCard.css'

const getMatchBorderColor = (state) => {
	switch (state) {
		case 'in':
			return '#cc0000'
		case 'post':
			return '#000000'
		case 'pre':
		default:
			return '#0077cc'
	}
}

const MatchCard = ({ match, onClick }) => {
	const comp = match.competitions[0]
	const status = match.status.type.description
	const matchState = match.status.type.state
	const isLive = matchState === 'in'
	const isUpcoming = matchState === 'pre'
	const [home, away] = comp.competitors
	const borderColor = getMatchBorderColor(matchState)

	const clickHandler = !isUpcoming && onClick ? () => onClick(match) : undefined

	return (
		<div
			className={`match-card ${!isUpcoming ? 'hoverable' : 'disabled'}`}
			style={{ borderLeft: `5px solid ${borderColor}` }}
			onClick={clickHandler}
		>
			<div className="team">
				<img src={away.team.logo} alt={away.team.displayName} style={{ marginRight: '10px' }} />
				<span className="team-name">{away.team.displayName}</span>
			</div>

			<div className="score">
				{away.score} : {home.score}
				{isLive && <span className="live-indicator">● LIVE</span>}
			</div>

			<div className="team" style={{ justifyContent: 'flex-end' }}>
				<span className="team-name">{home.team.displayName}</span>
				<img src={home.team.logo} alt={home.team.displayName} style={{ marginLeft: '10px' }} />
			</div>

			<div className="match-info">
				<div>{new Date(match.date).toLocaleString('fi-FI')}</div>
				{comp.venue && (
					<div>
						{comp.venue.fullName}, {comp.venue.address?.city}
					</div>
				)}
				{comp.broadcasts && comp.broadcasts.length > 0 && (
					<div>TV: {comp.broadcasts.map((b) => b.names.join(', ')).join(', ')}</div>
				)}
				<div>{status}</div>
			</div>
		</div>
	)
}

export default MatchCard