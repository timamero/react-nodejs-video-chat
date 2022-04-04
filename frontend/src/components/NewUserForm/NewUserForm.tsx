/**
 * New user form
 */
import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setNewUser } from '../../app/features/userSlice';
import { sendUserEntered } from '../../services/socket/publishers';

const NewUserForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [usernameInput, setUsernameInput] = useState<string>('');

  const handleUsernameSubmit = (event: FormEvent) => {
    event.preventDefault();

    // For demonstration application, the allowed usernames are `user1` and `user2`
    // To remove this limitation, move code outside of the if block and delete if block
    if (usernameInput === 'user1' || usernameInput === 'user2') {
      window.localStorage.setItem('chat-username', usernameInput);
      dispatch(setNewUser(usernameInput));
      setUsernameInput('');

      sendUserEntered(usernameInput);
    }
  };

  return (
    <form id="usernameForm" className="box" onSubmit={handleUsernameSubmit}>
      <p className='is-size-7 is-family-monospace'>For this application demo, the allowed usernames are user1 and user2</p>
      <label id="username" htmlFor="usernameInput" className="label">Username</label>
      <div className="control block">
        <input
          id="usernameInput"
          className="input"
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)} />
      </div>
      <div className="control block">
        <button
          id="submitUsername"
          type="submit"
          className="button is-primary"
        >
            Submit
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;