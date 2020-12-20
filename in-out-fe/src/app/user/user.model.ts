export interface User {
  uid: string;
  signUpState: boolean;
  phone?: number;
  displayName?: string;
  email?: string;
  photoURL?: string;
}
