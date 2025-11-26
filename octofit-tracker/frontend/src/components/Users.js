import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev/api`
        : 'http://localhost:8000/api';
      
      console.log('Fetching users and teams from:', baseUrl);
      
      try {
        // Fetch users
        const usersResponse = await fetch(`${baseUrl}/users/`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log('Users data received:', usersData);
        
        // Fetch teams
        const teamsResponse = await fetch(`${baseUrl}/teams/`);
        if (!teamsResponse.ok) {
          throw new Error(`HTTP error! status: ${teamsResponse.status}`);
        }
        const teamsData = await teamsResponse.json();
        console.log('Teams data received:', teamsData);
        
        // Handle both paginated (.results) and plain array responses
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        
        // Create a map of team ID to team name
        const teamsMap = {};
        if (Array.isArray(teamsArray)) {
          teamsArray.forEach(team => {
            teamsMap[team.id] = team.name;
          });
        }
        
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        setTeams(teamsMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>👥 Users</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><span className="badge bg-secondary">{user.id}</span></td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>
                  {user.team ? (
                    <span className="badge bg-info">{teams[user.team] || `Team ${user.team}`}</span>
                  ) : (
                    <span className="badge bg-light text-dark">No team</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="alert alert-info">No users found.</div>
      )}
    </div>
  );
}

export default Users;
