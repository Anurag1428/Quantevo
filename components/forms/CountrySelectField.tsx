// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useMemo, useState } from 'react';
// import { Control, Controller, FieldError } from 'react-hook-form';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import countryList from 'react-select-country-list';
// import ReactCountryFlag from 'react-country-flag';

// type CountryOption = {
//   label: string;
//   value: string; // ISO alpha-2 code, e.g. "HR", "IN"
// };

// type CountrySelectInnerProps = {
//   value?: string | null;
//   onChange: (value: string | null) => void;
// };

// type CountrySelectFieldProps = {
//   name: string;
//   label: string;
//   control: Control<any>;
//   error?: FieldError;
//   required?: boolean;
// };

// const CountrySelect: React.FC<CountrySelectInnerProps> = ({ value, onChange }) => {
//   const [open, setOpen] = useState(false);

//   // getData() returns CountryOption[]; use try/catch if package not present
//   const countries: CountryOption[] = useMemo(() => {
//     try {
//       return ((countryList as any)().getData() as CountryOption[]) ?? [];
//     } catch {
//       return [];
//     }
//   }, []);

//   const renderFlag = (code?: string | null) => {
//     if (!code) return null;
//     const codeUpper = code.toUpperCase();
//     return (
//       <ReactCountryFlag
//         countryCode={codeUpper}
//         svg
//         style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}
//         aria-label={codeUpper}
//       />
//     );
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="country-select-trigger flex justify-between w-full"
//         >
//           {value ? (
//             <span className="flex items-center gap-2">
//               {renderFlag(value)}
//               <span>{countries.find((c) => c.value === value)?.label ?? value}</span>
//             </span>
//           ) : (
//             'Select your country...'
//           )}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent
//         className="w-full p-0 bg-gray-800 border-gray-600"
//         align="start"
//       >
//         <Command className="bg-gray-800 border-gray-600">
//           <CommandInput placeholder="Search countries..." className="country-select-input" />
//           <CommandEmpty>No country found.</CommandEmpty>

//           <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
//             <CommandGroup>
//               {countries.map((country: CountryOption) => (
//                 <CommandItem
//                   key={country.value}
//                   // Use a readable value for Command's internal search; we'll resolve it onSelect
//                   value={`${country.label} ${country.value}`}
//                   onSelect={(val?: string) => {
//                     // `val` comes from the Command system (the value we set above).
//                     // Find the country that matches either label+code or code alone
//                     const selected =
//                       countries.find((c) => `${c.label} ${c.value}` === val) ??
//                       countries.find((c) => c.value === (val ?? '').trim().toUpperCase());
//                     if (selected) {
//                       onChange(selected.value);
//                       setOpen(false);
//                     }
//                   }}
//                   className="country-select-item"
//                 >
//                   <Check
//                     className={cn(
//                       'mr-2 h-4 w-4 text-yellow-500',
//                       value === country.value ? 'opacity-100' : 'opacity-0'
//                     )}
//                   />
//                   <span className="flex items-center gap-2">
//                     {renderFlag(country.value)}
//                     <span>{country.label}</span>
//                   </span>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export const CountrySelectField: React.FC<CountrySelectFieldProps> = ({
//   name,
//   label,
//   control,
//   error,
//   required = false,
// }) => {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor={name} className="form-label">
//         {label}
//       </Label>

//       <Controller
//         name={name}
//         control={control}
//         rules={{
//           required: required ? `Please select ${label.toLowerCase()}` : false,
//         }}
//         render={({ field }) => (
//           // field.value might be undefined; pass null for clarity
//           <CountrySelect value={field.value ?? null} onChange={(v) => field.onChange(v)} />
//         )}
//       />

//       {error && <p className="text-sm text-red-500">{error.message}</p>}
//       <p className="text-xs text-gray-500">Helps us show market data and news relevant to you.</p>
//     </div>
//   );
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import countryList from 'react-select-country-list';
import ReactCountryFlag from 'react-country-flag';

type CountryOption = {
  label: string;
  value: string; // ISO alpha-2 code, e.g. "HR", "IN"
};

type CountrySelectInnerProps = {
  value?: string | null;
  onChange: (value: string | null) => void;
};

type CountrySelectFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError;
  required?: boolean;
};

const CountrySelect: React.FC<CountrySelectInnerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // If there's already a value and user interacted, keep showing flag
    if (value && hasInteracted) {
      setHasInteracted(true);
    }
  }, [value, hasInteracted]);

  // getData() returns CountryOption[]; use try/catch if package not present
  const countries: CountryOption[] = useMemo(() => {
    try {
      return ((countryList as any)().getData() as CountryOption[]) ?? [];
    } catch {
      return [];
    }
  }, []);

  const renderFlag = (code?: string | null, showInitialsIfNotInteracted = false) => {
    if (!code) return null;
    
    const codeUpper = code.toUpperCase();
    
    // Show initials only if user hasn't interacted yet and we're in the trigger button
    if (showInitialsIfNotInteracted && !hasInteracted) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-4 text-xs font-semibold bg-gray-700 text-gray-300 rounded border border-gray-600">
          {codeUpper}
        </span>
      );
    }
    
    // Show flag after interaction or in the dropdown list
    return (
      <ReactCountryFlag
        countryCode={codeUpper}
        svg
        style={{ 
          width: '1.25em', 
          height: '1em',
          objectFit: 'contain'
        }}
        aria-label={codeUpper}
      />
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger flex justify-between w-full"
        >
          {value ? (
            <span className="flex items-center gap-2">
              {renderFlag(value, true)}
              <span>{countries.find((c) => c.value === value)?.label ?? value}</span>
            </span>
          ) : (
            'Select your country...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-600"
        align="start"
      >
        <Command className="bg-gray-800 border-gray-600">
          <CommandInput placeholder="Search countries..." className="country-select-input" />
          <CommandEmpty>No country found.</CommandEmpty>

          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup>
              {countries.map((country: CountryOption) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={(val?: string) => {
                    const selected =
                      countries.find((c) => `${c.label} ${c.value}` === val) ??
                      countries.find((c) => c.value === (val ?? '').trim().toUpperCase());
                    if (selected) {
                      setHasInteracted(true); // Mark as interacted when user selects
                      onChange(selected.value);
                      setOpen(false);
                    }
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-yellow-500',
                      value === country.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2">
                    {renderFlag(country.value, false)}
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CountrySelectField: React.FC<CountrySelectFieldProps> = ({
  name,
  label,
  control,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value ?? null} onChange={(v) => field.onChange(v)} />
        )}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
      <p className="text-xs text-gray-500">Helps us show market data and news relevant to you.</p>
    </div>
  );
};