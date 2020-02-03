export default (settings) => {
  const screens = {
    index: {
      screenType: 'Blocks',
      blocks: []
    }
  };

  screens.index.blocks.push({
    blockType: 'QuickSearchBlock',
    blockTitle: "Quick search",
    to: 'quick-search',
    order: 0
  });

  if (settings.chat.enabled) {
    const chatBlockConfig = settings.messenger.chat;
    const startChatBlock = {
      blockType: 'StartChatBlock',
      title: chatBlockConfig.title || 'Conversation',
      description: chatBlockConfig.description,
      linkText: chatBlockConfig.buttonText || 'Start a chat',
      inputPlaceholder: chatBlockConfig.inputPlaceholder || 'Type your message here',
      showAgentPhotos: chatBlockConfig.showAgentPhotos,
      to: 'startChat',
      order: 10
    };
    screens.proactive = settings.messenger.proactive;
    screens.index.blocks.push(startChatBlock);
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
              placeholder: 'John Doe',
              data: {
                'title': 'Name',
              }
            },
            {
              field_id: 'email',
              field_type: 'email',
              required: true,
              placeholder: 'john.doe@company.com',
              data: {
                'title': 'Email',
              }
            }
          ]
        }
      ];
    }
  }

  if (settings.tickets.enabled) {
    const ticketBlockConfig = settings.messenger.tickets;
    screens.index.blocks.push({
      blockType: 'ButtonLink',
      blockTitle: ticketBlockConfig.title,
      description: ticketBlockConfig.description,
      label: ticketBlockConfig.buttonText,
      to: 'newTicket',
      order: 20
    });
    screens.newTicket = settings.tickets;
    screens.newTicket.screenType = 'TicketFormScreen';
    delete screens.newTicket.enabled;
  }

  return {
    autoStart: settings.messenger.autoStart,
    autoStartTimeout: settings.messenger.autoStartTimeout,
    autoStartStyle: settings.messenger.autoStartStyle,
    maxFileSize: settings.messenger.maxFileSize,
    screens,
    themeVars: {
      'position': settings.styles.position || 'right',
      '--color-primary': settings.styles.primaryColor || '#3d88f3',
      '--brand-primary': settings.styles.primaryColor || '#3d88f3',
      '--header-icon-text-color': settings.styles.textColor || '#ffffff',
      '--brand-secondary': settings.styles.backgroundColor || '#f7f7f7',
      '--color-secondary': settings.styles.backgroundColor || '#f7f7f7'
    },
    greetings: {},
  };
};
