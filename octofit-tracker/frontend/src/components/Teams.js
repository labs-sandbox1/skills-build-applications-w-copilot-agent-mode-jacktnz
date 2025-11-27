import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev/api`
        : 'http://localhost:8000/api';
      
      console.log('Fetching teams and users from:', baseUrl);
      
      try {
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
        const teamsArray = teamsData.results || teamsData;
        const usersArray = usersData.results || usersData;
        
        setTeams(Array.isArray(teamsArray) ? teamsArray : []);
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
      <h2>🦸‍♂️ Teams</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Team Name</th>
              <th>Description</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => {
              const members = getTeamMembers(team.id);
              return (
                <tr key={team.id}>
                  <td><span className="badge bg-secondary">{team.id}</span></td>
                  <td>
                    <strong className="text-primary">{team.name}</strong>
                  </td>
                  <td>{team.description}</td>
                  <td>
                    {members.length > 0 ? (
                      <div>
                        {members.map((member, index) => (
                          <span key={member.id}>
                            <span className="badge bg-success me-1 mb-1">{member.name}</span>
                            {index < members.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="badge bg-light text-dark">No members</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {teams.length === 0 && (
        <div className="alert alert-info">No teams found.</div>
      )}
    </div>
  );
}

export default Teams;
