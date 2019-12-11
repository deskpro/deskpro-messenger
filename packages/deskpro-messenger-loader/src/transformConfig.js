export default (settings) => {
  const screens = {
    index: {
      screenType: 'Blocks',
      blocks: []
    }
  };

  if (settings.chat.enabled) {
    const chatBlockConfig = settings.messenger.chat;
    screens.index.blocks.push({
      blockType: 'StartChatBlock',
      title: chatBlockConfig.title || 'Conversation',
      description: chatBlockConfig.description,
      linkText: chatBlockConfig.buttonText || 'Start a chat',
      showAgentPhotos: chatBlockConfig.showAgentPhotos,
      to: 'startChat'
    });
    screens.startChat = settings.chat;
    screens.startChat.screenType = 'StartChatScreen';
    delete screens.startChat.enabled;
    if (screens.startChat.noAnswerBehavior === 'save_ticket') {
      screens.startChat.ticketFormConfig = [
        {
          fields: [
            {
              name: 'name',
              label: 'Full Name',
              type: 'text',
              validation: ['required'],
              placeholder: 'John Doe'
            },
            {
              name: 'email',
              label: 'Email',
              type: 'text',
              validation: ['required'],
              placeholder: 'john.doe@company.com'
            }
          ]
        }
      ];
    }
  }

  if (settings.tickets.enabled) {
    const ticketBlockConfig = settings.messenger.tickets;
    screens.index.blocks.push({
      blockType: 'ScreenLink',
      blockTitle: ticketBlockConfig.title,
      description: ticketBlockConfig.description,
      label: ticketBlockConfig.buttonText,
      to: 'newTicket'
    });
    screens.newTicket = settings.tickets;
    screens.newTicket.screenType = 'TicketFormScreen';
    delete screens.newTicket.enabled;
  }

  const enabledGreetings = [null];
  if ('object' === typeof screens.startChat) {
    enabledGreetings.push('/screens/startChat');
  }
  return {
    autoStart: settings.messenger.autoStart,
    autoStartTimeout: settings.messenger.autoStartTimeout,
    screens,
    themeVars: {
      '--color-primary': settings.styles.primaryColor || '#3d88f3',
      '--brand-primary': settings.styles.primaryColor || '#3d88f3',
      '--color-background': settings.styles.backgroundColor || '#3d88f3'
    },
    greetings: {},
    enabledGreetings
  };
};
