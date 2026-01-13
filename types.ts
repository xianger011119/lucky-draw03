
export interface Member {
  id: string;
  name: string;
  isDuplicate: boolean;
}

export interface Group {
  id: number;
  members: Member[];
}

export enum AppTab {
  LIST_MANAGER = 'LIST_MANAGER',
  LOTTERY = 'LOTTERY',
  GROUPING = 'GROUPING'
}
