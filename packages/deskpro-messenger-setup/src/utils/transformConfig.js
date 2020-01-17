export default (settings) => {
  const screens = {
    index: {
      screenType: 'Blocks',
      blocks: []
    }
  };

  if (settings.getIn(['chat', 'enabled'])) {
    const chatBlockConfig = settings.getIn(['messenger', 'chat']);
    screens.index.blocks.push({
      blockType: 'StartChatBlock',
      title: chatBlockConfig.get('title', 'Conversation'),
      description: chatBlockConfig.get('description'),
      linkText: chatBlockConfig.get('buttonText', 'Start a chat'),
      showAgentPhotos: chatBlockConfig.get('showAgentPhotos'),
      to: 'startChat'
    });
    screens.startChat = settings.get('chat').toJS();
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

  if (settings.getIn(['tickets', 'enabled'])) {
    const ticketBlockConfig = settings.getIn(['messenger', 'tickets']);
    screens.index.blocks.push({
      blockType: 'ScreenLink',
      blockTitle: ticketBlockConfig.get('title'),
      description: ticketBlockConfig.get('description'),
      label: ticketBlockConfig.get('buttonText'),
      to: 'newTicket'
    });
    screens.newTicket = settings.get('tickets').toJS();
    delete screens.newTicket.enabled;
  }

  const enabledGreetings = [null];
  if ('object' === typeof screens.startChat) {
    enabledGreetings.push('/screens/startChat');
  }
  const config = {
    screens,
    themeVars: {
      '--color-primary': settings.getIn(['styles', 'primaryColor'], '#3d88f3'),
      '--color-background': settings.getIn(['styles', 'backgroundColor'], '#3d88f3'),
      '--brand-primary': settings.getIn(['styles', 'primaryColor'], '#3d88f3'),
      '--brand-secondary': settings.getIn(['styles', 'backgroundColor'], '#a9b0b0'),
      '--text-color': settings.getIn(['styles', 'textColor'], '#ffffff'),

    },
    greetings: {},
    enabledGreetings
  };

  return config;
};
