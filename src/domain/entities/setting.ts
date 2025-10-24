// types/contact.ts
export interface CreateServiceInput {
  title?: string;
  content?: string;
}

export interface CreateContactWithServicesInput {
  // About
  aboutTitle?: string;
  aboutContent?: string;
  subContent?: string;

  // Contact
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink: string; // Requis

  // Services
  services?: CreateServiceInput[];
}

export interface Service {
  id: string;
  title?: string;
  content?: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  aboutTitle?: string;
  aboutContent?: string;
  subContent?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink: string;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}