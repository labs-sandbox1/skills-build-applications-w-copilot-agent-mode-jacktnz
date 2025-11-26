import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev/api`
        : 'http://localhost:8000/api';
      
      console.log('Fetching activities and users from:', baseUrl);
      
      try {
        // Fetch activities
        const activitiesResponse = await fetch(`${baseUrl}/activities/`);
        if (!activitiesResponse.ok) {
          throw new Error(`HTTP error! status: ${activitiesResponse.status}`);
        }
        const activitiesData = await activitiesResponse.json();
        console.log('Activities data received:', activitiesData);
        
        // Fetch users
        const usersResponse = await fetch(`${baseUrl}/users/`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log('Users data received:', usersData);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesArray = activitiesData.results || activitiesData;
        const usersArray = usersData.results || usersData;
        
        // Create a map of user ID to user name
        const usersMap = {};
        if (Array.isArray(usersArray)) {
          usersArray.forEach(user => {
            usersMap[user.id] = user.name;
          });
        }
        
        setActivities(Array.isArray(activitiesArray) ? activitiesArray : []);
        setUsers(usersMap);
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
      <h2>🏃 Activities</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Activity Type</th>
              <th>Duration</th>
              <th>User</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td><span className="badge bg-secondary">{activity.id}</span></td>
                <td>
                  <span className="badge bg-success">{activity.type}</span>
                </td>
                <td>
                  <strong>{activity.duration}</strong> min
                </td>
                <td>
                  <span className="badge bg-info">{users[activity.user] || `User ${activity.user}`}</span>
                </td>
                <td>
                  <small className="text-muted">
                    {new Date(activity.timestamp).toLocaleString()}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activities.length === 0 && (
        <div className="alert alert-info">No activities found.</div>
      )}
    </div>
  );
}

export default Activities;
