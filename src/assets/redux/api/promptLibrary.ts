/* eslint-disable @typescript-eslint/no-explicit-any */

import api from './api';

export const fetchPromptLibrary = async (): Promise<any> => {
    try {
        const response = await api.get('prompt-library/');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'An error occurred while fetching prompt library.');
    }
};