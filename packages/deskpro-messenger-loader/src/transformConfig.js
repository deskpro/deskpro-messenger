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
          department: 0,
          fields: [
            {
              field_id: 'name',
              field_type: 'text',
              required: true,
              placeholder: 'John Doe'
            },
            {
              field_id: 'email',
              field_type: 'email',
              required: true,
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

  screens.index.blocks.push({
    blockType: 'QuickSearchBlock',
    blockTitle: "Quick search",
    to: 'quick-search'
  });

  const enabledGreetings = [null];
  if ('object' === typeof screens.startChat) {
    enabledGreetings.push('/screens/startChat');
  }
  return {
    autoStart: settings.messenger.autoStart,
    autoStartTimeout: settings.messenger.autoStartTimeout,
    maxFileSize: settings.messenger.maxFileSize,
    screens,
    themeVars: {
      '--color-primary': settings.styles.primaryColor || '#3d88f3',
      '--brand-primary': settings.styles.primaryColor || '#3d88f3',
      '--brand-secondary': settings.styles.backgroundColor || '#a9b0b0',
      '--color-background': settings.styles.backgroundColor || '#a9b0b0'
    },
    greetings: {},
    enabledGreetings
  };
};
