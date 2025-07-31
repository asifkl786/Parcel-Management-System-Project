import { useField, useFormikContext } from 'formik';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect,useState } from 'react';

const DateRangePicker = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  // Initialize with Formik values or defaults
  const [state, setState] = useState([
    {
      startDate: field.value?.startDate || subDays(new Date(), 30),
      endDate: field.value?.endDate || new Date(),
      key: 'selection'
    }
  ]);

  // Sync with Formik values
  useEffect(() => {
    if (field.value) {
      setState([{
        startDate: new Date(field.value.startDate),
        endDate: new Date(field.value.endDate),
        key: 'selection'
      }]);
    }
  }, [field.value]);

  const handleChange = (item) => {
    setState([item.selection]);
    setFieldValue(name, {
      startDate: item.selection.startDate,
      endDate: item.selection.endDate
    });
  };

  return (
    <div className="relative">
      <div className={`flex items-center border rounded-lg shadow-sm p-2 bg-white ${
        meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
      }`}>
        <div className="mr-4">
          <span className="text-sm font-medium text-gray-700">From:</span>
          <div className="text-md font-semibold">
            {format(state[0].startDate, 'MMM dd, yyyy')}
          </div>
        </div>
        <div className="mr-4">
          <span className="text-sm font-medium text-gray-700">To:</span>
          <div className="text-md font-semibold">
            {format(state[0].endDate, 'MMM dd, yyyy')}
          </div>
        </div>
        <div className="absolute right-2 top-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="absolute z-10 mt-1 shadow-lg">
        <DateRange
          editableDateInputs={true}
          onChange={handleChange}
          moveRangeOnFirstSelection={false}
          ranges={state}
          rangeColors={['#3B82F6']}
          className="border rounded-lg"
        />
      </div>

      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      )}
    </div>
  );
};

export default DateRangePicker;