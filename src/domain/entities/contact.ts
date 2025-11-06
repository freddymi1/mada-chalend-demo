// Interface pour formulaire circuit
export interface CircuitFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  nbPersonnes: string;
  dateDepart: string;
  circuitDemande: string;
  budget: string;
  duree: string;
  message: string;
  otherCircuit?: string;
}

// Interface pour formulaire partenariat
export interface PartenariatFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nomEntreprise: string;
  objet: string;
  typePartenariat: string;
  description: string;
  message: string;
}

// Interface pour formulaire autre
export interface AutreFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  objet: string;
  typeService: string;
  message: string;
}
