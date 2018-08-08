const POLLING_INTERVAL = 2000;

const apiCall = async (url, method, data) => {
  const options = {
    cors: true,
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: data ? JSON.stringify(data) : undefined
  };
  const response = await fetch(url, options);
  return response.json();
};

const sleep = time =>
  new Promise(res => {
    setTimeout(res, time);
  });

class PollingChatService {
  setUp(data) {
    return apiCall('/api/chat', 'POST', data);
  }

  polling = false;

  async subscribe(callback) {
    if (this.polling) {
      return;
    }

    this.polling = true;

    while (true) {
      const response = await apiCall('/api/chat');
      if (response) {
        callback(data);
      }
      if (!this.polling) {
        break;
      }
    }
  }

  async ubsubscribe() {
    this.polling = false;
  }

  send(data) {
    return apiCall('/api/chat', 'PUT', data);
  }
}
