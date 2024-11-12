// Main.jsx
import React from 'react';

function Main() {
    return (
        <main style={{ flex: 1, padding: '10px', background:'fbf5df', border:'2px solid #ddd',margin:'4px' }}>
            <section style={{ marginBottom: '20px' }}>
                <h2>News</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', padding: '10px' }}>
                    <button>{"<"}</button>
                    <div>
                        <h3>News Headline</h3>
                        <p>News content here... Click to read more...</p>
                    </div>
                    <button>{">"}</button>
                </div>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>Meeting Schedule</h2>
                <p>Monday 10PM for this reason</p>
            </section>
            
        </main>
    );
}

export default Main;
