import React, { useState } from 'react'
import { useLoginMutation } from 'src/generated/graphql';

interface LoginProps {

}

export const Login: React.FC<LoginProps> = ({}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login] = useLoginMutation();
    return (
        <form onSubmit={ async e => {
            e.preventDefault();
            console.log('form submitted');
            console.log(email, password,);
            const response = await login(
                {
                    variables:{
                        email, password
                    }
                }
            );
            console.log(response.data)
        }}>
            <div>
                <input value={email} placeholder="email" onChange={ e => {
                    setEmail(e.target.value);
                }}/>
            </div>
            <div>
                <input type="password" value={password} placeholder="password" onChange={ e => {
                    setPassword(e.target.value);
                }}/>
            </div>
            <button type="submit">login</button>
        </form>

    );
};