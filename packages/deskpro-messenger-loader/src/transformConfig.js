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
    const chatBlockConfig = settings.chat;
    const startChatBlock = {
      blockType:       'StartChatBlock',
      title:           chatBlockConfig.options.title,
      description:     chatBlockConfig.options.description,
      linkText:        chatBlockConfig.options.buttonText,
      showAgentPhotos: chatBlockConfig.options.showAgentPhotos,
      to:              'startChat',
      order:           10
    };
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
    const ticketBlockConfig = settings.tickets.options;
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
    widget: settings.widget,
    proactive: {
      options: settings.proactive.options,
      autoStart: settings.proactive.autoStart,
      autoStartTimeout: settings.proactive.autoStartTimeout,
      autoStartStyle: settings.proactive.autoStartStyle,
    },
    maxFileSize: settings.maxFileSize,
    screens,
    themeVars: {
      'position': settings.widget.position || 'right',
      '--color-primary': settings.widget.primaryColor || '#3d88f3',
      '--brand-primary': settings.widget.primaryColor || '#3d88f3',
      '--header-icon-text-color': settings.widget.textColor || '#ffffff',
      '--brand-secondary': settings.widget.backgroundColor || '#f7f7f7',
      '--color-secondary': settings.widget.backgroundColor || '#f7f7f7'
    }
  };
};
