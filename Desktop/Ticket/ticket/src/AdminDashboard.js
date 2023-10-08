// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const response = await axios.get('http://localhost:3002/api/tickets');
//         setTickets(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const handleRemove = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3002/api/tickets/${id}`);
//       setTickets(tickets.filter(ticket => ticket._id !== id));
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <ul>
//         {tickets.map((ticket) => (
//           <li key={ticket._id}>
//             {ticket.name} - {ticket.email}{' '}
//             <button onClick={() => handleRemove(ticket._id)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.1.74:3003');

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://192.168.1.74:3003/api/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTickets();

    // Listen for ticketAdded and ticketRemoved events and update the ticket list
    socket.on('ticketAdded', (ticket) => {
      setTickets([...tickets, ticket]);
    });

    socket.on('ticketRemoved', (id) => {
      setTickets(tickets.filter((t) => t._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [tickets]); // This fixes the warning

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://192.168.1.74:3003/api/tickets/${id}`);

      // Emit an event to notify the server that a ticket was removed
      socket.emit('ticketRemoved', id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            {ticket.name} - {ticket.email}{' '}
            <button onClick={() => handleRemove(ticket._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;