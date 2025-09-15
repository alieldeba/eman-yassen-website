import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { getAverageMark } from "@/lib/utils";

function PrintStudentMarks({ student }) {
  return (
    <div className="print-show">
      {student && (
        <main className="max-w-screen-xl mx-auto px-4 md:px-8 mb-3 text-xs">
          <div className="justify-evenly hidden print-flex">
            <h3>الطالب: {student && student.name}</h3>
            <h5>إمضاء ولى الأمر: </h5>
          </div>
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم الإمتحان</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="text-center">درجة الطالب</TableHead>
                <TableHead className="text-center">درجة الإمتحان</TableHead>
                <TableHead className="text-center">النسبة المئوية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...new Array(8)].map((_, idx) => (
                <TableRow key={student.marks[idx]?._id || idx}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="text-center">
                    {student.marks[idx]?.date
                      ? dayjs(student.marks[idx]?.date).format("YYYY-MM-DD")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.marks[idx]?.studentMark
                      ? student.marks[idx]?.studentMark
                      : student.marks[idx]?.studentMark == 0
                        ? 0
                        : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.marks[idx]?.maxMark || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {(student.marks[idx]?.studentMark /
                      student.marks[idx]?.maxMark) *
                    100
                      ? (
                          (student.marks[idx]?.studentMark /
                            student.marks[idx]?.maxMark) *
                          100
                        ).toFixed(2) + "%"
                      : student.marks[idx]?.studentMark == 0
                        ? "0.00%"
                        : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>المجموع الكلي</TableCell>
                <TableCell className="text-center">
                  {student.marks.length > 0
                    ? getAverageMark(student).toFixed(2) + "%"
                    : "-"}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </main>
      )}
    </div>
  );
}

export default PrintStudentMarks;
