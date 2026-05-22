import { useState, useEffect } from 'react';

export interface HistoryItem {
    type: string;
    duration: number;
    gallons: number;
    cost: number;
    timestamp: Date;
}

interface WaterTrackerOptions {
    costPerGallon?: number;
    showerFlow?: number;
    sinkFlow?: number;
    toiletFlow?: number;
}

export const useWaterTracker = ({
    costPerGallon = 0.006,
    showerFlow    = 2.5,
    sinkFlow      = 2.2,
    toiletFlow    = 1.6,
}: WaterTrackerOptions = {}) => {
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
                gallons: toiletFlow,
                cost: toiletFlow * costPerGallon,
                timestamp: new Date()
            }, ...prev]);
            return;
        }

        const existingSession = getActiveSessionFor(type);

        if (existingSession) {
            const seconds  = getElapsedSeconds(type);
            const flowRate = type === 'shower' ? showerFlow : sinkFlow;
            const gallons  = (seconds / 60) * flowRate;
            const cost     = gallons * costPerGallon;

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
