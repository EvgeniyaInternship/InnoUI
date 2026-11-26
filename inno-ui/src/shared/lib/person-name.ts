type NamedPerson = {
  firstName: string;
  middleName?: string | null;
  lastName: string;
};

export function formatPersonName(person: NamedPerson): string {
  return [person.firstName, person.middleName ?? '', person.lastName]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
}
