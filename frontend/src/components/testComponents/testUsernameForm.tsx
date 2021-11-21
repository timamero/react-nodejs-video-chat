import React, { FormEventHandler} from "react";

interface testUsernameFormProps {
  submitUsername: FormEventHandler<HTMLFormElement>;
  username: string;
}

const TestUsernameForm: React.FC<testUsernameFormProps> = ({submitUsername, username}) => {
  return (
    <div>
      {!username
       &&
        <form onSubmit={submitUsername}>
          <label>Username
            <input type="text" id="username" className="input" required/>
          </label>
          <button type="submit" className="button is-primary">Create Username</button>
        </form>
      }
    </div>
    
    
  )
}

export default TestUsernameForm;