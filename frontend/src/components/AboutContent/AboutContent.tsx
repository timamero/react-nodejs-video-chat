import React from 'react';

const AboutContent: React.FC = () => {
  return (
    <div className="box">
      <h2 className="title is-2">About</h2>
      <div className="content">
        <p>Hello! Welcome to my chat application project.</p>
        <p>Because this is a demonstration application, some limitations have been applied:</p>
        <ul>
          <li>The allowed usernames are &apos;user1&apos;, and &apos;user2&apos;.</li>
          <li>The duration of chat rooms is set at 5 minutes.</li>
        </ul>
        <p>To test application, open app in two separate browsers tabs and sign in with the allowed usernames in each browser.</p>
        <p>Video streaming between two peers works best between the same browsers. The video streams are not displayed on mobile browsers.</p>
        <p>To learn more this project,{' '}
          <a href="https://github.com/timamero/react-nodejs-video-chat" target="_blank" rel="noreferrer">
            go to the Github project page.
          </a>
        </p>
      </div>
    </div>
  );
};

export default AboutContent;