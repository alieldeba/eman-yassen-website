interface Student {
  _id: string;
  name: string;
  group: any;
  phone?: string;
  parent_phone?: string;
  code?: string;
  subscription: {
    isSubscribed: boolean;
    price: number | string | null;
    studentPayment: number | string | null;
    paymentDate: Date | string | null;
  };
  marks: Mark[];
  createdAt: Date;
  updatedAt: Date;
}

interface Mark {
  _id: string;
  studentMark: number;
  maxMark: number;
  date: string;
  student: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Group {
  _id: string;
  title: string;
  students: Student[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateGroup {
  title: string;
}
