export interface CustomerCheckoutDetails {
  id: number;
  label?: string;
  name: string;
  phone_number: string;
  shipping_address: string;
  city: string;
  description?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerCheckoutDetailsInput {
  label?: string;
  name: string;
  phone_number: string;
  shipping_address: string;
  city: string;
  description?: string;
  is_default?: boolean;
}

export type UpdateCustomerCheckoutDetailsInput = Partial<CreateCustomerCheckoutDetailsInput>;
