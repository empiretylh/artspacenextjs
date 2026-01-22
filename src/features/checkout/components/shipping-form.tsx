import { Input } from "@/components/ui/input";
import { countryOptions } from "@/mocks";

const Select = ({ label, id, value, onChange, options }: any) => (
   <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
         {label}
      </label>
      <select
         id={id}
         value={value}
         onChange={onChange}
         className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
         {options.map((option: any, index: any) => (
            <option key={index} value={option.value}>
               {option.label}
            </option>
         ))}
      </select>
   </div>
);

export const ShippingForm = ({ formData, handleChange }: any) => (
   <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
         Shipping Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="md:col-span-2">
            <Input
               id="fullName"
               value={formData.fullName}
               onChange={handleChange}
            />
         </div>
         <div className="md:col-span-2">
            <Input
               id="address"
               value={formData.address}
               onChange={handleChange}
            />
         </div>
         <Input id="city" value={formData.city} onChange={handleChange} />
         <Input id="state" value={formData.state} onChange={handleChange} />
         <Input id="zip" value={formData.zip} onChange={handleChange} />
         <Select
            label="Country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            options={countryOptions}
         />
         <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
         />
         <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
         />
      </div>
   </div>
);
