import guestReducer, { setVisitor } from '../guest';

describe('Guest user reducer', () => {
  it('should put the visitor data into store', () => {
    const visitor = {
      visitor_id: '123ab45de6',
      guest: { name: 'John Doe', email: 'john.doe' }
    };
    const newState = guestReducer(undefined, setVisitor(visitor));
    expect(newState.visitorId).toBe(visitor.visitor_id);
    expect(newState.name).toEqual(visitor.guest.name);
    expect(newState.email).toEqual(visitor.guest.email);
  });

  it("shouldn't change visitor data if it's not passed", () => {
    const visitor = {
      visitor_id: '123ab45de6',
      guest: { name: null, email: null }
    };
    let newState = guestReducer(undefined, setVisitor(visitor));
    expect(newState.visitorId).toBe(visitor.visitor_id);
    expect(newState.name).toBe('');
    expect(newState.email).toBe('');

    const guest = { name: 'John Doe', email: 'john.doe' };
    newState = guestReducer(newState, setVisitor({ guest }));
    expect(newState.visitorId).toBe(visitor.visitor_id);
    expect(newState.name).toEqual(guest.name);
    expect(newState.email).toEqual(guest.email);
  });
});
