// SWR config for the app
import useSWR from 'swr';
import { authClient } from '@/lib/authClient';

export const fetcher = (url: string) => authClient.profile();
