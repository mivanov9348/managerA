import React, { useEffect, useState } from 'react';

const NextMatch = () => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual API endpoint or data fetching logic
        fetch('/api/next-match')
            .then((res) => res.json())
            .then((data) => {
                setMatch(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading next match...</div>;
    }

    if (!match) {
        return <div>No upcoming match found.</div>;
    }

    return (
        <div>
            <h2>Next Match</h2>
            <p>
                <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
            </p>
            <p>Date: {new Date(match.date).toLocaleString()}</p>
            <p>Location: {match.location}</p>
        </div>
    );
};

export default NextMatch;