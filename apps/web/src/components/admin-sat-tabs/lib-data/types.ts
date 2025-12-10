export interface BaseItem {
  id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestType extends BaseItem {}
export interface Subject extends BaseItem {}
export interface Difficulty extends BaseItem {
  level: number;
}
export interface Domain extends BaseItem {}
export interface Skill extends BaseItem {
  domainId?: string;
}
export interface QtyType extends BaseItem {
  minValue: number;
  maxValue: number;
}

export type TabType =
  | "test-type"
  | "subject"
  | "difficulty"
  | "domain"
  | "skills"
  | "qty-type";

export interface TabConfig {
  id: TabType;
  label: string;
  description: string;
}
