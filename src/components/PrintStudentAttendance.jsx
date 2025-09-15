import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Square } from "lucide-react";

function StudentAttendance({ students, group }) {
  return (
    <main className="px-5">
      <div className="relative w-full flex items-center justify-center">
        <h3 className="font-bold text-lg underline">{group}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">المعرف</TableHead>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-center">الحضور</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, idx) => (
            <TableRow key={student._id}>
              <TableCell className="font-medium text-center">
                {idx + 1}
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
                <Square strokeWidth={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

export default StudentAttendance;
