// Sidebar.jsx
import React from 'react';

function Sidebar() {
    return (
        <aside style={{ width: '200px', padding: '10px', background: '#f0f8ff', boxShadow: '2px 2px 2px 2px #ddd', marginTop:'5px', borderTop: '0.2 px solid #ddd' }}>
            <div >
               <button style={{ display: 'block', margin: '10px 0' }}>Services</button>
               <button style={{ display: 'block', margin: '10px 0' }}>All CSAs</button>
               <button style={{ display: 'block', margin: '10px 0' }}>Other Option</button>
            </div>
        </aside>
    );
}

export default Sidebar;
