// import React, { useState } from 'react';
// import axios from 'axios';

// const TicketForm = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post('http://localhost:3003/api/tickets', {
//         name,
//         email,
//       });
//       alert('Ticket submitted successfully!');
//       setName('');
//       setEmail('');
//     } catch (error) {
//       console.log('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Ticket Form</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default TicketForm;



import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.1.74:3003');

const TicketForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://192.168.1.74:3003/api/tickets', { name, email });
      setName('');
      setEmail('');

      // Emit an event to notify the server that a ticket was added
      socket.emit('ticketAdded', { name, email });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const formStyle = {
    maxWidth: '300px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  };
  
  const inputStyle = {
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };
  
  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };
  
  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => e.target.style = { ...buttonStyle, ...buttonHoverStyle }}
        onMouseLeave={(e) => e.target.style = buttonStyle}
      >
        Submit
      </button>
    </form>
  );
};



export default TicketForm;
