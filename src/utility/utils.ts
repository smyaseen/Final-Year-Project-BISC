import { hash, compare } from 'bcryptjs';
import { FieldProp } from '../components/auth/AuthForm/AuthTypes';
import { Product } from '../components/manufacturer/_data_';

export const encryptPassword = async (password: string): Promise<string> =>
  hash(password, 12);

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isPasswordValid = await compare(password, hashedPassword);
  return isPasswordValid;
};

export const setFieldsDisabled = (
  disabled: boolean,
  fields: Array<FieldProp>
): Array<FieldProp> => fields.map((field) => ({ ...field, disabled }));

export const fetchProducts = async (
  manufacturer: string
): Promise<Product[]> => {
  try {
    const data = await fetch(`/api/products?manufacturer=${manufacturer}`);
    const res: Product[] = await data.json();

    return res;
  } catch (error) {
    return [];
  }
};

export const fetchUsers = async (role: string): Promise<string[]> => {
  try {
    const data = await fetch(`/api/users?role=${role}`);
    const res: string[] = await data.json();

    return res;
  } catch (error) {
    return [];
  }
};

export const fetchBatchIdsForDistributor = async (
  role: string
): Promise<string[]> => {
  try {
    const data = await fetch(`/api/batchId?distributor=${role}`);
    const res: string[] = await data.json();

    return res;
  } catch (error) {
    return [];
  }
};

export const fetchBatchIdsForPharmacy = async (
  role: string
): Promise<string[]> => {
  try {
    const data = await fetch(`/api/batchId?pharmacy=${role}`);
    const res: string[] = await data.json();

    return res;
  } catch (error) {
    return [];
  }
};
