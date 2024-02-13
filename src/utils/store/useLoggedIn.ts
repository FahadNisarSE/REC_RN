import {create} from 'zustand';

interface LoggeInState {
  loggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

export const useloggedInStore = create<LoggeInState>()(set => ({
  loggedIn: false,
  setLoggedIn: status => set(state => ({loggedIn: status})),
}));
