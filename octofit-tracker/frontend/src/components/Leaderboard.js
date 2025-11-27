import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [teams, setTeams] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev/api`
        : 'http://localhost:8000/api';
      
      console.log('Fetching leaderboard, teams, and users from:', baseUrl);
      
      try {
        // Fetch leaderboard
        const leaderboardResponse = await fetch(`${baseUrl}/leaderboard/`);
        if (!leaderboardResponse.ok) {
          throw new Error(`HTTP error! status: ${leaderboardResponse.status}`);
        }
        const leaderboardData = await leaderboardResponse.json();
        console.log('Leaderboard data received:', leaderboardData);
        
        // Fetch teams
        const teamsResponse = await fetch(`${baseUrl}/teams/`);
        if (!teamsResponse.ok) {
          throw new Error(`HTTP error! status: ${teamsResponse.status}`);
        }
        const teamsData = await teamsResponse.json();
        console.log('Teams data received:', teamsData);
        
        // Fetch users
        const usersResponse = await fetch(`${baseUrl}/users/`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log('Users data received:', usersData);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardArray = leaderboardData.results || leaderboardData;
        const teamsArray = teamsData.results || teamsData;
        const usersArray = usersData.results || usersData;
        
        // Create a map of team ID to team name
        const teamsMap = {};
        if (Array.isArray(teamsArray)) {
          teamsArray.forEach(team => {
            teamsMap[team.id] = team.name;
          });
        }
        
        const sortedData = Array.isArray(leaderboardArray) 
          ? [...leaderboardArray].sort((a, b) => b.points - a.points)
          : [];
        
        setLeaderboard(sortedData);
        setTeams(teamsMap);
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get team members
  const getTeamMembers = (teamId) => {
    return users.filter(user => user.team === teamId);
  };

  if (loading) return <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{width: '150px'}}>Rank</th>
              <th>Team Name</th>
              <th>Members</th>
              <th style={{width: '150px'}}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => {
              const members = getTeamMembers(entry.team);
              return (
              <tr key={entry.id} style={{
                backgroundColor: index === 0 ? '#fff3cd' : index === 1 ? '#e2e3e5' : index === 2 ? '#f8d7da' : 'transparent'
              }}>
                <td>
                  {index === 0 && <span className="badge bg-warning text-dark fs-5">🏆 1st</span>}
                  {index === 1 && <span className="badge bg-secondary fs-6">🥈 2nd</span>}
                  {index === 2 && <span className="badge bg-danger fs-6">🥉 3rd</span>}
                  {index > 2 && <span className="badge bg-light text-dark">{index + 1}th</span>}
                </td>
                <td>
                  <strong className="text-primary fs-5">{teams[entry.team] || `Team ${entry.team}`}</strong>
                </td>
                <td>
                  {members.length > 0 ? (
                    <div>
                      {members.map((member, memberIndex) => (
                        <span key={member.id}>
                          <span className="badge bg-success me-1 mb-1">{member.name}</span>
                          {memberIndex < members.length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="badge bg-light text-dark">No members</span>
                  )}
                </td>
                <td>
                  <span className="badge bg-primary fs-5">{entry.points} pts</span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {leaderboard.length === 0 && (
        <div className="alert alert-info">No leaderboard data found.</div>
      )}
    </div>
  );
}

export default Leaderboard;
