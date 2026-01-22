import { useState } from "react";

export const useCheckoutForm = () => {
   const [formData, setFormData] = useState({
      fullName: "Jane Doe",
      address: "123 Art Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "US",
      phone: "",
      email: "jane.doe@example.com",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
   };

   return { formData, handleChange };
};
