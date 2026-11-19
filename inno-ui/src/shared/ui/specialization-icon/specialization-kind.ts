export const SpecializationKind = {
  Cardiology: 'cardiology',
  Dermatology: 'dermatology',
  Pediatrics: 'pediatrics',
  FamilyMedicine: 'familyMedicine',
  Other: 'other',
} as const;

export type SpecializationKind =
  (typeof SpecializationKind)[keyof typeof SpecializationKind];

const specializationKeywords: Record<
  Exclude<SpecializationKind, typeof SpecializationKind.Other>,
  readonly string[]
> = {
  [SpecializationKind.Cardiology]: ['cardio', 'heart'],
  [SpecializationKind.Dermatology]: ['dermat', 'skin'],
  [SpecializationKind.Pediatrics]: ['pediatr', 'child'],
  [SpecializationKind.FamilyMedicine]: ['family', 'general'],
};

export function resolveSpecializationKind(title: string): SpecializationKind {
  const name = title.toLowerCase();
  const kinds = Object.keys(specializationKeywords) as Array<
    keyof typeof specializationKeywords
  >;
  const match = kinds.find((kind) =>
    specializationKeywords[kind].some((keyword) => name.includes(keyword)),
  );
  return match ?? SpecializationKind.Other;
}
