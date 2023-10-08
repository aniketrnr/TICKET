// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UserWaitingList = () => {
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

//   return (
//     <div>
//       <h2>User Waiting List</h2>
//       <ul>
//         {tickets.map((ticket) => (
//           <li key={ticket._id}>
//             {ticket.name} - {ticket.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserWaitingList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.1.74:3003');

const UserWaitingList = () => {
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

  return (
    <div>
      <h2>User Waiting List</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            {ticket.name} - {ticket.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserWaitingList;