import { useMemo, useState, useEffect } from "react"
import { View } from "./constants";
import { getDaysInMonth, addDays, startOfMonth, startOfWeek, getDay, format } from "date-fns";
import { Block } from "./Block";
import classNames from "classnames";

const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getFromStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export const Blocks = ({ blockKey, view, date, color }) => {
    const [selectedDates, setSelectedDates] = useState(new Map());

    // Create a unique storage key based on blockKey
    const storageKey = useMemo(() => `blocks-${blockKey}`, [blockKey]);

    // Load saved data on mount
    useEffect(() => {
        const savedData = getFromStorage(storageKey);
        if (savedData && Array.isArray(savedData)) {
            const loadedMap = new Map();
            savedData.forEach(timestamp => {
                loadedMap.set(timestamp, new Date(timestamp));
            });
            setSelectedDates(loadedMap);
        } else {
            setSelectedDates(new Map());
        }
    }, [storageKey]);

    const blocksData = useMemo(() => {
        if (view === View.YEAR) {
            // Create an array of months, each with its own days
            const year = date.getFullYear();
            return Array.from({ length: 12 }, (_, monthIndex) => {
                const monthDate = new Date(year, monthIndex, 1);
                const daysInMonth = getDaysInMonth(monthDate);
                const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
                    const cellDate = addDays(monthDate, dayIndex);
                    return { label: dayIndex + 1, date: cellDate };
                });
                return {
                    monthName: format(monthDate, 'MMM'),
                    days
                };
            });
        }
        if (view === View.MONTH) {
            const start = startOfMonth(date);
            const firstDayOfWeek = getDay(start); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const daysInMonth = getDaysInMonth(date);

            // Create empty cells for days before the first day of the month
            const emptyCells = Array.from({ length: firstDayOfWeek }, () => ({
                label: null,
                date: null,
                isEmpty: true
            }));

            // Create cells for actual days
            const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
                const cellDate = addDays(start, index);
                return { label: index + 1, date: cellDate, isEmpty: false };
            });

            return [...emptyCells, ...dayCells];
        }
        // For week view
        const start = startOfWeek(date);
        return Array.from({ length: 7 }, (_, index) => {
            const cellDate = addDays(start, index);
            return { label: index + 1, date: cellDate, isEmpty: false };
        });
    }, [view, date]);

    const handleBlockClick = (block) => {
        if (block.isEmpty) return;

        const newMap = new Map(selectedDates);
        const timestamp = block.date.getTime();
        if (newMap.has(timestamp)) {
            newMap.delete(timestamp);
        } else {
            newMap.set(timestamp, block.date);
        }

        setSelectedDates(newMap);

        if (newMap.size > 0) {
            const timestamps = Array.from(newMap.keys());
            saveToStorage(storageKey, timestamps);
        } else {
            // Clear storage if no dates are selected
            localStorage.removeItem(storageKey);
        }
    };

    if (view === View.YEAR) {
        return (
            <div className="w-full max-w-4xl flex flex-row text-center justify-center 
            gap-2 mx-auto px-4 overflow-x-auto">
                {blocksData.map((month, monthIndex) => (
                    <div key={monthIndex} className="flex flex-col gap-2 items-center">
                        <span className="text-xs font-mono">{month.monthName.slice(0, 1)}</span>
                        <div className="flex flex-col gap-2">
                            {month.days.map((block) => (
                                <Block
                                    color={color}
                                    key={`${monthIndex}-${block.label}`}
                                    isSelected={selectedDates.has(block.date.getTime())}
                                    onClick={() => handleBlockClick(block)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-[90vw] max-w-4xl flex flex-col items-center overflow-x-auto space-y-2 mx-auto">
            <div className={classNames('w-fit grid gap-2 mx-auto grid-cols-7')}>
                {blocksData.map((block, index) => (
                    <Block
                        color={color}
                        key={index}
                        isSelected={block.date && selectedDates.has(block.date.getTime())}
                        onClick={() => handleBlockClick(block)}
                        isEmpty={block.isEmpty}
                    />
                ))}
            </div>
        </div>
    )
}