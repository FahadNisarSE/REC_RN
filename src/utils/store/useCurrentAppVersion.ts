import {create} from 'zustand';

interface TCurrentAppVersion {}

export const useCurrentAppVersion = create<TCurrentAppVersion>()(set => ({}));
