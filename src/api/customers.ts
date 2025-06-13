import { fetchWithAuth } from '../utils/fetchWithAuth';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  // 可擴充: tags, address, ...
}

export async function fetchCustomers() {
  const res = await fetchWithAuth('http://localhost:5000/customers', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

export async function createCustomer(data: Omit<Customer, 'id'>) {
  const res = await fetchWithAuth('http://localhost:5000/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  const res = await fetchWithAuth(`http://localhost:5000/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteCustomer(id: string) {
  const res = await fetchWithAuth(`http://localhost:5000/customers/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}
