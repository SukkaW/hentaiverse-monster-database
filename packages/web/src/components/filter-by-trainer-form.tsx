import { useAtom } from 'jotai';
import { useState } from 'react';
import { searchByTrainerAtom } from '../state';

export function FilterByTrainerForm() {
  const [trainerName, setTrainerName] = useAtom(searchByTrainerAtom);
  const [trainerInputValue, setTrainerInputValue] = useState(trainerName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrainerInputValue(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTrainerName(trainerInputValue);
    if (trainerInputValue !== '') {
      window.history.pushState(null, '', `?trainer=${trainerInputValue}`);
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  const handleReset = () => {
    setTrainerName('');
    setTrainerInputValue('');
    window.history.pushState(null, '', '/');
  };

  return (
    <form className="max-w-sm absolute right-0 top-6 z-10" action="/" method="get" onSubmit={handleSubmit} onReset={handleReset}>
      <input className="appearance-none border border-gray-300 rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="search" name="trainer" placeholder="Search by Trainer" value={trainerInputValue} onChange={handleChange} />
      <button className="ml-3 bg-[#5C0D12] text-[#E3E0D1] py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="button">
        Search
      </button>
      <button className="ml-3 bg-[#E3E0D1] text-[#5C0D12] py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="reset">
        Reset
      </button>
    </form>
  );
}
