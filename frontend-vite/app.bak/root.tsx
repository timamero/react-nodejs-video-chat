import { Outlet, Scripts } from 'react-router';
// convert to declarative mode
// https://reactrouter.com/start/declarative/installation
export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
      </head>
      <body>
        <h1>Hello world!</h1>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
