/**
 * Chat text message
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  message: PropTypes.string.isRequired,
  className : PropTypes.string.isRequired,
};

type MessageProps = PropTypes.InferProps<typeof propTypes>;

const Message: React.FC<MessageProps> = memo(function Message({ message, className }) {
  return (
    <div className={`Message box ${className} py-1 my-2`}>
      {message}
    </div>
  );
});

Message.propTypes = propTypes;

export default Message;