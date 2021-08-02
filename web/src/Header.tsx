import React from 'react'
import { Link } from 'react-router-dom';
import { setAccessToken } from './accessToken';
import { useMeQuery, useLogoutMutation } from './generated/graphql';

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = ({}) => {
    const {data, loading} = useMeQuery();
    const [logout, {client}] = useLogoutMutation();

    let body: any = null;

    if (loading) {
      body = null;
    } else if (data && data.me) {
      body = (
      <>
      <div>you are logged in as: {data.me.email}</div>
      <div>
        <button onClick={async () => {
            await logout();
            setAccessToken("");
            await client!.resetStore();
        }}>logout</button>
      </div>
      </>
      );
    } else {
      body = <div>not logged in</div>;
    }

    return (
        <header>
            <div><Link to="/">home page</Link></div>
            <div><Link to="/register">register</Link></div>
            <div><Link to="/login">login</Link></div>
            <div><Link to="/bye">bye</Link></div>

            {body}
        </header>

    );
};