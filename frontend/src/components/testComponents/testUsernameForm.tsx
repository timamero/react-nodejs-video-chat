import React, { FormEventHandler} from "react";

interface testUsernameFormProps {
  submitUsername: FormEventHandler<HTMLFormElement>;
}

const TestUsernameForm: React.FC<testUsernameFormProps> = ({submitUsername}) => {
  return (
    <div>
        <form onSubmit={submitUsername}>
          <label>Username
            <input type="text" id="username" className="input" required/>
          </label>
          <button type="submit" className="button is-primary">Create Username</button>
        </form>
    </div>
    
    
  )
}

export default TestUsernameForm;