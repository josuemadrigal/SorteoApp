import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import RegistrosService from '../services/RegistrosService';

interface Option {
  value: string;
  label: string;
}




const options: Option[] = [
  { value: 'option1', label: 'Opción 1' },
  { value: 'option2', label: 'Opción 2' },
  { value: 'option3', label: 'Opción 3' },
];

const SelectWithSearch: React.FC = () => {

    const [responsableData, setResponsableData] = useState<any[]>([]);

    const respon =async () => {
      const responsables = await RegistrosService.getResponsables();
      console.log(responsables.data);
      return setResponsableData(responsables.data);
      
    }

    respon();
    

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleOptionChange = (option: Option | null) => {
    setSelectedOption(option);
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={(event, newValue) => handleOptionChange(newValue)}
      options={responsableData}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField {...params} label="Responsable" color='success' variant="filled" />
      )}
    />
  );
};

export default SelectWithSearch;