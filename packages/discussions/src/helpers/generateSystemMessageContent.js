const getToken = (tokens, name, required = true) => {
  const result = tokens
    // find the token by the name
    .filter(token => token.name === name)
    // map to a copy of the token but omit the name property
    .map(({ name, ...rest }) => ({ ...rest }))[0];
  if (!result && required) {
    throw new Error(`Could not find token named ${name}`);
  } else {
    return result;
  }
};

const textToken = value => ({ type: 'text', value });

export default (action, content) => {
  let error;
  try {
    switch (action) {
      case 'Invitation Sent': {
        const invitationEmail = getToken(content, 'invitationEmail', false);
        return [
          invitationEmail
            ? textToken(invitationEmail.value)
            : getToken(content, 'user'),
          textToken('was invited by'),
          getToken(content, 'invitedBy'),
        ];
      }
      case 'Invitation Resent': {
        const invitationEmail = getToken(content, 'invitationEmail', false);
        return [
          invitationEmail
            ? textToken(invitationEmail.value)
            : getToken(content, 'user'),
          textToken('had their invitation updated by'),
          getToken(content, 'invitedBy'),
        ];
      }
      case 'Invitation Removed': {
        const invitationEmail = getToken(content, 'invitationEmail', false);
        return [
          invitationEmail
            ? textToken(invitationEmail.value)
            : getToken(content, 'user'),
          textToken('had their invitation removed by'),
          getToken(content, 'removedBy'),
        ];
      }
      case 'Participant Created':
        return [
          getToken(content, 'user'),
          textToken('was added as a participant by'),
          getToken(content, 'createdBy'),
        ];
      case 'Participant Joined': {
        const user = getToken(content, 'user');
        const invitedBy = getToken(content, 'invitedBy', false);
        const invitationEmail = getToken(content, 'invitationEmail', false);
        const joinedAsAdmin = getToken(content, 'joinedAsAdmin', false);
        if (invitedBy) {
          return invitationEmail
            ? [
                user,
                textToken('joined the discussion after'),
                invitedBy,
                textToken(`sent an invitation to ${invitationEmail.value}`),
              ]
            : [
                user,
                textToken('joined the discussion after being invited by'),
                invitedBy,
              ];
        } else {
          return joinedAsAdmin
            ? [
                user,
                textToken(
                  'joined the discussion after being authorized as a space admin',
                ),
              ]
            : [
                user,
                textToken(
                  'joined the discussion after being authorized by the join policy',
                ),
              ];
        }
      }
      case 'Participant Left':
        return [getToken(content, 'user'), textToken('has left')];
      case 'Participant Removed':
        return [
          getToken(content, 'user'),
          textToken('has been kicked by'),
          getToken(content, 'removedBy'),
        ];
      case 'Message Updated':
        return [
          getToken(content, 'updatedBy'),
          textToken('changed a message from'),
          getToken(content, 'previousMessage'),
          textToken('to'),
          getToken(content, 'message'),
        ];
      case 'Discussion Updated':
        const previous = JSON.parse(getToken(content, 'previousValues').value);
        const current = JSON.parse(getToken(content, 'values').value);
        return [
          getToken(content, 'updatedBy'),
          textToken('updated the discussion'),
          ...Object.entries(previous).map(([name], i) =>
            // prettier-ignore
            textToken(`${i > 0 ? ', and ' : ''}${name} from [${previous[name]}] to [${current[name]}]`,),
          ),
        ];
    }
  } catch (e) {
    error = e;
  }
  console.error('Invalid system message', { action, content }, error);
  return [{ type: 'text', value: 'Invalid system message' }];
};
