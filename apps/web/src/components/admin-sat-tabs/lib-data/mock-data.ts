import type {
  TestType,
  Subject,
  Difficulty,
  Domain,
  Skill,
  QtyType,
} from "./types";

export const mockTestTypes: TestType[] = [
  {
    id: "1",
    name: "SAT",
    description: "Scholastic Assessment Test",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "PSAT",
    description: "Preliminary SAT",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "AP",
    description: "Advanced Placement",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "ACT",
    description: "American College Testing",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    description: "Math and quantitative reasoning",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Reading",
    description: "Reading comprehension",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Writing",
    description: "Writing and language",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Science",
    description: "Scientific reasoning",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockDifficulties: Difficulty[] = [
  {
    id: "1",
    name: "Easy",
    description: "Beginner level",
    level: 1,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Medium",
    description: "Intermediate level",
    level: 2,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Hard",
    description: "Advanced level",
    level: 3,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockDomains: Domain[] = [
  {
    id: "1",
    name: "Algebra",
    description: "Algebraic concepts",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Geometry",
    description: "Geometric concepts",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Data Analysis",
    description: "Statistics and probability",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockSkills: Skill[] = [
  {
    id: "1",
    name: "Linear Equations",
    domainId: "1",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Quadratic Functions",
    domainId: "1",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Triangles",
    domainId: "2",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockQtyTypes: QtyType[] = [
  {
    id: "1",
    name: "Small Set",
    minValue: 5,
    maxValue: 10,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Medium Set",
    minValue: 15,
    maxValue: 25,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Large Set",
    minValue: 30,
    maxValue: 50,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
