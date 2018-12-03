import chatReducer, {
  saveChat,
  initChats,
  messageReceived,
  messageSent
} from '../chat';

describe('Loading existing chats', () => {
  const chats = [
    { id: '1bc123', status: 'ended' },
    { id: '2134a8', status: 'open' },
    { id: '213d35', status: 'ended' }
  ];
  const nextState = chatReducer(undefined, initChats(chats));
  it('should save all chats in the store', () => {
    expect(nextState.chats).toBeObject();
    expect(Object.keys(chats)).toBeArrayOfSize(3);
  });
  it('should set active chat', () => {
    expect(nextState.activeChat).toBe('2134a8');
  });
});

describe('Saving new chat', () => {
  const newChat = { id: 'chat-123', status: 'opened' };
  const nextState = chatReducer(undefined, saveChat(newChat));
  it('should update active chat when new chat is created', () => {
    expect(nextState.activeChat).toBe(newChat.id);
  });
  it('should create new chat object in the store with chat data', () => {
    expect(nextState.chats).toHaveProperty(newChat.id);
    expect(nextState.chats[newChat.id]).toBeObject();
    expect(nextState.chats[newChat.id].data).toEqual(newChat);
  });
});

describe('Handling sent/received messages', () => {
  const initialState = {
    chats: { 21: { data: { id: 21, status: 'opened' }, messages: [] } },
    activeChat: 21
  };
  it('should update typing status', () => {
    let nextState = chatReducer(
      initialState,
      messageReceived({
        chat: 21,
        origin: 'agent',
        type: 'chat.typing.start'
      })
    );
    expect(nextState.chats[21].typing).toBeObject();

    nextState = chatReducer(
      nextState,
      messageReceived({
        chat: 21,
        origin: 'agent',
        type: 'chat.typing.end'
      })
    );
    expect(nextState.chats[21].typing).toBeFalsy();

    nextState = chatReducer(
      nextState,
      messageReceived({
        chat: 21,
        origin: 'agent',
        type: 'chat.typing.start'
      })
    );
    expect(nextState.chats[21].typing).toBeObject();
    nextState = chatReducer(
      nextState,
      messageReceived({
        chat: 21,
        origin: 'agent',
        type: 'chat.message',
        message: 'Hello World'
      })
    );
    expect(nextState.chats[21].typing).toBeFalsy();
  });

  it('should store sent message in the chat', () => {
    expect(initialState.chats[21].messages).toBeArrayOfSize(0);

    const message = {
      chat: 21,
      type: 'chat.message',
      message: 'Hello World',
      origin: 'user'
    };
    const nextState = chatReducer(initialState, messageSent(message));

    expect(nextState.chats[21].messages).toBeArrayOfSize(1);
  });

  it('should store incoming message in the chat', () => {
    expect(initialState.chats[21].messages).toBeArrayOfSize(0);

    const message = {
      id: '2123',
      chat: 21,
      message: 'Hello World',
      origin: 'agent',
      type: 'chat.message'
    };
    const nextState = chatReducer(initialState, messageReceived(message));

    expect(nextState.chats[21].messages).toBeArrayOfSize(1);
  });

  it("should update user's message with the same uuid", () => {
    expect(initialState.chats[21].messages).toBeArrayOfSize(0);

    let nextState = chatReducer(
      initialState,
      messageSent({
        chat: 21,
        type: 'chat.message',
        message: 'Hello World',
        origin: 'user',
        uuid: '12345'
      })
    );

    expect(nextState.chats[21].messages).toBeArrayOfSize(1);
    expect(nextState.chats[21].messages[0].date_created).toBeUndefined();

    nextState = chatReducer(
      nextState,
      messageReceived({
        chat: 21,
        type: 'chat.message',
        message: 'Hello World',
        origin: 'user',
        uuid: '12345',
        date_created: '2018-11-25'
      })
    );

    expect(nextState.chats[21].messages).toBeArrayOfSize(1);
    expect(nextState.chats[21].messages[0].date_created).toBe('2018-11-25');
  });

  it('should set an agent info when new agent is assigned', () => {
    const nextState = chatReducer(
      initialState,
      messageReceived({
        chat: 21,
        type: 'chat.agentAssigned',
        name: 'John Doe',
        avatar: 'http://deskpro.com/avatar.png'
      })
    );
    expect(nextState.chats[21].messages).toBeArrayOfSize(1);
    expect(nextState.chats[21].agent).toBeObject();
    expect(Object.keys(nextState.chats[21].agent)).toEqual(['name', 'avatar']);
  });

  it('should update status and activeChat when chat ends', () => {
    expect(initialState.chats[21].messages).toBeArrayOfSize(0);
    expect(initialState.activeChat).toBe(21);
    expect(initialState.chats[21].data.status).toBe('opened');

    const newState = chatReducer(
      initialState,
      messageReceived({
        chat: 21,
        type: 'chat.ended',
        origin: 'system'
      })
    );

    expect(newState.chats[21].messages).toBeArrayOfSize(1);
    expect(newState.chats[21].data.status).toBe('ended');
    expect(newState.chats[21].activeChat).toBeFalsy();
  });
});
