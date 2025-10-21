import './App.css'
import { Button } from './Button';
import { format } from 'date-fns';
import { useState } from 'react';
import { View, Habits } from './constants';
import { Blocks } from './Blocks';

const today = new Date();

function App() {
  const [habit, setHabit] = useState(Habits.Css);
  const [view, setView] = useState(View.MONTH);

  return (
    <section className='flex items-center justify-center flex-col gap-4'>
      <h1
        onClick={() => {
          const habitKeys = Object.keys(Habits);
          const currentIndex = habitKeys.findIndex((key) => Habits[key] === habit);
          const nextIndex = (currentIndex + 1) % habitKeys.length;
          setHabit(Habits[habitKeys[nextIndex]]);
        }}
        className='text-5xl font-black font-mono'>
        {habit.icon} {habit.name}
      </h1>
      <div className='flex gap-2 w-full justify-center'>
        <Button
          active={view === View.YEAR}
          color={habit.color}
          onClick={() => setView(View.YEAR)}>
          {format(today, 'yyyy')}
        </Button>
        <Button
          active={view === View.MONTH}
          color={habit.color}
          onClick={() => setView(View.MONTH)}>
          {format(today, 'MMMM')}
        </Button>
        <Button
          active={view === View.WEEK}
          color={habit.color}
          onClick={() => setView(View.WEEK)}>
          Week {format(today, 'ww')}
        </Button>
      </div>
      <div className='h-80 flex items-center justify-center'>
        <Blocks view={view} date={today} color={habit.color} blockKey={habit.name} />
      </div>
    </section>
  )
}

export default App
