export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const db: Contact[] = [];

export function create(
  contact: Pick<Contact, "firstName" | "lastName" | "email">,
) {
  return db.push({ ...contact, id: Math.random().toString() });
}

export function list() {
  return db;
}

export function getById(id: string) {
  return db.find((contact) => contact.id === id);
}

export function deleteById(id: string) {
  db.splice(
    db.findIndex((contact) => contact.id === id),
    1,
  );
}
