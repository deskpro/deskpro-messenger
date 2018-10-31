export const generateVisitorId = () => {
  let id = `${Math.floor(new Date().getTime() / 1000 / 60)}-`;

  const chars1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const chars2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < 8; i += 1) {
    id += chars1.charAt(Math.floor(Math.random() * chars1.length));
  }
  id += '-';
  for (let i = 0; i < 8; i += 1) {
    id += chars1.charAt(Math.floor(Math.random() * chars1.length));
  }
  id += '-';
  for (let i = 0; i < 6; i += 1) {
    id += chars1.charAt(Math.floor(Math.random() * chars1.length));
  }
  id += '-';
  for (let i = 0; i < 3; i += 1) {
    id += chars2.charAt(Math.floor(Math.random() * chars2.length));
  }

  return id;
};
