import { useState, useEffect } from 'react';

export interface HistoryItem {
    type: string;
    duration: number;
    gallons: number;
    cost: number;
    timestamp: Date;
}

export const useWaterTracker = () => {
    const [activeSessions, setActiveSessions] = useState<{ type: string, start: Date }[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getActiveSessionFor = (type: string) => {
        return activeSessions.find(session => session.type === type) || null;
    };

    const getElapsedSeconds = (type: string) => {
        const session = getActiveSessionFor(type);
        if (!session) return 0;
        const diff = Math.floor((currentTime.getTime() - session.start.getTime()) / 1000);
        return Math.max(0, diff);
    };

    const toggleTimer = (type: string) => {
        if (type === 'toilet') {
            setHistory(prev => [{
                type: 'toilet',
                duration: 0,
                gallons: 1.6,
                cost: 0.05,
                timestamp: new Date()
            }, ...prev]);
            return;
        }

        const existingSession = getActiveSessionFor(type);

        if (existingSession) {
            // FIX: Defining flowRate here so the code knows what it is
            const seconds = getElapsedSeconds(type);
            const flowRate = type === 'shower' ? 2.1 : 1.5;
            const gallons = (seconds / 60) * flowRate;
            const cost = gallons * 0.03;

            setHistory(prev => [{
                type,
                duration: seconds,
                gallons,
                cost,
                timestamp: new Date()
            }, ...prev]);

            setActiveSessions(prev => prev.filter(s => s.type !== type));
        } else {
            setActiveSessions(prev => [...prev, { type, start: new Date() }]);
        }
    };

    return { toggleTimer, getActiveSessionFor, getElapsedSeconds, history };
};