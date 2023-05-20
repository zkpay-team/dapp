export interface Group {
  name: string;
  addresses: Address[];
  selected: boolean;
}

export interface Address {
  address: string;
  nickname: string;
  amount: number;
}
