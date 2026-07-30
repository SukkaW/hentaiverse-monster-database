import { useCallback } from 'react';
import { useTrainerState } from './search-by-trainer-state';

export function FilterByTrainerForm() {
  const [trainerName, setTrainerName] = useTrainerState();

  const handleSubmit = useCallback<React.SubmitEventHandler<HTMLFormElement>>((event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trainerName = formData.get('trainer');
    setTrainerName(typeof trainerName === 'string' ? trainerName : '');
  }, [setTrainerName]);

  const handleReset = () => {
    setTrainerName('');
  };

  return (
    <form className="max-w-md absolute right-0 top-6 z-10" action="/" method="get" onSubmit={handleSubmit} onReset={handleReset}>
      <input key={trainerName} className="appearance-none border border-gray-300 rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="search" name="trainer" placeholder="Search by Trainer" defaultValue={trainerName} />
      <button className="ml-3 bg-[#5C0D12] text-[#E3E0D1] py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="submit">
        Search
      </button>
      <button className="ml-3 bg-[#E3E0D1] text-[#5C0D12] py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="reset">
        Reset
      </button>
    </form>
  );
}
