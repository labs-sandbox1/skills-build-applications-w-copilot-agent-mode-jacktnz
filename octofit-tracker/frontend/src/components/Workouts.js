import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev/api`
        : 'http://localhost:8000/api';
      
      console.log('Fetching workouts and teams from:', baseUrl);
      
      try {
        // Fetch workouts
        const workoutsResponse = await fetch(`${baseUrl}/workouts/`);
        if (!workoutsResponse.ok) {
          throw new Error(`HTTP error! status: ${workoutsResponse.status}`);
        }
        const workoutsData = await workoutsResponse.json();
        console.log('Workouts data received:', workoutsData);
        
        // Fetch teams
        const teamsResponse = await fetch(`${baseUrl}/teams/`);
        if (!teamsResponse.ok) {
          throw new Error(`HTTP error! status: ${teamsResponse.status}`);
        }
        const teamsData = await teamsResponse.json();
        console.log('Teams data received:', teamsData);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsArray = workoutsData.results || workoutsData;
        const teamsArray = teamsData.results || teamsData;
        
        // Create a map of team ID to team name
        const teamsMap = {};
        if (Array.isArray(teamsArray)) {
          teamsArray.forEach(team => {
            teamsMap[team.id] = team.name;
          });
        }
        
        setWorkouts(Array.isArray(workoutsArray) ? workoutsArray : []);
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
      <h2>💪 Workouts</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workout Name</th>
              <th>Description</th>
              <th>Suggested For</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map(workout => (
              <tr key={workout.id}>
                <td><span className="badge bg-secondary">{workout.id}</span></td>
                <td>
                  <strong className="text-primary">{workout.name}</strong>
                </td>
                <td>{workout.description}</td>
                <td>
                  {workout.suggested_for && workout.suggested_for.length > 0 ? (
                    workout.suggested_for.map(teamId => (
                      <span key={teamId} className="badge bg-info me-1">
                        {teams[teamId] || `Team ${teamId}`}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {workouts.length === 0 && (
        <div className="alert alert-info">No workouts found.</div>
      )}
    </div>
  );
}

export default Workouts;
