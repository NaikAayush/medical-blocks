export interface Credential {
  credentialId: any;
  publicKey: any;
}

export interface User {
  id?: string;
  uid?: string;
  phone?: string;
  name?: string;
  email?: string;
  credentials?: any;
}
